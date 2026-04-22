module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const url = process.env.KV_REST_API_URL
             || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN
               || process.env.UPSTASH_REDIS_REST_TOKEN
               || process.env.KV_REST_API_READ_ONLY_TOKEN;

    console.log('[stats] KV_REST_API_URL:', !!process.env.KV_REST_API_URL, 'token:', !!token);

    if (!url || !token) return res.status(200).json({ count: 0 });

    // Timeout de 5s pour éviter que Redis lent bloque la page
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const r = await fetch(`${url}/get/prompt_count`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await r.json();
      console.log('[stats] redis response:', JSON.stringify(data));
      const count = parseInt(data.result) || 0;
      return res.status(200).json({ count });
    } catch(fetchErr) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        console.log('[stats] fetch timeout');
      }
      throw fetchErr;
    }
  } catch(e) {
    console.error('[stats] erreur:', e.message);
    return res.status(200).json({ count: 0 });
  }
};
