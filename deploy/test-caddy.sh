#!/usr/bin/env bash
# Runs deploy/bruchner.dev.caddy in a Caddy container against ./dist and checks
# headers, caching, legacy redirects and the 404 page. Needs Docker and a build
# (`pnpm build`). Uses Caddy's internal CA instead of Let's Encrypt.
set -euo pipefail

cd "$(dirname "$0")/.."
CADDY_IMAGE="${CADDY_IMAGE:-caddy:2}"
PORT=18443
WORK=.caddy-test
NAME=bruchner-dev-caddy-test

cleanup() {
  docker rm -f "$NAME" >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

mkdir -p "$WORK/sites"
cp deploy/*.caddy "$WORK/sites/"
cat > "$WORK/Caddyfile" <<'CADDY'
{
	local_certs
	skip_install_trust
	admin off
}
import /etc/caddy/sites/bruchner.dev.caddy
CADDY

docker run -d --name "$NAME" -p "127.0.0.1:$PORT:443" \
  -v "$PWD/$WORK:/etc/caddy:ro" -v "$PWD/dist:/srv/bruchner.dev/site:ro" \
  "$CADDY_IMAGE" >/dev/null

failures=0
check() { # description, command...
  if "${@:2}"; then echo "ok   $1"; else echo "FAIL $1"; failures=$((failures + 1)); fi
}
req() { # host, path, extra curl args...
  curl -sk --resolve "$1:$PORT:127.0.0.1" -o /dev/null -D - "${@:3}" "https://$1:$PORT$2" | tr -d '\r'
}
has() { grep -qi "$2" <<<"$1"; }
lacks() { ! grep -qi "$2" <<<"$1"; }
redirects() { # path, expected location
  local h; h=$(req bruchner.dev "$1")
  has "$h" '^HTTP/[0-9.]* 301' && has "$h" "^location: $2\$"
}

for _ in $(seq 1 30); do req bruchner.dev / | grep -q '^HTTP' && break; sleep 1; done

home=$(req bruchner.dev /)
check "home is 200" has "$home" '^HTTP/[0-9.]* 200'
check "CSP" has "$home" "^content-security-policy\(-report-only\)\?: default-src 'none'"
check "HSTS" has "$home" '^strict-transport-security: max-age=63072000; includeSubDomains; preload'
check "nosniff" has "$home" '^x-content-type-options: nosniff'
check "frame denial" has "$home" '^x-frame-options: DENY'
if grep -Eq '^[[:space:]]*header X-Robots-Tag' deploy/bruchner.dev.caddy; then
  check "noindex before launch" has "$home" '^x-robots-tag: noindex'
else
  check "indexable after launch" lacks "$home" '^x-robots-tag:'
fi
check "HTML revalidates" has "$home" '^cache-control: no-cache'
check "no Server header" lacks "$home" '^server:'

asset=$(find dist/_astro -name '*.css' | head -1)
check "hashed assets are immutable" has "$(req bruchner.dev "/${asset#dist/}")" '^cache-control: public, max-age=31536000, immutable'
check "compression" has "$(req bruchner.dev / -H 'Accept-Encoding: zstd, gzip')" '^content-encoding: \(zstd\|gzip\)'

check "/resume/ -> /cv/" redirects /resume/ /cv/
check "/resume -> /cv/" redirects /resume /cv/
check "/about/ -> /" redirects /about/ /
check "/notes/ -> /" redirects /notes/ /
check "/thanks/ -> /" redirects /thanks/ /
check "/tags/ -> /writing/" redirects /tags/ /writing/
check "/looking-for-something-new/ -> /relaunch/" redirects /looking-for-something-new/ /relaunch/
check "/sitemap.xml -> /sitemap-index.xml" redirects /sitemap.xml /sitemap-index.xml

for path in /hello-world/ /still-alive/ /freelance-availability/ /leaving-linkedin/ /legal/ /feed.xml /llms.txt /.well-known/security.txt; do
  check "$path is 200" has "$(req bruchner.dev "$path")" '^HTTP/[0-9.]* 200'
done

missing=$(req bruchner.dev /does-not-exist/)
check "unknown path is 404" has "$missing" '^HTTP/[0-9.]* 404'
check "404 keeps security headers" has "$missing" "^content-security-policy\(-report-only\)\?:"
check "404 serves the 404 page" grep -q 'Page not found' <<<"$(curl -sk --resolve "bruchner.dev:$PORT:127.0.0.1" "https://bruchner.dev:$PORT/does-not-exist/")"

www=$(req www.bruchner.dev /cv/)
check "www -> apex" has "$www" '^location: https://bruchner.dev/cv/$'

if ((failures > 0)); then
  echo "$failures check(s) failed"
  docker logs "$NAME" 2>&1 | tail -20
  exit 1
fi
echo "all checks passed"
