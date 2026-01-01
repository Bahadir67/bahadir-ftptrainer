# Health Bridge (Android)

Uploads Health Connect metrics to the FTP Trainer API twice a day (08:00 + 16:00).

## Setup

1) Open `android-health-bridge` in Android Studio.
2) Copy `android-health-bridge/gradle.properties.example` to `android-health-bridge/gradle.properties`.
3) Fill in `HEALTH_API_KEY` and release keystore values.
4) Build and install on your Android device.
5) Grant Health Connect permissions on first launch.

## What it sends

- `timeOfDay`: `morning` or `afternoon`
- `metrics`: numeric values (missing values are sent as `null`)
- `source`: `health-connect`

## Notes

- Health Connect must be installed and up to date on the phone.
- `gradle.properties` is gitignored; keep secrets there.
- If you change the API URL or key, reinstall the app.
