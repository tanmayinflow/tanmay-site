# Immutable desktop source fixtures

The 24 November 2026 security revision removes unpublished journal paragraphs and article metadata from the two source fixtures and from their historical reconstruction data. The original files and source guards were archived outside the public website repository before redaction. The affected hashes and offsets now describe the public, redacted snapshots. All other content checks still run.

The seven files originate in the GTP handoff imported on 2026-09-17. `provenance.json` records each package-relative path and the byte count and SHA-256 of the fixture in this checkout. The complete original package is under the website project's `References/GTP-2026-09-17/`.

The M10 source tests use these inputs so a fresh checkout can verify the protected shared files, the nine restored fonts and the authorized M7/M9/M10 changes. The original hashes are preserved with the private archive.

Keep these fixtures unchanged. An explicitly approved future change belongs in its own recorded delta rather than a rewritten baseline. These test fixtures are not included in the public Vite build.
