#!/bin/bash
# Claude Code Stop hook: runs the fast gates once per turn (not after every edit).
# Exit 2 keeps Claude working and shows it stderr. Skips if the tree is unchanged since the last run.
# A missing tool turns the gate off, so it says so on stderr (still exit 0).
missing=""
command -v jq >/dev/null 2>&1 || missing="jq"
command -v npm >/dev/null 2>&1 || missing="${missing:+$missing and }npm"
if [ -n "$missing" ]; then echo "stop-gate: skipped, $missing not found on PATH, so the fast gates did not run" >&2; exit 0; fi
root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$root" || exit 0
# Loop guard: if this hook already blocked this stop once, let it through (CI is the backstop).
[ "$(jq -r '.stop_hook_active // false')" = "true" ] && exit 0
[ -z "$(git status --porcelain 2>/dev/null)" ] && exit 0
[ -d node_modules ] || { echo "stop-gate: skipped, node_modules missing (run npm ci)" >&2; exit 0; }

fingerprint() {
  {
    git diff HEAD --binary 2>/dev/null || { git diff --cached --binary; git diff --binary; } 2>/dev/null
    while IFS= read -r -d '' f; do shasum "$f"; done < <(git ls-files -o --exclude-standard -z 2>/dev/null)
  } | shasum | cut -d' ' -f1
}
stamp="$(git rev-parse --git-path stop-gate.sha 2>/dev/null)"
now="$(fingerprint)"
if [ -n "$stamp" ] && [ -n "$now" ] && [ "$(cat "$stamp" 2>/dev/null)" = "$now" ]; then exit 0; fi
status=0
out=$(npm run --silent check:fast 2>&1) || status=$?
[ -n "$stamp" ] && [ -n "$now" ] && printf '%s\n' "$now" >"$stamp" 2>/dev/null
if [ "$status" -ne 0 ]; then echo "$out" | tail -60 >&2; exit 2; fi
exit 0
