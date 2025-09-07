// CatProxx - Full Version 😽🐾
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio'); // for rewriting HTML
const axios = require('axios');

const app = express();

// Change this to the site you want to proxy
const targetURL = 'https://example.com';

// Privacy headers
const privacyHeaders = {
  'X-Forwarded-For': '',
  'X-Real-IP': '',
  'Via': ''
};

// Function to rewrite HTML links so resources go through proxy
async function rewriteHTML(originalHTML, req) {
  const $ = cheerio.load(originalHTML);

  // Rewrite script, link, img, video, audio, iframe sources
  $('script[src], link[href], img[src], video[src], audio[src], iframe[src]').each(function() {
    const attr = $(this).attr('src') ? 'src' : 'href';
    let url = $(this).attr(attr);

    if (!url) return;

    // Only rewrite relative or absolute URLs
    if (url.startsWith('http') || url.startsWith('//') || url.startsWith('/')) {
      // Point through your proxy
      if (url.startsWith('//')) url = 'https:' + url;
      if (url.startsWith('/')) url = targetURL + url;

      $(this).attr(attr, '/' + url);
    }
  });

  return $.html();
}

// Proxy all requests
app.use('/', createProxyMiddleware({
  target: targetURL,
  changeOrigin: true,
  selfHandleResponse: true, // we handle rewriting
  secure: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    // Add privacy headers
    for (const key in privacyHeaders) {
      proxyReq.setHeader(key, privacyHeaders[key]);
    }
  },
  onProxyRes: async (proxyRes, req, res) => {
    let body = Buffer.from([]);
    proxyRes.on('data', chunk => { body = Buffer.concat([body, chunk]); });
    proxyRes.on('end', async () => {
      const contentType = proxyRes.headers['content-type'] || '';

      // If HTML, rewrite links
      if (contentType.includes('text/html')) {
        let html = body.toString('utf8');
        html = await rewriteHTML(html, req);
        res.setHeader('content-type', 'text/html');
        res.send(html);
      } else {
        // For everything else, just pipe it through
        for (const key in proxyRes.headers) {
          res.setHeader(key, proxyRes.headers[key]);
        }
        res.send(body);
      }
    });
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CatProxx is running on port ${port} 😸🐾`);
});