# AGENTS.md — Nexus Digital AEM UE POC

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
│  ┌───────────────────────────────────────────────┐   │
│  │   Universal Editor (cloud)                    │   │
│  │   ┌───────────────────────────────────────┐   │   │
│  │   │ iframe: React SPA (HashRouter)        │   │   │
│  │   │ 23 components, 6 pages               │   │   │
│  │   │ UE-instrumented                      │   │   │
│  │   └───────────────────────────────────────┘   │   │
│  └───────┬───────────────────────┬───────────────┘   │
│          │ HTTPS :3000            │ HTTPS :8001        │
└──────────┼────────────────────────┼────────────────────┘
           ▼                        ▼
   ┌────────────────┐      ┌──────────────┐
   │ local-ssl-proxy │      │ SSL Proxy    │
   │ (mkcert cert)   │      │ (injects     │
   │ → Vite :3100    │      │  Basic auth  │
   └───────┬─────────┘      │  fallback)   │
           │                └──────┬───────┘
           ▼                       ▼
   ┌──────────────┐        ┌──────────────┐
   │ Vite Dev     │        │ UE Service   │
   │ :3100 (HTTP) │        │ :8000 (HTTP) │
   └──────────────┘        └──────┬───────┘
                                  │ HTTPS :8443 (server-side)
                                  ▼
                           ┌──────────────┐
                           │ SSL Proxy    │
                           │ (injects     │
                           │  Basic auth) │
                           └──────┬───────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │ AEM SDK      │
                           │ :4502 (HTTP) │
                           └──────────────┘
```

## Auth Flow

**Both SSL proxies inject `Basic YWRtaW46YWRtaW4=` as a fallback**, but only when the request lacks an existing `Authorization` header. This means:

1. **`:8443` (AEM proxy)**: Injects Basic auth so UES→AEM calls always work. The UE Service uses its own Authorization header (from the user's config or the proxy fallback) when calling AEM.
2. **`:8001` (UES proxy)**: Injects Basic auth to bootstrap the editor. The `/configuration` endpoint requires auth even with `UES_DISABLE_IMS_VALIDATION=true`. Without this fallback, the editor can never load its UI (chicken-and-egg: UI needs config, config needs auth, auth configured in UI). Once the editor loads, the user can configure explicit auth in the Authentication headers panel.

**If the user configures `Authorization: Basic YWRtaW46YWRtaW4=` in the editor UI**, those requests pass through with the original header (the proxy skips injection when the header is already present).

## Ports & Services

| Service | Port | Protocol | URL | Start Command |
|---|---|---|---|---|
| **React HTTPS** | 3000 | HTTPS | `https://localhost:3000` | `local-ssl-proxy --source 3000 --target 3100 --cert scripts/certs/localhost+2.pem --key scripts/certs/localhost+2-key.pem` |
| **Vite Dev** | 3100 | HTTP | `http://localhost:3100` | `cd react-app && npm run dev` |
| **AEM Author** | 4502 | HTTP | `http://localhost:4502` | (external — AEM SDK jar) |
| **AEM Proxy** | 8443 | HTTPS | `https://localhost:8443` | `node scripts/ssl-proxy.js` (injects Basic auth, strips XFO, fixes SameSite cookies) |
| **UES Backend** | 8000 | HTTP | `http://localhost:8000` | `UES_PORT=8000 UES_TLS_REJECT_UNAUTHORIZED=false UES_CORS_PRIVATE_NETWORK=true UES_DISABLE_IMS_VALIDATION=true node universal-editor-service.cjs` |
| **UES Proxy** | 8001 | HTTPS | `https://localhost:8001` | `node scripts/ssl-proxy.js` (injects Basic auth fallback to bootstrap; same process as :8443) |
| **Chrome DP** | 9222 | WS | `ws://localhost:9222` | Chrome DevTools Protocol (used for browser automation) |

## Quick Start (TL;DR)

