# Capacitor APK Migration Roadmap

## How to use this roadmap
- Each task is a checklist item. When a task is completed, mark it as done by changing `[ ]` to `[x]`.
- If a task requires follow-up sub-tasks, add them directly beneath the parent item.

## Phase 1: Remove OCR + Live Tracking
- [ ] Remove OCR + Live Route/Battle flows in small batches (track each subtask below).
  - [x] Remove Live Route/Battle UI routes/tabs in `src/` (start with `src/components/OptionsMenu.jsx` and any live OCR panels).
  - [x] Remove OCR settings UI/state in `src/` (OCR toggles, debug images, setup forms).
  - [x] Remove OCR Live data wiring in `src/` services/hooks (live reconnect events, OCR polling).
    - Verified `src/services/` + `src/hooks/` have no remaining OCR/live wiring hooks to remove.
  - [x] Remove Live Route/Battle data models/constants in `src/` that are now unused.
  - [x] Remove OCR + Live IPC handlers from `electron/main.js` (e.g., `ocr:*`, `live:*`, `app:getOcrSetup`, `app:saveOcrSetup`).
  - [x] Remove OCR-related preload bridge APIs and file paths from `electron/preload.js`.
  - [x] Remove OCR assets/resources and packaging hooks (e.g., `resources/LiveRouteOCR`, `LiveRouteOCR/`, OCR logs/paths, electron-builder filters in `package.json`).
  - [x] Remove OCR cleanup leftovers in `src/` (dead imports/state tied to OCR settings removal).
  - [x] Validate non-OCR features still function (Pokédex, filters, team builder).


## Phase 2: Decouple Renderer from Electron
- [x] Inventory all `window.app` usage in `src/` and categorize (updates, version, file IO, OCR).
- [x] Add a web/Capacitor-safe app bridge module (e.g., `src/services/appBridge.js`) for remaining runtime needs.
- [x] Update UI components to use the new app bridge (remove direct `window.app` references).
- [x] Remove unused `window.app` bindings in `electron/preload.js`.
- [x] Verify the renderer runs without Electron (`npm run dev`).

## Phase 3: Initialize Capacitor
- [x] Add Capacitor dependencies and run `npx cap init` (webDir = `dist`).
- [x] Add `capacitor.config.*` with `appId`, `appName`, `webDir: "dist"`.
- [x] Add Android platform (`npx cap add android`).
- [x] Add npm scripts for `cap sync` and Android build tasks.
- [x] Document local prerequisites (Android SDK, Java).

## Phase 4: Replace Desktop-only Features
- [x] Remove or replace auto-updater flows (`electron-updater`, update IPC, UI update buttons).
- [x] Remove desktop capture/window enumeration/notifications APIs (Electron-only).
- [x] Document unsupported desktop-only features on Android (e.g., live OCR).
  - **Android unsupported (desktop-only):** live OCR/live tracking, desktop auto-updates, desktop/window capture, global shortcuts, and Electron system tray/menu integrations.
- [x] Confirm app runs without Electron main/preload at all.

## Phase 5: APK Build Pipeline + Docs
- [x] Define a reproducible APK build pipeline (`npm run build` → `npx cap sync android` → Gradle assemble).
- [x] Remove/deprecate Electron packaging scripts (`dist`, `pack`, etc.) if Android-only.
- [x] Update README or migration docs with Android build steps and known gaps.
- [x] Ensure Android assets/icons are correctly configured in `android/app/src/main/res`.
- [x] Add CI job to build APK and upload artifacts (if CI exists).

## Phase 6: Storage + Persistence
- [x] Replace `fs`-based persistence with Capacitor storage (Filesystem/Preferences).
- [x] Update UI to use the new storage layer (e.g., `src/services/storage.js`).
- [x] Remove desktop-specific path assumptions (`LOCALAPPDATA`, `.local/share`).
- [x] Validate settings persistence and any data migration requirements.
- [x] Route export/share actions through Android share intents as needed (no export flows found yet).

## Phase 7: Android-only Cleanup
- [x] Remove Electron entry points (`electron/` folder) once unused.
- [x] Remove Electron dependencies (`electron`, `electron-builder`, `electron-updater`) and `main` entry from `package.json`.
- [x] Update docs to reflect Android-only support and remove desktop install instructions.
- [x] Remove unused desktop assets/resources.
- [ ] Validate `npm run dev` and Android build both work post-cleanup.
