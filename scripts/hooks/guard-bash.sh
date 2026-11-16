#!/bin/bash
# Claude Code PreToolUse hook (Bash). Blocks what only the human may do:
#   1. git commit/push and destructive git, even wrapped (sh -c, git -C, absolute path) or with --no-verify
#   2. changing dependencies: npm install/add/update/remove, npx and other package runners
# Allowed: npm ci, npm run, npm test, npm ls, npm outdated, npm audit (without fix).
# Known false positives: read-only commands that merely contain these words (grep "npm install" docs).
command -v jq >/dev/null 2>&1 || { echo "guard-bash: jq is required; install it." >&2; exit 2; }
cmd=$(jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0
if echo "$cmd" | grep -Eq 'git[^|;&]*[[:space:]](commit|push|stash|clean|rebase|restore)([^[:alnum:]_-]|$)|git[^|;&]*reset[[:space:]]+--hard|git[^|;&]*checkout[[:space:]]+(--[[:space:]]|\.)|git[^|;&]*branch[[:space:]]+(-D|--delete)|--no-verify'; then
  echo "Blocked: commit, push, destructive git and --no-verify are reserved for the human. Report your changes and stop." >&2
  exit 2
fi
b='(^|[^[:alnum:]_.-])'; e='([^[:alnum:]_.-]|$)'
while IFS= read -r seg; do
  echo "$seg" | grep -Eq "${b}(npm|pnpm|yarn|bun|corepack|npx|pnpx|bunx)${e}" || continue
  if echo "$seg" | grep -Eq "${b}(npx|pnpx|bunx|pnpm|yarn|bun|corepack)${e}|${b}npm[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(install|i|add|update|up|upgrade|uninstall|remove|rm|link|exec|x|dedupe|prune|rebuild|install-test|it|in|ins|inst|insta|instal|isnt|isnta|isntal|isntall)${e}|${b}npm[[:space:]]+audit[[:space:]]+fix${e}"; then
    echo "Blocked: changing dependencies or running one-off packages is reserved for the human. Use npm ci / npm run, or ask the project manager to approve the package." >&2
    exit 2
  fi
done < <(printf '%s\n' "$cmd" | tr ';&|' '\n\n\n')
exit 0