```bash
# 1. Generate certs (one-time)
mkcert -install && mkcert localhost 127.0.0.1 ::1
mkdir -p scripts/certs && mv localhost+2.pem localhost+2-key.pem scripts/certs/

# 2. Start everything (in order, verify each)
node scripts/ssl-proxy.js &                                         # :8443 + :8001
cd ue-service && UES_PORT=8000 UES_TLS_REJECT_UNAUTHORIZED=false    # :8000
  UES_CORS_PRIVATE_NETWORK=true UES_DISABLE_IMS_VALIDATION=true \
  node universal-editor-service.cjs &
cd react-app && npm run dev &                                       # :3100
local-ssl-proxy --source 3000 --target 3100                         # :3000
  --cert scripts/certs/localhost+2.pem \
  --key scripts/certs/localhost+2-key.pem &

# 3. Verify
lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null | grep -E '4502|8443|800[01]|3000|3100'
```

## Key Commands

```bash
# Proxy
node scripts/ssl-proxy.js                          # Start both :8443 and :8001
kill $(lsof -t -i:8443 -i:8001)                    # Stop both

# UE Service
cd ue-service && UES_PORT=8000 UES_TLS_REJECT_UNAUTHORIZED=false \
  UES_CORS_PRIVATE_NETWORK=true UES_DISABLE_IMS_VALIDATION=true \
  node universal-editor-service.cjs

# React
cd react-app && npm run dev                         # Start Vite (:3100)
cd react-app && npm run build                       # Build production bundle

# HTTPS
local-ssl-proxy --source 3000 --target 3100 \
  --cert scripts/certs/localhost+2.pem \
  --key scripts/certs/localhost+2-key.pem

# Deploy
./deploy.sh                                          # Build React + Maven + upload to AEM

# Content
python3 scripts/push-content-to-aem.py               # Push demo content to AEM

# Verify content
curl -s -u admin:admin \
  'http://localhost:4502/content/ue-demo/en/home/jcr:content.infinity.json'
```

## Project Structure

```
aem-ue-demo-poc/
├── react-app/                    # React SPA (Vite + React 19)
│   ├── src/
│   │   ├── components/           # 23 components (Hero, Card, Stats, Footer, etc.)
│   │   ├── pages/                # 6 pages (Home, About, Services, Portfolio, Detail, Contact)
│   │   ├── hooks/                # useScrollReveal
│   │   ├── lib/                  # contentService.js, editorUtils.js
│   │   ├── ComponentRegistry.jsx # AEM → React component mapping
│   │   ├── App.jsx               # HashRouter + Layout + usePageContent()
│   │   ├── App.css               # All styles (~1042 lines, CSS variables)
│   │   └── main.jsx              # Entry point
│   ├── public/
│   │   └── mock-content.json     # Fallback content (no AEM needed)
│   └── vite.config.js            # Port 3100, proxy /content → :8443
├── .gitignore                    # Excludes node_modules, target, certs, screenshots, etc.
├── scripts/
│   ├── ssl-proxy.js              # Dual proxy (8443→AEM injects auth, 8001→UES injects auth fallback + publishUrl)
│   ├── setup.sh                  # One-command automated setup script
│   ├── push-content-to-aem.py    # Create demo content in AEM
│   └── certs/                    # mkcert trusted certs (localhost+2.pem, localhost+2-key.pem)
├── ue-service/                   # Local UE Service (universal-editor-service.cjs)
├── ui.apps/                      # AEM components + clientlib (deployed React build)
├── ui.content/                   # AEM page structure
├── ui.config/                    # OSGi configs (CORS, XFO, CSRF)
├── deploy.sh                     # Build React + Maven + upload to AEM
├── scripts/push-content-to-aem.py  # Create demo content in AEM
├── pom.xml                       # Maven parent POM
├── AGENTS.md                     # This file
└── README.md                     # Full setup guide
```

## Content Data Flow

1. React fetches `/content/ue-demo/en/home/jcr:content.infinity.json` (includes child nodes like `hero`, `cardgrid`, etc.)
2. Vite proxies to `https://localhost:8443` (AEM SSL proxy, injects auth)
3. If AEM unreachable → falls back to `public/mock-content.json`
4. Content is JCR page properties (not Content Fragments)
5. Multi-field items are child node arrays: `item0`, `item1`, ...

## Component Registry

In `react-app/src/ComponentRegistry.jsx`:
```js
MapTo('ue-demo/components/hero')(Hero)
MapTo('ue-demo/components/card')(Card)
// 16 mappings total
```
All components use `data-aue-*` attributes for Universal Editor inline editing.

