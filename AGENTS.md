# Agent Instructions

## Project context
This repository hosts the PokeMMO Tool Electron application. The immediate roadmap is to de-scope OCR-driven live features and prepare the app for a Capacitor-based Android build.

## Current goals
1. **Remove OCR + live tracking**
   - Eliminate all OCR dependencies, helpers, and UI/UX tied to OCR.
   - Remove **Live Route** and **Live Battle** features (tabs, services, data flows, background helpers).
   - Strip OCR settings, logs, assets, and packaging steps (e.g., LiveRouteOCR helper, tesseract assets).
2. **Capacitor migration**
   - Wrap the existing Electron/Frontend app into Capacitor for Android.
   - Define a reproducible build pipeline that outputs an APK.
   - Document any platform-specific gaps or unsupported Electron APIs.
   - Do **not** maintain a desktop build in this fork; Android via Capacitor is the target.
3. **Process foundation**
   - Create a clear, incremental migration plan with checkpoints.
   - Track deprecated modules and removal milestones.

## Notes
- Keep changes modular so we can validate non-OCR features remain stable.
- Prefer removing code paths fully rather than leaving dormant flags.
- Update documentation and scripts to match the new direction.
- If any requirements are unclear, finish the PR and then ask for clarification.

## Roadmap tracking
- The Capacitor migration roadmap is tracked in `docs/ROADMAP.md`.
- When you complete a roadmap task, update the corresponding checklist item to `[x]` in the same PR.
