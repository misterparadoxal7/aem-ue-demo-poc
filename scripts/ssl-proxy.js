const https = require('https');
const http = require('http');
const fs = require('fs');

const KEY = process.argv[2] || __dirname + '/certs/localhost+2-key.pem';
const CERT = process.argv[3] || __dirname + '/certs/localhost+2.pem';
const BASIC_AUTH = 'Basic ' + Buffer.from('admin:admin').toString('base64');

const opts = {
  key: fs.readFileSync(KEY),
  cert: fs.readFileSync(CERT),
};

function fixCookies(proxyRes) {
  let setCookie = proxyRes.headers['set-cookie'];
  if (!setCookie) return;
  setCookie = setCookie.map(c => {
    if (/;\s*samesite\s*=/i.test(c)) {
      c = c.replace(/;\s*samesite\s*=\s*(lax|strict)/gi, '; SameSite=None');
    } else {
      c += '; SameSite=None';
    }
    if (!/;\s*secure\s*(;|$)/i.test(c)) {
      c += '; Secure';
    }
    return c;
  });
  proxyRes.headers['set-cookie'] = setCookie;
}

function corsHeaders(req) {
  const origin = req.headers['origin'] || '*';
  return {
    'access-control-allow-origin': origin === '*' ? '*' : origin,
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-headers': 'authorization, x-aem-authorization, x-features, content-type, x-requested-with, accept, origin',
    'access-control-allow-credentials': 'true',
    'access-control-allow-private-network': 'true',
    'access-control-max-age': '86400',
  };
}

function createProxy(targetHost, targetIsHttps, injectAuth) {
  const mod = targetIsHttps ? https : http;
  return (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders(req));
      res.end();
      return;
    }

    const headers = { ...req.headers };
    if (injectAuth && !headers['authorization']) {
      headers['authorization'] = BASIC_AUTH;
    }

    const proto = targetIsHttps ? 'https' : 'http';
    const targetUrl = `${proto}://${targetHost}${req.url}`;
    const agentOpts = targetIsHttps ? { rejectUnauthorized: false } : undefined;

    // Intercept configuration requests to add publishUrl for local AEM SDK
    if (req.method === 'POST' && req.url === '/configuration') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const config = JSON.parse(body);
          if (config.connections) {
            config.connections.forEach(c => {
              if (!c.publishUrl) {
                c.publishUrl = c.uri;
              }
            });
          }
          body = JSON.stringify(config);
        } catch (e) {
          // If JSON parse fails, forward original body
        }
        headers['content-length'] = Buffer.byteLength(body);

        const proxyReq = mod.request(targetUrl, { method: req.method, headers, ...agentOpts }, (proxyRes) => {
          delete proxyRes.headers['x-frame-options'];
          delete proxyRes.headers['X-Frame-Options'];
          if (proxyRes.headers['content-security-policy']) {
            proxyRes.headers['content-security-policy'] = proxyRes.headers['content-security-policy']
              .replace(/frame-ancestors[^;]*;?/gi, '');
          }
          Object.assign(proxyRes.headers, corsHeaders(req));
          if (targetHost === 'localhost:4502') {
            fixCookies(proxyRes);
          }
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        });
        proxyReq.on('error', (e) => {
          res.writeHead(502);
          res.end('Proxy error: ' + e.message);
        });
        proxyReq.end(body);
      });
      return;
    }

    const proxyReq = mod.request(targetUrl, { method: req.method, headers, ...agentOpts }, (proxyRes) => {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['X-Frame-Options'];
      if (proxyRes.headers['content-security-policy']) {
        proxyRes.headers['content-security-policy'] = proxyRes.headers['content-security-policy']
          .replace(/frame-ancestors[^;]*;?/gi, '');
      }
      Object.assign(proxyRes.headers, corsHeaders(req));
      if (targetHost === 'localhost:4502') {
        fixCookies(proxyRes);
      }
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', (e) => {
      res.writeHead(502);
      res.end('Proxy error: ' + e.message);
    });
    req.pipe(proxyReq);
  };
}

// AEM proxy: :8443 -> http://localhost:4502 (injects Basic auth for local dev)
https.createServer(opts, createProxy('localhost:4502', false, true)).listen(8443, () => {
  console.log('AEM proxy:  https://localhost:8443 -> http://localhost:4502 (auth injected)');
});

// UES proxy: :8001 -> https://localhost:8000 (injects Basic auth fallback for /configuration)
// The UE editor UI needs to fetch /configuration before the user can configure auth headers.
// Without this injection, the editor can never bootstrap. Once it loads, the user can
// optionally override auth in the editor's Authentication headers panel for subsequent requests.
// The proxy prefers the original Authorization header if present (from user config), otherwise
// injects the fallback.
https.createServer(opts, createProxy('localhost:8000', true, true)).listen(8001, () => {
  console.log('UES proxy:  https://localhost:8001 -> https://localhost:8000 (auth injected fallback)');
});
