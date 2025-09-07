const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const catproxurl = 'https://example.com'; // link goes here

const proxy = createProxyMiddleware({
  target: catproxurl,
  changeOrigin: true,
  secure: true,
  logLevel: 'debug',
  router: function(req) {
    if (req.headers.host === 'example.com') { // change this too
      req.headers['X-Forwarded-For'] = ''; 
      req.headers['X-Real-IP'] = '';
      req.headers['Via'] = '';
    }
    return catproxurl;
  }
});

app.use('/', proxy);

const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`CatProxx is running on port ${port}`);
});
