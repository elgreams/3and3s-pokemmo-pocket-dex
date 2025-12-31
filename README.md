# 3&3s Pocket Dex

A PokeMMO Companion Tool.

3&3s Pocket Dex is an **Android-first companion app** for **PokéMMO** that focuses on encounter data and a full Pokédex.
It is a fork of https://github.com/muphy09/3s-PokeMMO-Tool by Brian K. (muphy09) modified to use Capacitor instead of Electron. All credit for features and ux design goes to him.

---

## 🚀 Features
- 📊 **Complete Pokédex** – Catch rates, moves, methods, held items, base stats, and locations for every Gen 1–5 Pokémon. Instantly filter by Kanto, Johto, Hoenn, Sinnoh, or Unova.
- 🧭 **Deep Filtering Search** – Filter Pokémon by type, egg group, abilities, moves, region, and held items. Search Locations, Areas, Hordes, TMs & more!
- 🕹️ **Caught List & Encounter Methods** – Mark Pokémon you've caught inside a Caught List and filter encounter methods for easier hunting! (Lure, Cave, Horde, Grass, etc)
- 🎨 **Custom Color Schemes** – Choose your own colors for rarity and encounter methods.
- 🪄 **Team Builder** – Quickly assemble & save your team to view weak areas - Save important teams for reference.
- 🌍 **Horde Search** – Detailed Horde Search page brings Horde locations for every region. Filter by EV yield, encounter method, horde size, 
- ⚙️ **UI Scaling** – Adjust the app's interface scale from the Options menu.

---

## 📥 Android APK build steps (Capacitor)
1. Install prerequisites:
   - **Android SDK** (via Android Studio) with platform tools installed.
   - **Java/JDK 17** (required by recent Android Gradle Plugin versions).
   - **Gradle/Android Studio** for building and running the `android/` project.
   - Create the file android/local.properties with the contents sdk.dir=/path/to/android/sdk
2. Install dependencies:
   - `npm ci`
3. Build + sync Capacitor:
   - `npm run build`
   - `npm run cap:sync`
4. Assemble the APK:
   - `cd android && ./gradlew assembleDebug`
5. Retrieve the APK from:
   - `android/app/build/outputs/apk/debug/app-debug.apk`

## ⚠️ Android known gaps
- Live OCR / live tracking features are removed.
- Desktop auto-updates, window capture, global shortcuts, and system tray integrations are not supported.
  (Desktop builds are no longer maintained in this fork.)
