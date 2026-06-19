#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

AEM_URL="${AEM_URL:-http://localhost:4502}"
AEM_USER="${AEM_USER:-admin:admin}"
PACKAGE="all/target/all-1.0.0-SNAPSHOT.zip"
CLIENTLIB_DIR="ui.apps/src/main/content/jcr_root/apps/ue-demo/clientlibs/clientlib-nexusdigital"

echo "=== Nexus Digital AEM Deploy ==="
echo ""

# 1. Build React app
echo "[1/5] Building React app..."
cd react-app
npm run build
cd "$SCRIPT_DIR"
echo "  ✓ React build complete"
echo ""

# 2. Copy dist to clientlib
echo "[2/5] Copying to AEM clientlib..."
REACT_DIST="react-app/dist/assets"
CSS_FILE=$(ls "$REACT_DIST"/*.css | xargs -n1 basename)
JS_FILE=$(ls "$REACT_DIST"/*.js | xargs -n1 basename)

echo "#base=.
$CSS_FILE" > "$CLIENTLIB_DIR/css.txt"
echo "#base=.
$JS_FILE" > "$CLIENTLIB_DIR/js.txt"

cp "$REACT_DIST/$CSS_FILE" "$CLIENTLIB_DIR/$CSS_FILE"
cp "$REACT_DIST/$JS_FILE" "$CLIENTLIB_DIR/$JS_FILE"

# Clean old hashed files
find "$CLIENTLIB_DIR" -maxdepth 1 -name 'index-*.css' -not -name "$CSS_FILE" -delete 2>/dev/null
find "$CLIENTLIB_DIR" -maxdepth 1 -name 'index-*.js' -not -name "$JS_FILE" -delete 2>/dev/null

echo "  ✓ CSS: $CSS_FILE"
echo "  ✓ JS: $JS_FILE"
echo ""

# 3. Build AEM package
echo "[3/5] Building AEM Maven package..."
mvn clean install -DskipTests -q
echo "  ✓ Maven build complete"
echo ""

# 4. Deploy to AEM
echo "[4/5] Deploying to AEM ($AEM_URL)..."
RESPONSE=$(curl -s -u "$AEM_USER" -F file=@"$PACKAGE" -F install=true "$AEM_URL/crx/packmgr/service.jsp" 2>&1)

if echo "$RESPONSE" | grep -q "Package installed"; then
  echo "  ✓ Deploy successful"
elif echo "$RESPONSE" | grep -q "Package imported"; then
  echo "  ✓ Package deployed (with warnings)"
else
  echo "  ✗ Deploy failed"
  echo "$RESPONSE"
  exit 1
fi

# 5. Verify
echo ""
echo "[5/5] Verifying deployment..."
CSS_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -u "$AEM_USER" "$AEM_URL/etc.clientlibs/ue-demo/clientlibs/clientlib-nexusdigital.css")
JS_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -u "$AEM_USER" "$AEM_URL/etc.clientlibs/ue-demo/clientlibs/clientlib-nexusdigital.js")
PAGE_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -u "$AEM_USER" "$AEM_URL/content/ue-demo/en/home.html")

echo "  Clientlib CSS : $CSS_CHECK"
echo "  Clientlib JS  : $JS_CHECK"
echo "  Page HTML     : $PAGE_CHECK"

if [ "$CSS_CHECK" = "200" ] && [ "$JS_CHECK" = "200" ] && [ "$PAGE_CHECK" = "200" ]; then
  echo ""
  echo "✓ All checks passed! Deploy complete."
else
  echo ""
  echo "! Some checks failed — review above"
  exit 1
fi
