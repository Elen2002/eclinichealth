#!/bin/bash
set -e

echo "=========================================="
echo "     FORCE CLEAN SETUP SCRIPT (LINUX)     "
echo "=========================================="

# Kill stuck processes (optional, might require sudo)
# pkill -f node || true
# pkill -f java || true

echo "Backing up corrupted node_modules..."
if [ -d "node_modules" ]; then
    mv node_modules "node_modules_backup_$(date +%s)"
fi
if [ -f "package-lock.json" ]; then
    rm package-lock.json
fi

echo "Installing Project Dependencies (Fresh Start)..."
npm install --legacy-peer-deps

echo "Installing Capacitor (Android Tools)..."
npm install @capacitor/core@6 @capacitor/cli@6 @capacitor/android@6 --save-dev --legacy-peer-deps

echo "Initializing Android Project..."
# Only init if not already configured, otherwise skip or handle error
if [ ! -f "capacitor.config.json" ]; then
    npx cap init eClinic com.eclinichealth.app --web-dir public
fi

echo "Adding Android Platform..."
# Check if android directory exists
if [ ! -d "android" ]; then
    npx cap add android
fi

echo "Configuring Server URL in capacitor.config.json..."
cat > capacitor.config.json <<EOF
{
  "appId": "com.eclinichealth.app",
  "appName": "eClinic",
  "webDir": "public",
  "bundledWebRuntime": false,
  "server": {
    "url": "http://192.168.1.149",
    "cleartext": true
  }
}
EOF

echo "Syncing..."
npx cap sync

echo ""
echo "=========================================="
echo "DONE!"
echo "To build the APK, run these commands:"
echo "cd android"
echo "chmod +x gradlew"
echo "./gradlew assembleDebug"
echo ""
echo "The APK will be in: android/app/build/outputs/apk/debug/app-debug.apk"
echo "=========================================="
