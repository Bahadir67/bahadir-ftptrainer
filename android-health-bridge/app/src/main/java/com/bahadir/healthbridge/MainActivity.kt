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
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.TotalCaloriesBurnedRecord
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
  private lateinit var sendNowButton: Button
  private var permissionsGranted = false
  private var sdkStatus: Int = HealthConnectClient.SDK_UNAVAILABLE
  private val requiredPermissions = setOf(
    HealthPermission.getReadPermission(StepsRecord::class),
    HealthPermission.getReadPermission(TotalCaloriesBurnedRecord::class),
    HealthPermission.getReadPermission(RestingHeartRateRecord::class),
    HealthPermission.getReadPermission(HeartRateRecord::class),
    HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
    HealthPermission.getReadPermission(SleepSessionRecord::class)
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
    statusView = TextView(this)
    statusView.text = "Checking Health Connect..."

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

    val layout = LinearLayout(this)
    layout.orientation = LinearLayout.VERTICAL
    layout.setPadding(40, 60, 40, 40)
    layout.addView(statusView)
    layout.addView(sendNowButton)
    setContentView(layout)

    sdkStatus = HealthConnectClient.getSdkStatus(this)

    if (sdkStatus != HealthConnectClient.SDK_AVAILABLE) {
      showStatus("Health Connect is not available. Tap to install.")
      setPermissionsState(false, installMode = true)
      return
    }

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
    val constraints = Constraints.Builder()
      .setRequiredNetworkType(NetworkType.CONNECTED)
      .build()
    val request = OneTimeWorkRequestBuilder<HealthUploadWorker>()
      .setConstraints(constraints)
      .setInputData(workDataOf(HealthUploadWorker.KEY_TIME_OF_DAY to timeOfDay))
      .build()
    WorkManager.getInstance(this).enqueue(request)
    showStatus("Manual upload queued ($timeOfDay).")
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
