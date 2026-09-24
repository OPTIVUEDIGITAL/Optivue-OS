import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../production");
const PORT = Number(process.env.PORT || 8787);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
};

const COMPRESSIBLE = new Set([
  ".html", ".css", ".js", ".mjs", ".json", ".svg", ".xml", ".txt"
]);

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\\/g, "/");
  let relative = clean === "/" ? "index.html" : clean.replace(/^\/+/, "");
  let candidate = path.resolve(ROOT, relative);
  if (!candidate.startsWith(ROOT + path.sep) && candidate !== path.join(ROOT, "index.html")) {
    return null;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    candidate = path.join(candidate, "index.html");
  }
  return candidate;
}

const server = http.createServer((req, res) => {
  const requestPath = new URL(req.url || '/', 'http://127.0.0.1').pathname;
  if (requestPath === '/diagnosis') {
    res.writeHead(301, { location: '/estimator', 'cache-control': 'no-cache' });
    res.end();
    return;
  }
  const file = resolveFile(req.url || "/");
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, {"content-type":"text/plain; charset=utf-8"});
    res.end("Not found");
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const body = fs.readFileSync(file);
  const headers = {
    "content-type": TYPES[ext] || "application/octet-stream",
    "cache-control": "no-cache",
    "vary": "Accept-Encoding",
  };
  if (requestPath === '/estimator' || requestPath.startsWith('/estimator/')) headers['x-robots-tag'] = 'noindex';

  const acceptsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  if (acceptsGzip && COMPRESSIBLE.has(ext)) {
    const compressed = zlib.gzipSync(body, { level: 6 });
    headers["content-encoding"] = "gzip";
    headers["content-length"] = String(compressed.length);
    res.writeHead(200, headers);
    res.end(req.method === "HEAD" ? undefined : compressed);
    return;
  }

  headers["content-length"] = String(body.length);
  res.writeHead(200, headers);
  res.end(req.method === "HEAD" ? undefined : body);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Optivue QA server listening on http://127.0.0.1:${PORT}`);
});
