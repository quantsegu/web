#!/usr/bin/env bash
# Register the GraQle MCP server with the Codex CLI (mirrors .mcp.json).
# Usage: scripts/add-graqle-to-codex.sh [--force]
set -euo pipefail

NAME="graqle"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GRAQ_BIN="${GRAQ_BIN:-/Users/lakshmisegu/opt/miniconda3/bin/graq}"
CONFIG="$REPO_ROOT/graqle.yaml"

command -v codex >/dev/null || { echo "codex CLI not found on PATH" >&2; exit 1; }
[[ -x "$GRAQ_BIN" ]] || { echo "graq not found at $GRAQ_BIN (set GRAQ_BIN)" >&2; exit 1; }

if codex mcp get "$NAME" >/dev/null 2>&1; then
  if [[ "${1:-}" == "--force" ]]; then
    codex mcp remove "$NAME"
  else
    echo "MCP server '$NAME' already exists in Codex. Re-run with --force to replace it." >&2
    exit 1
  fi
fi

# Codex launches servers from its own cwd, so pass an absolute config path.
# NEO4J_PASSWORD is forwarded only if set; note it is stored in ~/.codex/config.toml.
env_args=()
if [[ -n "${NEO4J_PASSWORD:-}" ]]; then
  env_args+=(--env "NEO4J_PASSWORD=$NEO4J_PASSWORD")
fi

codex mcp add "$NAME" "${env_args[@]}" -- "$GRAQ_BIN" mcp serve --config "$CONFIG"

echo
codex mcp get "$NAME"
