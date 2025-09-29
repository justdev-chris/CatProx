// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    return res.status(400).send('Missing ?url= parameter');
  }

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        ...Object.fromEntries(
          Object.entries(req.headers).filter(([k]) => !k.toLowerCase().startsWith('host'))
        ),
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    // copy headers
    for (const [key, value] of response.headers.entries()) {
      if (!['transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }

    const buf = Buffer.from(await response.arrayBuffer());
    res.status(response.status).send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error');
  }
}