package com.bahadir.healthbridge

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
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
import com.bahadir.healthbridge.worker.HealthScheduler
import com.bahadir.healthbridge.worker.HealthUploadWorker
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import androidx.work.Constraints
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.workDataOf
import java.time.LocalTime

class MainActivity : AppCompatActivity() {
  private lateinit var statusView: TextView
  private lateinit var logView: TextView
  private lateinit var sendNowButton: Button
  private var permissionsGranted = false
  private var sdkStatus: Int = HealthConnectClient.SDK_UNAVAILABLE
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

  private val permissionLauncher = registerForActivityResult(
    PermissionController.createRequestPermissionResultContract()
  ) { granted ->
    if (granted.containsAll(requiredPermissions)) {
      HealthScheduler.schedule(this)
      setPermissionsState(true)
      showStatus("Permissions granted. Scheduled uploads at 08:00 and 16:00.")
    } else {
      setPermissionsState(false)
      showStatus("Health Connect permissions required. Tap to grant.")
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Main Container
    val layout = LinearLayout(this)
    layout.orientation = LinearLayout.VERTICAL
    layout.setPadding(40, 60, 40, 40)

    // Status Text
    statusView = TextView(this)
    statusView.text = "Checking Health Connect..."
    statusView.textSize = 16f
    statusView.setPadding(0, 0, 0, 20)
    layout.addView(statusView)

    // Send Button
    sendNowButton = Button(this)
    sendNowButton.text = "Grant Permissions"
    sendNowButton.isEnabled = false
    sendNowButton.setOnClickListener {
      if (permissionsGranted) {
        enqueueImmediateUpload()
      } else if (sdkStatus == HealthConnectClient.SDK_AVAILABLE) {
        permissionLauncher.launch(requiredPermissions)
      } else {
        openHealthConnectInstall()
      }
    }
    layout.addView(sendNowButton)

    // Log Area Label
    val logLabel = TextView(this)
    logLabel.text = "Transmission Log:"
    logLabel.setPadding(0, 30, 0, 10)
    layout.addView(logLabel)

    // ScrollView for Logs
    val scrollView = android.widget.ScrollView(this)
    logView = TextView(this)
    logView.text = "Waiting for action..."
    logView.textSize = 12f
    scrollView.addView(logView)
    layout.addView(scrollView)

    setContentView(layout)

    sdkStatus = HealthConnectClient.getSdkStatus(this)

    if (sdkStatus != HealthConnectClient.SDK_AVAILABLE) {
      showStatus("Health Connect is not available. Tap to install.")
      setPermissionsState(false, installMode = true)
      return
    }

    checkPermissions()
  }

  override fun onResume() {
    super.onResume()
    if (sdkStatus == HealthConnectClient.SDK_AVAILABLE) {
      checkPermissions()
    }
  }

  private fun checkPermissions() {
    val client = HealthConnectClient.getOrCreate(this)
    val permissionController = client.permissionController
    lifecycleScope.launch {
      val granted = permissionController.getGrantedPermissions()
      if (granted.containsAll(requiredPermissions)) {
        HealthScheduler.schedule(this@MainActivity)
        setPermissionsState(true)
        showStatus("Permissions ready. Scheduled uploads at 08:00 and 16:00.")
      } else {
        setPermissionsState(false)
        showStatus("Health Connect permissions required. Tap to grant.")
      }
    }
  }

  private fun showStatus(message: String) {
    statusView.text = message
  }

  private fun setPermissionsState(granted: Boolean, installMode: Boolean = false) {
    permissionsGranted = granted
    sendNowButton.isEnabled = true
    sendNowButton.text = when {
      granted -> "Send Now"
      installMode -> "Install Health Connect"
      else -> "Grant Permissions"
    }
  }

  private fun enqueueImmediateUpload() {
    val timeOfDay = if (LocalTime.now().hour < 12) "morning" else "afternoon"
    showStatus("Queueing manual upload ($timeOfDay)...")
    logView.text = "Preparing data..."
    
    val constraints = Constraints.Builder()
      .setRequiredNetworkType(NetworkType.CONNECTED)
      .build()
    
    val request = OneTimeWorkRequestBuilder<HealthUploadWorker>()
      .setConstraints(constraints)
      .setInputData(workDataOf(HealthUploadWorker.KEY_TIME_OF_DAY to timeOfDay))
      .build()
      
    WorkManager.getInstance(this).enqueue(request)
    
    // Observe the result
    WorkManager.getInstance(this).getWorkInfoByIdLiveData(request.id)
      .observe(this) { workInfo ->
        if (workInfo != null) {
          when (workInfo.state) {
            androidx.work.WorkInfo.State.SUCCEEDED -> {
              val payload = workInfo.outputData.getString("payload")
              showStatus("✅ Upload Successful!")
              logView.text = formatJson(payload)
            }
            androidx.work.WorkInfo.State.FAILED -> {
              showStatus("❌ Upload Failed.")
              logView.text = "Error occurred during upload."
            }
            androidx.work.WorkInfo.State.RUNNING -> {
               showStatus("⏳ Sending data...")
            }
            else -> {}
          }
        }
      }
  }

  private fun formatJson(jsonStr: String?): String {
    if (jsonStr == null) return "No data returned."
    return try {
      org.json.JSONObject(jsonStr).toString(2)
    } catch (e: Exception) {
      jsonStr
    }
  }

  private fun openHealthConnectInstall() {
    val packageName = "com.google.android.apps.healthdata"
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName"))
    val fallback = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=$packageName"))
    if (intent.resolveActivity(packageManager) != null) {
      startActivity(intent)
    } else {
      startActivity(fallback)
    }
  }
}