## Routes (HashRouter)

| Route | Page | Notes |
|---|---|---|
| `#/` | HomePage | Hero, cards, stats, FAQ |
| `#/about` | AboutPage | Story, mission, team |
| `#/services` | ServicesPage | Cards, pricing, process |
| `#/portfolio` | PortfolioPage | Filterable project grid |
| `#/portfolio/:slug` | PortfolioDetailPage | Dynamic detail page |
| `#/contact` | ContactPage | Full contact form |

## Running Without AEM

```bash
local-ssl-proxy --source 3000 --target 3100 \
  --cert scripts/certs/localhost+2.pem \
  --key scripts/certs/localhost+2-key.pem &
cd react-app && npm run dev
# Or just http://localhost:3100 for Vite-only
```

## Troubleshooting

### "chromewebdata" in iframe
- `mkcert -install` done? Certs in `scripts/certs/`? `local-ssl-proxy` running?
- Visit `https://localhost:3000` directly to accept the cert

### "Failed to fetch configuration"
- Check `lsof -i :8001` — proxy must be running
- Test: `curl -sk -X POST -H "Content-Type: application/json" -d '{"connections":[{"name":"aem","protocol":"aem","uri":"https://localhost:8443"}]}' https://localhost:8001/configuration`
- If it returns `Authorization token is missing`, restart `node scripts/ssl-proxy.js`

### CORS errors
- `access-control-allow-headers` must list all headers the editor sends
- Cannot use `*` when `access-control-allow-credentials: true`
- Current list: `authorization, x-aem-authorization, x-features, content-type, x-requested-with, accept, origin`

### UE Service won't start
- Node.js 20+ required
- Pass env vars explicitly every time: `UES_PORT=8000 UES_TLS_REJECT_UNAUTHORIZED=false UES_CORS_PRIVATE_NETWORK=true UES_DISABLE_IMS_VALIDATION=true`
- `.env` file is NOT auto-loaded

## Agent Guidelines

- **React dev port**: 3000 (HTTPS via local-ssl-proxy). Vite runs on :3100 (HTTP).
- **React entry**: `react-app/src/main.jsx`
- **Content service**: `react-app/src/lib/contentService.js` — AEM fetch + mock fallback
- **Component registry**: `react-app/src/ComponentRegistry.jsx` — 16 AEM-to-React mappings
- **All content props** flow from `usePageContent()` hook in `App.jsx`
- **CSS**: Single file `react-app/src/App.css` (~1042 lines, CSS variables)
- **No TypeScript** — all `.jsx` / `.js`
- **Build output**: `react-app/dist/` → copied to AEM clientlib
- **AEM clientlib**: `ui.apps/.../clientlibs/clientlib-nexusdigital/`
- **SSL proxy roles**: Both :8443 and :8001 inject Basic auth fallback (`admin:admin`), but only when no `Authorization` header is already present. :8001's injection is required to bootstrap the editor UI (the `/configuration` endpoint needs auth). User-supplied headers (from the Authentication headers panel in the editor) take precedence. :8001 also intercepts `/configuration` requests to inject `publishUrl: https://localhost:8443` so preview/publish works without a separate publish tier.
- **local-ssl-proxy certs**: mkcert certs in `scripts/certs/` — restart proxy after cert changes
- **Content push**: `scripts/push-content-to-aem.py` — Python 3 script using urllib. Content is hardcoded in the script. Edit the script, then re-run to update.
- **Content fetch URL**: Uses `jcr:content.infinity.json` (not `.json`) — the plain `.json` endpoint only returns page properties, not child nodes like `hero`.

## MCP Servers

Configured in `opencode.json`:

1. **aem-cs-sdk** (`http://localhost:4502/bin/mcp`) — AEM logs, OSGi diagnosis, request inspection
2. **chrome-devtools** (`npx chrome-devtools-mcp`) — Browser automation, screenshots, console

### AEM MCP Tools

| Tool | Description |
|---|---|
| `aem-logs` | Check AEM error/warn logs (filter by regex, level, count) |
| `diagnose-osgi-bundle` | Debug bundle start failures |
| `recent-requests` | Inspect AEM request routing |
