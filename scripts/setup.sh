#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# Nexus Digital AEM UE POC — One-Command Setup
# Installs prerequisites, generates certs, starts all services.
# Safe to re-run — each step checks before acting.
# ──────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${CYAN}[info]${NC} $1"; }
ok()    { echo -e "${GREEN}[ok]${NC}   $1"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $1"; }
err()   { echo -e "${RED}[err]${NC}  $1"; }

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

info "Project directory: $PROJECT_DIR"

# ── Step 1: Homebrew ──────────────────────────────────────────────────────────
if ! command -v brew &>/dev/null; then
  info "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ok "Homebrew installed"
else
  ok "Homebrew already installed ($(brew --version | head -1))"
fi

# ── Step 2: System dependencies (Node 20+, Java 17+, Python 3, mkcert) ────────
PACKAGES=()
command -v node &>/dev/null || PACKAGES+=("node@20")
command -v java &>/dev/null || PACKAGES+=("openjdk@17")
command -v python3 &>/dev/null || PACKAGES+=("python3")
command -v mkcert &>/dev/null || PACKAGES+=("mkcert")

if [ ${#PACKAGES[@]} -gt 0 ]; then
  info "Installing: ${PACKAGES[*]}"
  brew install "${PACKAGES[@]}"
  for pkg in "${PACKAGES[@]}"; do
    ok "$pkg installed"
  done
else
  ok "All brew packages already installed"
fi

# Ensure Node is linked (brew node@20 is keg-only)
if ! command -v node &>/dev/null; then
  brew link --overwrite node@20 2>/dev/null || true
fi

# ── Step 3: local-ssl-proxy ───────────────────────────────────────────────────
if ! command -v local-ssl-proxy &>/dev/null; then
  info "Installing local-ssl-proxy (global npm)..."
  npm install -g local-ssl-proxy
  ok "local-ssl-proxy installed"
else
  ok "local-ssl-proxy already installed"
fi

# ── Step 4: mkcert CA ─────────────────────────────────────────────────────────
# mkcert -install is idempotent — safe to run every time
info "Installing mkcert CA (idempotent)..."
mkcert -install; MKCERT_EXIT=$?
if [ $MKCERT_EXIT -ne 0 ]; then
  err "mkcert -install failed (exit $MKCERT_EXIT)"
  exit 1
fi
ok "mkcert CA installed"

# ── Step 5: Generate TLS certificates ─────────────────────────────────────────
if [ ! -f scripts/certs/localhost+2.pem ]; then
  info "Generating TLS certificates..."
  mkdir -p scripts/certs
  mkcert localhost 127.0.0.1 ::1
  mv localhost+2.pem localhost+2-key.pem scripts/certs/
  ok "Certificates generated in scripts/certs/"
else
  ok "Certificates already exist in scripts/certs/"
fi

# ── Step 6: Install React dependencies ────────────────────────────────────────
if [ ! -d react-app/node_modules ]; then
  info "Installing React dependencies..."
  (cd react-app && npm install)
  ok "React dependencies installed"
else
  ok "React dependencies already installed (node_modules exists)"
fi

# ── Step 7: Push content to AEM (if AEM is running) ───────────────────────────
AEM_RUNNING=false
if curl -sf -u admin:admin http://localhost:4502/libs/granite/core/content/login.html >/dev/null 2>&1; then
  AEM_RUNNING=true
  info "AEM is running — pushing demo content..."
  python3 scripts/push-content-to-aem.py
  ok "Demo content pushed to AEM"
else
  warn "AEM not reachable at http://localhost:4502 — skipping content push"
  info "  The React app will use mock-content.json fallback"
  info "  To install AEM SDK: download from https://experience.adobe.com/#/downloads"
  info "  Then run: java -jar aem-author-p<version>.jar"
fi

# ── Step 8: Start the SSL proxy (8443→AEM, 8001→UES) ──────────────────────────
if lsof -i :8443 -i :8001 >/dev/null 2>&1; then
  warn "SSL proxy already running on :8443 and/or :8001"
  info "  Restart it later with: kill \$(lsof -t -i:8443 -i:8001) && node scripts/ssl-proxy.js"
else
  info "Starting SSL proxy on :8443 and :8001..."
  node scripts/ssl-proxy.js &
  sleep 2
  if lsof -i :8443 >/dev/null 2>&1 && lsof -i :8001 >/dev/null 2>&1; then
    ok "SSL proxy running on :8443 (→AEM) and :8001 (→UES)"
  else
    err "SSL proxy failed to start"
    exit 1
  fi
fi

# ── Step 9: Start the UE Service ──────────────────────────────────────────────
if lsof -i :8000 >/dev/null 2>&1; then
  warn "UE Service already running on :8000"
else
  info "Starting Universal Editor Service on :8000..."
  (cd ue-service && UES_PORT=8000 UES_TLS_REJECT_UNAUTHORIZED=false \
    UES_CORS_PRIVATE_NETWORK=true UES_DISABLE_IMS_VALIDATION=true \
    node universal-editor-service.cjs &)
  sleep 3
  if curl -sfk https://localhost:8000/ping >/dev/null 2>&1; then
    ok "UE Service running on :8000"
  else
    warn "UE Service may not be ready yet — check later with: curl -sk https://localhost:8000/ping"
  fi
fi

# ── Step 10: Start Vite dev server ────────────────────────────────────────────
if lsof -i :3100 >/dev/null 2>&1; then
  warn "Vite dev server already running on :3100"
else
  info "Starting Vite dev server on :3100..."
  (cd react-app && npm run dev &)
  sleep 3
  if curl -sf http://localhost:3100 >/dev/null 2>&1; then
    ok "Vite dev server running on :3100"
  else
    warn "Vite may not be ready yet — check later with: curl -s http://localhost:3100"
  fi
fi

# ── Step 11: Start React HTTPS proxy (3000→3100) ──────────────────────────────
if lsof -i :3000 >/dev/null 2>&1; then
  warn "React HTTPS proxy already running on :3000"
else
  info "Starting local-ssl-proxy on :3000 (→ Vite :3100)..."
  local-ssl-proxy --source 3000 --target 3100 \
    --cert scripts/certs/localhost+2.pem \
    --key scripts/certs/localhost+2-key.pem &
  sleep 2
  if lsof -i :3000 >/dev/null 2>&1; then
    ok "React HTTPS proxy running on :3000"
  else
    warn "HTTPS proxy may not be ready — check later with: curl -s https://localhost:3000"
  fi
fi

# ── Final verification ────────────────────────────────────────────────────────
echo ""
info "=== Service Status ==="
for port in 3000 3100 4502 8000 8001 8443; do
  if lsof -i :$port >/dev/null 2>&1; then
    pid=$(lsof -ti :$port)
    ok ":$port — running (PID $pid)"
  else
    case $port in
      4502) warn ":$port — AEM (optional, skip if not needed)" ;;
      3000) err ":$port — React HTTPS proxy" ;;
      3100) err ":$port — Vite dev server" ;;
      8000) err ":$port — UE Service" ;;
      8001) err ":$port — UES proxy" ;;
      8443) err ":$port — AEM proxy" ;;
    esac
  fi
done

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  All services started!${NC}"
echo ""
echo -e "  ${CYAN}Visit the editor:${NC}"
echo -e "  https://experience.adobe.com/#/@eon/aem/editor/canvas/localhost:3000"
echo ""
echo -e "  ${CYAN}Visit the app directly (to accept cert):${NC}"
echo -e "  https://localhost:3000"
echo ""
echo -e "  ${YELLOW}Notes:${NC}"
echo -e "  - Visit https://localhost:3000 once in Chrome to accept the cert"
echo -e "  - If AEM is not running, content falls back to mock-content.json"
echo -e "  - For saving edits, configure auth in UE editor toolbar:"
echo -e "    Authorization: Basic YWRtaW46YWRtaW4="
echo -e "${GREEN}══════════════════════════════════════════════════════════${NC}"
