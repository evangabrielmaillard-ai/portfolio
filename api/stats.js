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

    const r = await fetch(`${url}/get/prompt_count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();
    console.log('[stats] redis response:', JSON.stringify(data));
    const count = parseInt(data.result) || 0;
    return res.status(200).json({ count });
  } catch(e) {
    console.error('[stats] erreur:', e.message);
    return res.status(200).json({ count: 0 });
  }
};
