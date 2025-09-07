import fetch from 'node-fetch';

export const config = {
  runtime: 'edge', // Vercel Edge Function
};

export default async function handler(req) {
  try {
    const urlParam = req.url.split('?url=')[1];
    if (!urlParam) return new Response('No URL provided', { status: 400 });

    const targetURL = urlParam;

    // Copy all headers except sensitive ones
    const headers = {};
    req.headers.forEach((value, key) => {
      if (!['host', 'x-forwarded-for', 'x-real-ip', 'via'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });

    const fetchOptions = {
      method: req.method,
      headers,
      redirect: 'manual',
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;
    }

    const response = await fetch(targetURL, fetchOptions);

    // Forward response headers
    const respHeaders = new Headers(response.headers);
    respHeaders.set('Access-Control-Allow-Origin', '*');
    respHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    respHeaders.set('Access-Control-Allow-Headers', '*');

    const body = await response.arrayBuffer();

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: respHeaders,
    });
  } catch (err) {
    return new Response('Error fetching target: ' + err.toString(), { status: 500 });
  }
}