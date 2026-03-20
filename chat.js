export const config = { runtime: 'edge' };

const RATE_LIMIT_MAP = new Map();
const MAX_REQUESTS_PER_HOUR = 20;

function getRateLimitKey(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const entry = RATE_LIMIT_MAP.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    RATE_LIMIT_MAP.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_HOUR) return false;
  RATE_LIMIT_MAP.set(ip, { count: entry.count + 1, start: entry.start });
  return true;
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const ip = getRateLimitKey(request);
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Max 20 messages per hour.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { messages, system } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Invalid messages' }), { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: system || '',
        messages: messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      return new Response(JSON.stringify({ error: err }), { status: anthropicResponse.status });
    }

    const data = await anthropicResponse.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to reach Anthropic API' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
