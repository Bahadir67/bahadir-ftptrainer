package com.bahadir.healthbridge.worker

import android.content.Context
import android.util.Log
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.BodyFatRecord
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.NutritionRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.PowerRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.SpeedRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.TotalCaloriesBurnedRecord
import androidx.health.connect.client.records.Vo2MaxRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.bahadir.healthbridge.BuildConfig
import java.io.BufferedOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import kotlin.math.roundToInt
import org.json.JSONObject

class HealthUploadWorker(
  context: Context,
  params: WorkerParameters
) : CoroutineWorker(context, params) {
  override suspend fun doWork(): Result {
    val sdkStatus = HealthConnectClient.getSdkStatus(applicationContext)
    if (sdkStatus != HealthConnectClient.SDK_AVAILABLE) {
      return Result.retry()
    }

    val timeOfDay = inputData.getString(KEY_TIME_OF_DAY) ?: "morning"
    val client = HealthConnectClient.getOrCreate(applicationContext)
    val granted = client.permissionController.getGrantedPermissions()
    if (!granted.containsAll(requiredPermissions)) {
      return Result.failure()
    }

    val zoneId = ZoneId.systemDefault()
    val today = LocalDate.now(zoneId)
    val dayStart = today.atStartOfDay(zoneId).toInstant()
    val dayEnd = today.plusDays(1).atStartOfDay(zoneId).toInstant()

    val metrics = readMetrics(client, dayStart, dayEnd, zoneId)
    val payload = buildPayload(today, timeOfDay, metrics)

    return if (postPayload(payload)) {
      Result.success(androidx.work.workDataOf("payload" to payload))
    } else {
      Result.retry()
    }
  }

  private suspend fun readMetrics(
    client: HealthConnectClient,
    dayStart: Instant,
    dayEnd: Instant,
    zoneId: ZoneId
  ): Map<String, Double?> {
    val metrics = mutableMapOf<String, Double?>()

    val steps = client.readRecords(
      ReadRecordsRequest(StepsRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records.sumOf { it.count }
    metrics["steps"] = steps.toDouble()

    val calories = client.readRecords(
      ReadRecordsRequest(TotalCaloriesBurnedRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records.sumOf { it.energy.inKilocalories }
    metrics["calories"] = calories

    val restingRecords = client.readRecords(
      ReadRecordsRequest(RestingHeartRateRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["restingHr"] = restingRecords.takeIf { it.isNotEmpty() }
      ?.map { it.beatsPerMinute.toDouble() }
      ?.average()

    val hrvRecords = client.readRecords(
      ReadRecordsRequest(HeartRateVariabilityRmssdRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["hrv"] = hrvRecords.takeIf { it.isNotEmpty() }
      ?.map { it.heartRateVariabilityMillis }
      ?.average()

    val heartRateRecords = client.readRecords(
      ReadRecordsRequest(HeartRateRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    val hrSamples = heartRateRecords.flatMap { it.samples }
    metrics["avgHr"] = hrSamples.takeIf { it.isNotEmpty() }
      ?.map { it.beatsPerMinute.toDouble() }
      ?.average()
    metrics["maxHr"] = hrSamples.maxOfOrNull { it.beatsPerMinute }?.toDouble()

    val sleepSession = latestSleepSession(client, dayStart, dayEnd)
    val sleepHours = sleepSession?.let { Duration.between(it.startTime, it.endTime).toMinutes() / 60.0 }
    metrics["sleepHours"] = sleepHours

    val sleepAvgHr = sleepSession?.let { session ->
      val sleepStart = session.startTime
      val sleepEnd = session.endTime
      val sleepSamples = hrSamples.filter { sample ->
        !sample.time.isBefore(sleepStart) && sample.time.isBefore(sleepEnd)
      }
      sleepSamples.takeIf { it.isNotEmpty() }
        ?.map { it.beatsPerMinute.toDouble() }
        ?.average()
    }
    metrics["sleepAvgHr"] = sleepAvgHr

    // New Metrics Reading Logic
    // Distance
    val distanceRecords = client.readRecords(
      ReadRecordsRequest(DistanceRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["distance"] = distanceRecords.sumOf { it.distance.inMeters }

    // Weight (Latest)
    val weightRecords = client.readRecords(
      ReadRecordsRequest(WeightRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["weight"] = weightRecords.maxByOrNull { it.time }?.weight?.inKilograms

    // Body Fat (Latest)
    val bodyFatRecords = client.readRecords(
      ReadRecordsRequest(BodyFatRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["bodyFat"] = bodyFatRecords.maxByOrNull { it.time }?.percentage?.value

    // VO2 Max (Latest)
    val vo2MaxRecords = client.readRecords(
      ReadRecordsRequest(Vo2MaxRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["vo2Max"] = vo2MaxRecords.maxByOrNull { it.time }?.vo2MillilitersPerMinuteKilogram

    // Oxygen Saturation (Average)
    val spo2Records = client.readRecords(
      ReadRecordsRequest(OxygenSaturationRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["spo2"] = spo2Records.takeIf { it.isNotEmpty() }
      ?.map { it.percentage.value }
      ?.average()

    // Nutrition (Total Calories)
    val nutritionRecords = client.readRecords(
      ReadRecordsRequest(NutritionRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    metrics["nutritionCalories"] = nutritionRecords.sumOf { it.energy?.inKilocalories ?: 0.0 }

    // Exercise Sessions (Total Duration)
    val exerciseRecords = client.readRecords(
      ReadRecordsRequest(ExerciseSessionRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    val exerciseDuration = exerciseRecords.sumOf { Duration.between(it.startTime, it.endTime).toMinutes() }
    metrics["exerciseDuration"] = exerciseDuration.toDouble()

    // Speed (Average)
    val speedRecords = client.readRecords(
      ReadRecordsRequest(SpeedRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    val speedSamples = speedRecords.flatMap { it.samples }
    metrics["avgSpeed"] = speedSamples.takeIf { it.isNotEmpty() }
      ?.map { it.speed.inMetersPerSecond }
      ?.average()

    // Power (Average)
    val powerRecords = client.readRecords(
      ReadRecordsRequest(PowerRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    val powerSamples = powerRecords.flatMap { it.samples }
    metrics["avgPower"] = powerSamples.takeIf { it.isNotEmpty() }
      ?.map { it.power.inWatts }
      ?.average()

    // Fallback Logic: If RestingHR is missing, use SleepAvgHR
    if (metrics["restingHr"] == null && metrics["sleepAvgHr"] != null) {
      metrics["restingHr"] = metrics["sleepAvgHr"]
    }

    // Energy Score Calculation (Robust)
    metrics["energyScore"] = calculateEnergyScore(
      metrics["hrv"],
      metrics["restingHr"],
      metrics["sleepHours"]
    )
    metrics["bodyBattery"] = metrics["energyScore"]

    return metrics
  }

  private fun calculateEnergyScore(hrv: Double?, rhr: Double?, sleepHours: Double?): Double? {
    // Absolute minimum requirement: We need at least Sleep Duration to make a guess.
    if (sleepHours == null) return null

    // 1. Sleep Score (Target: 7.5 hours -> 100 pts)
    val sleepScore = ((sleepHours / 7.5) * 100.0).coerceIn(0.0, 100.0)

    // 2. RHR Score (Target: 40-60bpm -> High pts)
    val rhrScore = if (rhr != null) {
      (100.0 - (rhr - 40.0) * 2.0).coerceIn(0.0, 100.0)
    } else {
      50.0 // Neutral if totally missing
    }

    // 3. HRV Score (If available)
    return if (hrv != null) {
      val hrvTarget = 50.0
      val hrvScore = ((hrv / hrvTarget) * 100.0).coerceIn(0.0, 100.0)
      
      // Standard Formula: Sleep 40%, HRV 40%, RHR 20%
      val total = (sleepScore * 0.40) + (hrvScore * 0.40) + (rhrScore * 0.20)
      total.roundToInt().toDouble()
    } else {
      // Fallback Formula (No HRV): Sleep 60%, RHR 40%
      // This allows estimation even without HRV data
      val total = (sleepScore * 0.60) + (rhrScore * 0.40)
      total.roundToInt().toDouble()
    }
  }

  private suspend fun latestSleepSession(
    client: HealthConnectClient,
    dayStart: Instant,
    dayEnd: Instant
  ): SleepSessionRecord? {
    val sessions = client.readRecords(
      ReadRecordsRequest(SleepSessionRecord::class, timeRangeFilter = TimeRangeFilter.between(dayStart, dayEnd))
    ).records
    return sessions.maxByOrNull { it.endTime }
  }

  private fun buildPayload(
    date: LocalDate,
    timeOfDay: String,
    metrics: Map<String, Double?>
  ): String {
    val metricsJson = JSONObject()
    metrics.forEach { (key, value) ->
      if (value == null) {
        metricsJson.put(key, JSONObject.NULL)
      } else {
        metricsJson.put(key, ((value * 100.0).roundToInt() / 100.0))
      }
    }

    val payload = JSONObject()
    payload.put("date", date.toString())
    payload.put("timeOfDay", timeOfDay)
    payload.put("metrics", metricsJson)
    payload.put("source", "health-connect")
    payload.put("includeInMemory", true)
    return payload.toString()
  }

  private fun postPayload(body: String): Boolean {
    Log.d("HealthBridge", "Posting daily health payload: $body")
    val url = URL("${BuildConfig.HEALTH_API_URL}/api/health/daily")
    val connection = url.openConnection() as HttpURLConnection
    return try {
      connection.requestMethod = "POST"
      connection.setRequestProperty("Content-Type", "application/json")
      connection.setRequestProperty("x-api-key", BuildConfig.HEALTH_API_KEY)
      connection.doOutput = true
      BufferedOutputStream(connection.outputStream).use { output ->
        output.write(body.toByteArray(StandardCharsets.UTF_8))
      }
      connection.responseCode in 200..299
    } catch (_: Exception) {
      false
    } finally {
      connection.disconnect()
    }
  }

  companion object {
    const val KEY_TIME_OF_DAY = "timeOfDay"

    private val requiredPermissions = setOf(
      HealthPermission.getReadPermission(StepsRecord::class),
      HealthPermission.getReadPermission(TotalCaloriesBurnedRecord::class),
      HealthPermission.getReadPermission(RestingHeartRateRecord::class),
      HealthPermission.getReadPermission(HeartRateRecord::class),
      HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
      HealthPermission.getReadPermission(SleepSessionRecord::class),
      HealthPermission.getReadPermission(DistanceRecord::class),
      HealthPermission.getReadPermission(WeightRecord::class),
      HealthPermission.getReadPermission(BodyFatRecord::class),
      HealthPermission.getReadPermission(Vo2MaxRecord::class),
      HealthPermission.getReadPermission(OxygenSaturationRecord::class),
      HealthPermission.getReadPermission(NutritionRecord::class),
      HealthPermission.getReadPermission(ExerciseSessionRecord::class),
      HealthPermission.getReadPermission(SpeedRecord::class),
      HealthPermission.getReadPermission(PowerRecord::class)
    )
  }
}
