# Telemetry integration (legacy desktop)

Telemetry remains available for legacy desktop analytics and CLI tooling, but the
Android APK build no longer ships a telemetry client. The service is kept online to
support historical reporting and the `tools/install-telemetry-stats.js` script.

## Endpoints

- **Install POST endpoint:** `https://telemetry.pokemmo-tool.app/install`
- **Stats endpoint:** `https://telemetry.pokemmo-tool.app/stats`

Both endpoints accept JSON responses and support bearer authentication. When the
`POKEMMO_TOOL_TELEMETRY_KEY` environment variable is set the CLI utilities include it
automatically using the `Authorization` header.

## Local environment configuration

A `.env.telemetry` file is checked into the repository root with the default endpoint
values. You can edit that file directly or copy its contents to a personal `.env`:

```bash
cp .env.telemetry .env
# edit the key if you have one
```

The stats script will try to load `.env.telemetry` first, then fall back to `.env` when
you run it from the project root:

```bash
node tools/install-telemetry-stats.js
```

To request JSON output you can use the `--json` flag:

```bash
node tools/install-telemetry-stats.js --json
```

If your deployment exposes a different stats path set
`POKEMMO_TOOL_TELEMETRY_STATS_URL` in the env file. When omitted, the CLI automatically
appends `/stats` to the POST endpoint.

When the telemetry API is unreachable the CLI falls back to GitHub release download
counts. The asset naming convention keeps the per-platform/per-version grouping intact.
Set `POKEMMO_TOOL_TELEMETRY_FALLBACK=none` to force the primary service or change the
fallback repository with `POKEMMO_TOOL_TELEMETRY_GITHUB_OWNER` and
`POKEMMO_TOOL_TELEMETRY_GITHUB_REPO`.

## Release automation (deprecated)

Legacy desktop pipelines previously generated `resources/telemetry.config.json` during
packaging so Electron builds could bundle telemetry defaults. Android builds no longer
consume this config, and no release automation is required for Capacitor APKs.
