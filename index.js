const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { JSDOM } = require('jsdom'); // for rewriting HTML

const app = express();
const target = 'https://example.com';

app.use('/', async (req, res, next) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    // Fetch HTML from target
    const response = await fetch(target + req.url);
    let html = await response.text();

    // Rewrite all URLs to go through the proxy
    html = html.replace(/(href|src)=["'](\/[^"']*)["']/g, `$1="/$2"`);

    res.send(html);
  } else {
    // For non-HTML (JS, CSS, images)
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: true,
      logLevel: 'debug'
    })(req, res, next);
  }
});

app.listen(443, () => console.log('CatProxx Enhanced running! 🐾'));