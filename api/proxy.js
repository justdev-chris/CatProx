// api/proxy.js
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const urlParam = new URL(req.url).searchParams.get('url');
    if (!urlParam) return new Response('No URL provided', { status: 400 });

    const targetURL = urlParam;

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
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    };

    const response = await fetch(targetURL, fetchOptions);

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
