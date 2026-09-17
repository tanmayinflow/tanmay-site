# Immutable desktop source fixtures

These seven files are byte-for-byte copies from the original GTP handoff, imported on 2026-09-17. `provenance.json` records each original package-relative path, byte count and SHA-256. The complete preserved package is under the website project's `References/GTP-2026-09-17/`.

The existing M10 source tests use these minimal inputs so a fresh checkout does not depend on another local folder. The manifests protect all original shared files and nine restored fonts. Original source bytes are retained only where the exact authorized M7/M9/M10 delta reconstruction needs them. No product code, expected hash or approved replacement was changed for migration.

Keep these fixtures unchanged. An explicitly approved future change belongs in its own recorded delta rather than a rewritten baseline. These test fixtures are not included in the public Vite build.
