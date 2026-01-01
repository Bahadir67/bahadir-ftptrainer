package com.bahadir.healthbridge.worker

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.workDataOf
import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime

object HealthScheduler {
  private const val MORNING_WORK = "health-upload-morning"
  private const val AFTERNOON_WORK = "health-upload-afternoon"

  fun schedule(context: Context) {
    val workManager = WorkManager.getInstance(context)
    val constraints = Constraints.Builder()
      .setRequiredNetworkType(NetworkType.CONNECTED)
      .build()

    val morningDelay = nextDelay(LocalTime.of(8, 0))
    val afternoonDelay = nextDelay(LocalTime.of(16, 0))

    val morningRequest = PeriodicWorkRequestBuilder<HealthUploadWorker>(Duration.ofDays(1))
      .setInitialDelay(morningDelay)
      .setConstraints(constraints)
      .setInputData(workDataOf(HealthUploadWorker.KEY_TIME_OF_DAY to "morning"))
      .build()

    val afternoonRequest = PeriodicWorkRequestBuilder<HealthUploadWorker>(Duration.ofDays(1))
      .setInitialDelay(afternoonDelay)
      .setConstraints(constraints)
      .setInputData(workDataOf(HealthUploadWorker.KEY_TIME_OF_DAY to "afternoon"))
      .build()

    workManager.enqueueUniquePeriodicWork(
      MORNING_WORK,
      ExistingPeriodicWorkPolicy.UPDATE,
      morningRequest
    )
    workManager.enqueueUniquePeriodicWork(
      AFTERNOON_WORK,
      ExistingPeriodicWorkPolicy.UPDATE,
      afternoonRequest
    )
  }

  private fun nextDelay(target: LocalTime): Duration {
    val now = LocalDateTime.now()
    var next = now.toLocalDate().atTime(target)
    if (!next.isAfter(now)) {
      next = next.plusDays(1)
    }
    return Duration.between(now, next)
  }
}

