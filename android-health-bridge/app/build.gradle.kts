plugins {
  id("com.android.application")
  id("org.jetbrains.kotlin.android")
}

android {
  namespace = "com.bahadir.healthbridge"
  compileSdk = 34

  defaultConfig {
    applicationId = "com.bahadir.healthbridge"
    minSdk = 26
    targetSdk = 34
    versionCode = 1
    versionName = "1.0"

    val apiUrl = (project.findProperty("HEALTH_API_URL") as String?) ?: "https://bahadir-ftptrainer.vercel.app"
    val apiKey = (project.findProperty("HEALTH_API_KEY") as String?) ?: "REPLACE_ME"
    buildConfigField("String", "HEALTH_API_URL", "\"$apiUrl\"")
    buildConfigField("String", "HEALTH_API_KEY", "\"$apiKey\"")
  }

  signingConfigs {
    create("release") {
      val keystorePath = (project.findProperty("RELEASE_KEYSTORE_PATH") as String?) ?: ""
      val alias = (project.findProperty("RELEASE_KEY_ALIAS") as String?) ?: ""
      val keyPassword = (project.findProperty("RELEASE_KEY_PASSWORD") as String?) ?: ""
      val storePassword = (project.findProperty("RELEASE_STORE_PASSWORD") as String?) ?: ""
      if (keystorePath.isNotBlank()) {
        storeFile = file(keystorePath)
      }
      this.keyAlias = alias
      this.keyPassword = keyPassword
      this.storePassword = storePassword
    }
  }

  buildTypes {
    release {
      isMinifyEnabled = false
      signingConfig = signingConfigs.getByName("release")
      proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
  }

  buildFeatures {
    buildConfig = true
  }

  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }

  kotlinOptions {
    jvmTarget = "17"
  }
}

dependencies {
  implementation("androidx.appcompat:appcompat:1.6.1")
  implementation("androidx.core:core-ktx:1.12.0")
  implementation("androidx.activity:activity-ktx:1.8.2")
  implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
  implementation("androidx.work:work-runtime-ktx:2.9.0")
  implementation("androidx.health.connect:connect-client:1.1.0-alpha07")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
