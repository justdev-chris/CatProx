import fetch from 'node-fetch';

export default async function handler(req, res) {
    const target = req.query.target;

    if (!target) {
        res.status(400).send('No target URL provided');
        return;
    }

    try {
        const response = await fetch(target, { headers: { 'User-Agent': req.headers['user-agent'] } });
        const contentType = response.headers.get('content-type');
        const body = await response.text();

        // Allow any origin to use this proxy
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', contentType);
        res.send(body);
    } catch (err) {
        res.status(500).send('Error fetching target URL: ' + err.message);
    }
}