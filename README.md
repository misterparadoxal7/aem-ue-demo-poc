# Nexus Digital — AEM Universal Editor POC

**Platform:** macOS only (uses Homebrew). Windows/Linux users will need to adapt package managers and paths.

A proof-of-concept React SPA instrumented for the **Adobe Universal Editor**, running against a local **AEM SDK author instance**. Content is authored through the Universal Editor inline editing interface and stored in AEM page properties.

---

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

**Why six services?** The Universal Editor (Adobe's cloud) loads your page in an iframe and calls a configuration endpoint. Both connections require HTTPS. Your local dev servers (Vite, AEM SDK, UE Service) all run on HTTP. The SSL proxies bridge the gap — they serve HTTPS to the browser, proxy to HTTP backends, inject auth as a fallback, and add CORS + security header fixes. The AEM proxy (`:8443`) is called by the UE Service (server-side), not by the browser directly.

**Service start order matters.** You must start them in this exact sequence — each depends on the previous one:
```
1. AEM SDK        → 2. SSL Proxy     → 3. UE Service
                                     → 4. Vite         → 5. local-ssl-proxy
```

**Port roles at a glance:**

| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| **3000** | React HTTPS | HTTPS | `local-ssl-proxy` wrapping Vite with a **mkcert**-trusted TLS cert. This is what the UE editor loads in its iframe. |
| **3100** | Vite Dev | HTTP | Vite dev server with HMR. Never accessed directly in production-like flows — sits behind port 3000. |
| **4502** | AEM SDK | HTTP | AEM author instance (Java). The content repository and page rendering engine. |
| **8443** | AEM SSL Proxy | HTTPS | Wraps AEM (`:4502`) in HTTPS. Injects `Basic YWRtaW46YWRtaW4=` fallback auth. Strips `X-Frame-Options`. The UE Service talks to AEM through this port. |
| **8000** | UE Service | HTTP | Local copy of Adobe's Universal Editor Service. Handles inline edits and proxies them to AEM. Requires `UES_DISABLE_IMS_VALIDATION=true` for local use. |
| **8001** | UES SSL Proxy | HTTPS | Wraps UE Service (`:8000`) in HTTPS. Injects `Basic YWRtaW46YWRtaW4=` as a bootstrap fallback so the editor UI can fetch its configuration. Intercepts `/configuration` POST requests to inject a `publishUrl` pointing back to `https://localhost:8443` (needed for preview/publish on AEM SDK which has no publish tier). Prefers a user-supplied `Authorization` header if one is present. |

---

## Prerequisites

Install these **before** cloning the project.

### 1. Homebrew (macOS)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Node.js 20+

```bash
brew install node@20
node -v   # v20.x.x
```

### 3. Java 17+ (for AEM SDK)

```bash
brew install openjdk@17
java -version   # openjdk version "17.x.x"
```

### 4. Python 3 (for content push script)

```bash
python3 --version   # Python 3.x
```

### 5. mkcert (trusted local TLS certificates)

```bash
brew install mkcert
mkcert -install   # install the local CA (one-time per machine)
```

After `mkcert -install`, **restart Chrome completely** (all windows, or use `chrome://restart`) before loading the editor. Chrome caches the trust store and the iframe will show `ERR_CERT_AUTHORITY_INVALID` otherwise.

### 6. local-ssl-proxy (HTTPS wrapper for Vite)

```bash
npm install -g local-ssl-proxy
```

---

## Step-by-Step Setup

```bash
# TL;DR — automated setup for the impatient:
./scripts/setup.sh
```

Follow the detailed steps below if you prefer to do things manually or hit problems with the script.

### Step 1: Clone the Repository

```bash
git clone <repo-url> aem-ue-demo-poc
cd aem-ue-demo-poc
```

### Step 2: Generate TLS Certificates

Create a trusted certificate for `localhost` that Chrome will accept inside an iframe from `https://experience.adobe.com`.

```bash
# Generate cert for localhost (includes IPv4 and IPv6 loopback)
mkcert localhost 127.0.0.1 ::1

# This creates two files:
#   localhost+2.pem       (certificate)
#   localhost+2-key.pem   (private key)

# Move them into the project
mkdir -p scripts/certs
mv localhost+2.pem localhost+2-key.pem scripts/certs/
```

Verify the certs are in place:

```bash
ls -la scripts/certs/
# Should show: localhost+2-key.pem  localhost+2.pem
```

### Step 3: Install Project Dependencies

```bash
# React app dependencies
cd react-app
npm install
cd ..

# The SSL proxy and deploy script use Node built-ins only (no npm install needed)
```

### Step 4: Start AEM Author SDK

AEM SDK is a Java 17+ jar, required for content persistence. If you don't have it set up yet:

```bash
# 4a. Create a directory for AEM
mkdir -p ~/aem-sdk && cd ~/aem-sdk

# 4b. Download AEM SDK from:
#     https://experience.adobe.com/#/downloads
#     → "AEM as a Cloud Service SDK" → "AEM SDK"
#     The downloaded zip contains aem-author-p<version>.jar

# 4c. Unpack and start
#     (adjust the jar filename to match your download)
unzip aem-sdk-*.zip
java -jar aem-author-p*.jar -nofork  -nobrowser
```

AEM takes **2-5 minutes** to start on first run (unpacking, index building). Subsequent starts take ~30s. Watch for:
```
##############################################################
##  AEM is ready to serve you. Have fun!
##############################################################
```

Verify it's running:

```bash
curl -s -u admin:admin http://localhost:4502/libs/granite/core/content/login.html | head -1
# Expected output: an HTML page (not "Connection refused")
```

**About credentials:** The default AEM SDK admin credentials are `admin` / `admin`. The demo uses these everywhere.

> **No AEM?** Skip this step — the React app falls back to `public/mock-content.json` for UI development. You'll lose content persistence, but the frontend works.

### Step 5: Push Content to AEM

Populate AEM with the demo page structure and content:

```bash
python3 scripts/push-content-to-aem.py
```

Verify:

```bash
curl -s -u admin:admin 'http://localhost:4502/content/ue-demo/en/home/jcr:content.infinity.json' \
  | python3 -c "import json,sys; d=json.load(sys.stdin); [print(k) for k in d if not k.startswith('jcr:') and not k.startswith('cq:')]"
# Expected: page property names (heroTitle, services, stats, etc.)
```

### Step 6: Start the SSL Proxy (serves both :8443 and :8001)

```bash
node scripts/ssl-proxy.js &
sleep 2
```

Verify both ports are listening:

```bash
lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null | grep -E '8443|8001'
# Expected: two entries, both showing (LISTEN)

# Verify AEM proxy works:
curl -s -o /dev/null -w "%{http_code}" https://localhost:8443/libs/granite/core/content/login.html
# Expected: 200

# Verify UES proxy works (should return capabilities JSON):
curl -sk -X POST -H "Content-Type: application/json" \
  -d '{"connections":[{"name":"aem","protocol":"aem","uri":"https://localhost:8443"}]}' \
  https://localhost:8001/configuration
# Expected: a JSON response with "capabilities" and no error
```

**What this does:**
- `:8443` → forwards to AEM (`:4502`), injects `Basic YWRtaW46YWRtaW4=`, strips `X-Frame-Options`, fixes `SameSite` cookies
- `:8001` → forwards to UE Service (`:8000`), injects `Basic YWRtaW46YWRtaW4=` only if the request doesn't already have an `Authorization` header (this bootstraps the editor — the `/configuration` endpoint requires auth)
- **`publishUrl` injection**: intercepts `/configuration` POSTs and adds `"publishUrl": "https://localhost:8443"` to each connection, so the editor's "Publish" button works against the local AEM SDK (which has no separate publish tier)

### Step 7: Start the Universal Editor Service

```bash
cd ue-service
UES_PORT=8000 \
  UES_TLS_REJECT_UNAUTHORIZED=false \
  UES_CORS_PRIVATE_NETWORK=true \
  UES_DISABLE_IMS_VALIDATION=true \
  node universal-editor-service.cjs &
cd ..
sleep 2
```

Verify:

```bash
curl -s -k https://localhost:8000/ping
# Expected: {"ping":"pong"}
```

> **Important:** The `.env` file in `ue-service/` is **not auto-loaded**. You must pass these env vars explicitly every time. `UES_DISABLE_IMS_VALIDATION=true` is essential — without it, the UE Service rejects non-Adobe requests.

### Step 8: Start the React Dev Server

```bash
cd react-app
npm run dev &
cd ..
sleep 2
```

Verify:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100
# Expected: 200
```

This starts Vite on port **3100** (HTTP only). It is not accessed directly — the `local-ssl-proxy` layers HTTPS on top.

### Step 9: Start the React HTTPS Proxy

```bash
local-ssl-proxy --source 3000 --target 3100 \
  --cert scripts/certs/localhost+2.pem \
  --key scripts/certs/localhost+2-key.pem &
sleep 2
```

Verify:

```bash
curl -s -o /dev/null -w "%{http_code}" https://localhost:3000
# Expected: 200
```

**Visit `https://localhost:3000` directly in Chrome once** to accept the mkcert certificate. Click "Proceed" or "Advanced → Proceed to localhost (unsafe)" — after this, Chrome remembers the cert is valid and won't block it in the iframe.

### Step 10: Verify All Services

```bash
lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null | grep -E '4502|8443|800[01]|3000|3100'
```

All **6 ports** should show `(LISTEN)`:
- `4502` — AEM SDK
- `8443` — AEM SSL proxy
- `8000` — UE Service
- `8001` — UES SSL proxy
- `3100` — Vite dev server
- `3000` — React HTTPS (local-ssl-proxy)

---

## Open the Universal Editor

Navigate to:

```
https://experience.adobe.com/#/@eon/aem/editor/canvas/localhost:3000
```

The editor loads your React app in an iframe, fetches configuration from the local UE Service, and shows the editing interface. You can click any element with `data-aue-*` attributes to edit it inline.

**Every time you restart the services**, reload this page. If the iframe shows a Chrome error page, re-visit `https://localhost:3000` directly to re-accept the cert.

---

## Configure Authentication (for saving edits)

> **Note:** The `:8001` proxy injects Basic auth as a bootstrap fallback, so the editor UI loads without manual auth configuration. For saving edits back to AEM, you should configure explicit auth.

In the UE editor toolbar, click the **Authentication headers** icon (key/shield icon) and paste:

```
Authorization: Basic YWRtaW46YWRtaW4=
```

This header is sent to the UE Service, which uses it when calling AEM through the `:8443` proxy. Both use `admin`/`admin`.

---

## Running Without AEM

The React app works standalone with mock data. No AEM, Maven, or Java needed.

```bash
# Option A: Use HTTPS (for UE editor testing without AEM backend)
local-ssl-proxy --source 3000 --target 3100 \
  --cert scripts/certs/localhost+2.pem \
  --key scripts/certs/localhost+2-key.pem &
cd react-app && npm run dev

# Option B: Use HTTP directly (for frontend development only)
cd react-app && npm run dev
# Open http://localhost:3100
```

The app reads from `public/mock-content.json` when AEM is unreachable.

---

## Project Structure

```
aem-ue-demo-poc/
├── react-app/                         # React SPA (Vite + React 19)
│   ├── src/
│   │   ├── components/                # 23 reusable React components
│   │   │   ├── Header.jsx             # Navigation + mobile menu
│   │   │   ├── Hero.jsx               # Homepage hero section
│   │   │   ├── Card.jsx               # Reusable card component
│   │   │   ├── StatsSection.jsx       # Statistics grid
│   │   │   ├── Footer.jsx             # Site footer
│   │   │   ├── ScrollReveal.jsx       # Scroll animation wrapper
│   │   │   └── ...                    # 17 more components
│   │   ├── pages/                     # 6 page-level components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── PortfolioPage.jsx
│   │   │   ├── PortfolioDetailPage.jsx
│   │   │   └── ContactPage.jsx
│   │   ├── hooks/                     # Custom React hooks
│   │   │   └── useScrollReveal.js
│   │   ├── lib/                       # Utilities
│   │   │   ├── contentService.js      # Fetches content (AEM → mock fallback)
│   │   │   └── editorUtils.js         # UE editor helpers
│   │   ├── ComponentRegistry.jsx      # AEM resource type → React component map
│   │   ├── App.jsx                    # HashRouter, Layout, usePageContent
│   │   ├── App.css                    # All styles (CSS variables, responsive)
│   │   └── main.jsx                   # Entry point
│   ├── public/
│   │   └── mock-content.json          # Fallback content for standalone mode
│   └── vite.config.js                 # Dev server :3100, proxy to :8443
│
├── .gitignore                          # Excludes node_modules, target, certs, etc.
├── scripts/
│   ├── ssl-proxy.js                   # Dual SSL proxy (8443→AEM, 8001→UES)
│   ├── setup.sh                       # One-command automated setup (install + start)
│   ├── push-content-to-aem.py         # Creates demo content in AEM
│   └── certs/                         # mkcert trusted certificates
│       ├── localhost+2.pem
│       └── localhost+2-key.pem
│
├── ue-service/                        # Local Universal Editor Service
│   ├── universal-editor-service.cjs   # Node.js service binary
│   ├── certificate.pem                # Auto-generated self-signed cert
│   ├── key.pem                        # Auto-generated key
│   └── .env                           # NOT auto-loaded (use env vars)
│
├── ui.apps/                           # AEM application module
│   └── src/main/content/jcr_root/apps/ue-demo/
│       ├── components/                # AEM component definitions
│       └── clientlibs/
│           └── clientlib-nexusdigital/ # Deployed React build
│
├── ui.content/                        # AEM content (page template, structure)
├── ui.config/                         # OSGi configs (CORS, XFO, CSRF)
├── deploy.sh                          # Build React + Maven + upload to AEM
├── scripts/push-content-to-aem.py     # Creates demo content in AEM
├── pom.xml                            # Maven parent POM
├── AGENTS.md                          # Agent instructions (this file)
└── README.md                          # This file
```

---

## Key Commands Reference

### Automated Setup

```bash
# Install everything + start all services (idempotent, safe to re-run)
./scripts/setup.sh
```

### Start / Stop

```bash
# Start proxy (8443→AEM, 8001→UES)
node scripts/ssl-proxy.js

# Start UE Service
cd ue-service && UES_PORT=8000 UES_TLS_REJECT_UNAUTHORIZED=false \
  UES_CORS_PRIVATE_NETWORK=true UES_DISABLE_IMS_VALIDATION=true \
  node universal-editor-service.cjs

# Start Vite dev server (port 3100)
cd react-app && npm run dev

# Start HTTPS wrapper (port 3000)
local-ssl-proxy --source 3000 --target 3100 \
  --cert scripts/certs/localhost+2.pem \
  --key scripts/certs/localhost+2-key.pem

# Stop specific service (replace PORT)
kill $(lsof -t -i:PORT)

# Stop all services at once
kill $(lsof -t -i:4502 -i:8443 -i:8000 -i:8001 -i:3100 -i:3000) 2>/dev/null
```

### Build & Deploy

```bash
# Build React app only
cd react-app && npm run build

# Full deploy to AEM (builds React + Maven + uploads package)
./deploy.sh

# Optional: override AEM URL/user
AEM_URL=http://localhost:4502 AEM_USER=admin:admin ./deploy.sh
```

### Content

```bash
# Push demo content to AEM
python3 scripts/push-content-to-aem.py

# Read page content
curl -s -u admin:admin \
  'http://localhost:4502/content/ue-demo/en/home/jcr:content.infinity.json'
```

### Verify Services

```bash
# Check all listening ports
lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null | grep -E '4502|8443|800[01]|3000|3100'

# Test AEM via proxy
curl -s -o /dev/null -w "%{http_code}" https://localhost:8443/libs/granite/core/content/login.html

# Test UE Service
curl -s -k https://localhost:8000/ping

# Test React app
curl -s -o /dev/null -w "%{http_code}" https://localhost:3000

# Test UES config endpoint
curl -sk -X POST -H "Content-Type: application/json" \
  -d '{"connections":[{"name":"aem","protocol":"aem","uri":"https://localhost:8443"}]}' \
  https://localhost:8001/configuration
```

---

## Page Routes (HashRouter)

The app uses `HashRouter`. All routes are prefixed with `#/`.

| Hash Route | Page | Key Content |
|---|---|---|
| `#/` | HomePage | Hero, services cards, stats, FAQ, testimonials |
| `#/about` | AboutPage | Story, mission, team, stats, accordion |
| `#/services` | ServicesPage | Service cards, pricing tiers, process steps |
| `#/portfolio` | PortfolioPage | Filterable project grid |
| `#/portfolio/:slug` | PortfolioDetailPage | Dynamic project detail |
| `#/contact` | ContactPage | Full contact form |

---

## Content Data Flow

```
browser (React app)
  │
  ├─ fetch /content/ue-demo/en/home/jcr:content.infinity.json
  │    └─ Vite proxy → https://localhost:8443 (AEM SSL proxy) → AEM :4502
  │
  └─ if AEM is unreachable → public/mock-content.json (fallback)
```

1. React app fetches page content as JSON from AEM using `infinity.json` (includes child nodes)
2. Vite proxies the request to `https://localhost:8443` (the AEM SSL proxy)
3. The proxy injects Basic auth and forwards to AEM on `:4502`
4. If AEM is unavailable, the app falls back to `public/mock-content.json`
5. Content is stored as JCR page properties (not Content Fragments)
6. Multi-field items (services, stats, FAQ items) are child nodes: `item0`, `item1`, ...

---

## How React and AEM Work Together

### React is independent of AEM

React is a standalone SPA. AEM is just a JSON API — React doesn't use AEM's page structure, templates, or rendering engine.

```
React (hosted on Vite/Vercel/CloudFront)
  │
  ├── fetch /content/ue-demo/en/home/jcr:content.infinity.json
  │
  └── renders based on the JSON, not AEM's URL structure
```

React defines its own routes in `App.jsx`:

```jsx
<HashRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/services" element={<ServicesPage />} />
  </Routes>
</HashRouter>
```

AEM doesn't know about these routes. React fetches one JSON endpoint and decides what to render based on the content data.

### React reads JCR content via JSON

AEM stores content in JCR (Java Content Repository) and exposes it as JSON. React never touches JCR directly — it speaks HTTP + JSON:

**`contentService.js`** — fetches JSON from AEM:
```js
jsonUrl = '/content/ue-demo/en/home/jcr:content.infinity.json'
resp = await fetch(jsonUrl)
```

AEM returns:
```json
{
  "jcr:title": "Home",
  "hero": { "title": "Hello", "subtitle": "We build..." },
  "cardgrid": { "heading": "Our Services", "services": {...} }
}
```

React components consume this as plain props:

**`HomePage.jsx`**:
```jsx
function HomePage() {
  const { content } = usePageContent()
  return <Hero title={content.hero.title} subtitle={content.hero.subtitle} />
}
```

### How authoring works

When an author edits content in the Universal Editor:

```
Author clicks hero title → types "New Title"
  │
  ▼
Universal Editor sends PATCH to UE Service (:8001)
  │
  ▼
UE Service forwards to AEM via :8443 proxy → AEM :4502
  │
  ▼
AEM writes to JCR: hero/title = "New Title"
```

On page reload, React fetches the JSON again and sees the updated content. **No React redeployment needed for content changes.**

### Adding a new component — both sides

When the React team creates a new component, the AEM team must create a matching component definition. Here's the full flow:

**React developer** creates `Banner.jsx`:
```jsx
function Banner({ title, text }) {
  return (
    <div data-aue-prop="title" data-aue-type="text">{title}</div>
  )
}
```

Registers it in `ComponentRegistry.jsx`:
```jsx
MapTo('ue-demo/components/banner')(Banner)
```

**AEM developer** creates the AEM component definition at `ui.apps/src/main/content/jcr_root/apps/ue-demo/components/banner/.content.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          jcr:primaryType="sling:Folder"
          sling:resourceSuperType="ue-demo/components/page/nexusdigital"/>
```

Adds the data model to the content push script for initial content:
```python
"banner": {
  "jcr:primaryType": "nt:unstructured",
  "sling:resourceType": "ue-demo/components/banner",
  "title": "Welcome",
  "text": "Hello world"
}
```

The React app is deployed once with the new component. After that, content authors can edit the banner's title and text through the UE editor — **no further React changes needed for content updates.**

### Adding a new route/page

**React developer** adds a new route in `App.jsx`:
```jsx
<Route path="/pricing" element={<PricingPage />} />
```

Creates `PricingPage.jsx` that uses `usePageContent()` — which fetches the same single JSON endpoint. The page decides which pieces of content to render.

**AEM developer** either:
- Adds new content properties to the existing page in `push-content-to-aem.py`, OR
- Creates a new AEM page (new child node under `/content/ue-demo/en/pricing`) with its own `jcr:content` node

React keeps fetching the same JSON — no API changes needed.

### Responsibility matrix

| Who | Responsible for |
|---|---|
| **React Developer** | React components, routes, UI logic, component registration, data attribute annotations |
| **AEM Developer** | AEM component definitions (`.content.xml`), content model, initial content in push script |
| **Content Author** | Editing text/images in UE, adding/removing components from pages |
| **AEM (platform)** | Storing content (JCR), serving JSON API |

---

## Component → AEM Mapping

### Current approach (deprecated SPA SDK)

AEM resource types are mapped to React components in `src/ComponentRegistry.jsxx` using `@adobe/aem-react-editable-components`'s `MapTo` function:

```js
MapTo('ue-demo/components/hero')(Hero)
MapTo('ue-demo/components/card')(Card)
// ... 16 mappings total
```

**`App.jsx`** uses `AEMPage` from the SDK to auto-render components:
```jsx
import { AEMPage } from '@adobe/aem-react-editable-components'

function App() {
  const { content, resourcePath } = usePageContent()
  return <AEMPage content={content} resourcePath={resourcePath} />
  // AEMPage reads sling:resourceType from each child,
  // looks up MapTo registry, and renders the right component
}
```

### Recommended approach (manual, UE best practice)

The `@adobe/aem-react-editable-components` SDK is **deprecated** (Adobe retired the SPA Editor). The Universal Editor works with **plain React** — no SDK needed. Replace `MapTo` and `AEMPage` with a simple component map + renderer:

**`lib/ComponentMap.js`** — plain object:
```jsx
import Hero from '../components/Hero'
import Card from '../components/Card'
import CardGrid from '../components/CardGrid'

export const componentMap = {
  'ue-demo/components/hero': Hero,
  'ue-demo/components/card': Card,
  'ue-demo/components/cardgrid': CardGrid,
}
```

**`lib/DynamicRenderer.js`** — switch on resource type:
```jsx
import { componentMap } from './ComponentMap'

export function DynamicRenderer({ content, resourceType }) {
  if (!content || !resourceType) return null
  const Component = componentMap[resourceType]
  if (!Component) return <div>Unknown: {resourceType}</div>
  return <Component {...content} />
}
```

**`App.jsx`** — manual iteration over children:
```jsx
function App() {
  const { content } = usePageContent()
  if (!content) return null

  const childKeys = Object.keys(content).filter(
    key => content[key]?.['sling:resourceType']
  )

  return (
    <div>
      <Header navLinks={content.navLinks} />
      {childKeys.map(key => (
        <DynamicRenderer
          key={key}
          content={content[key]}
          resourceType={content[key]['sling:resourceType']}
        />
      ))}
      <Footer copyright={content.footerCopyright} />
    </div>
  )
}
```

**Comparison:**

| | SPA SDK (`MapTo`) | Manual (UE recommendation) |
|---|---|---|
| **Dependencies** | `@adobe/aem-react-editable-components` | Zero — plain React |
| **Bundle size** | ~15 KB extra | Nothing |
| **Deprecated** | Yes (SPA Editor retired) | No — Adobe's current guidance |
| **Flexibility** | Tied to SDK internals | Full control over rendering, layout |

All UE-instrumented components use `data-aue-*` attributes for inline editing (e.g., `data-aue-prop`, `data-aue-type`) — this stays the same regardless of the mapping approach.

---

## Troubleshooting

### UE iframe shows "chromewebdata" error

Chrome blocks the TLS certificate in iframe context if it's not trusted.

1. Run `mkcert -install` (one-time, verifies CA is installed), then **restart Chrome**
2. Check certs exist: `ls scripts/certs/`
3. Verify `local-ssl-proxy` is running with `--cert` and `--key` pointing to mkcert files
4. Visit `https://localhost:3000` directly and accept the certificate

### "Failed to fetch configuration" in editor console

The UE editor cannot reach its configuration endpoint at `https://localhost:8001/configuration`.

1. Verify the SSL proxy is running: `lsof -i :8001`
2. Test the endpoint directly:
   ```bash
   curl -sk -X POST -H "Content-Type: application/json" \
     -d '{"connections":[{"name":"aem","protocol":"aem","uri":"https://localhost:8443"}]}' \
     https://localhost:8001/configuration
   ```
3. If you get `Authorization token is missing`, the proxy is not injecting auth — restart it: `node scripts/ssl-proxy.js`

### CORS errors in browser console

The `access-control-allow-headers` list in `scripts/ssl-proxy.js` must include every header the editor sends. Current list:

```
authorization, x-aem-authorization, x-features, content-type, x-requested-with, accept, origin
```

If a new header appears in the editor's requests (e.g., `x-custom-header`), add it to this list. Note: `access-control-allow-headers: *` is invalid when `access-control-allow-credentials: true` — all headers must be listed explicitly.

### "UE Service won't start"

- Check Node.js version: `node -v` (needs 20+)
- Pass env vars **explicitly** — `.env` is **not** auto-loaded:
  ```bash
  UES_PORT=8000 UES_TLS_REJECT_UNAUTHORIZED=false UES_CORS_PRIVATE_NETWORK=true UES_DISABLE_IMS_VALIDATION=true node universal-editor-service.cjs
  ```
- Check port 8000 isn't in use: `lsof -i :8000`

### Can't reach AEM start page

- AEM is at `https://localhost:8443/aem/start.html` (HTTPS, not HTTP)
- Check the SSL proxy: `lsof -i :8443`
- Check AEM itself: `lsof -i :4502`
- If the proxy is running but AEM returns errors, check AEM logs via the AEM MCP server

### "Mixed Content" warning in browser

This happens if the UE editor or React app loads HTTP resources. All services must use HTTPS through the proxies. Ensure you're accessing everything via the HTTPS ports (`:3000`, `:8443`, `:8001`) and not the raw HTTP ports (`:3100`, `:4502`, `:8000`).

### Port already in use

```bash
# Find what's using a port
lsof -i :PORT

# Kill it
kill -9 PID

# Kill all project services at once
kill $(lsof -t -i:4502 -i:8443 -i:8000 -i:8001 -i:3100 -i:3000) 2>/dev/null
```

### All services running but editor shows blank iframe

1. Check the iframe's URL in Chrome DevTools (should be `https://localhost:3000/`)
2. Open `https://localhost:3000` in a new tab — does it load the React app?
3. Check the console for errors
4. If you see `ERR_CERT_AUTHORITY_INVALID`, the mkcert CA isn't trusted — run `mkcert -install` and restart Chrome
