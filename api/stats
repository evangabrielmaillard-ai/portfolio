const { Redis } = require('@upstash/redis');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const count = await redis.get('prompt_count') || 0;
    return res.status(200).json({ count: Number(count) });
  } catch (e) {
    return res.status(200).json({ count: 0 });
  }
};
