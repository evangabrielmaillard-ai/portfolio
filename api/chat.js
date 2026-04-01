import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rate limiting — serveur side
const rateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 20;
  const entry = rateLimit.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count++;
  rateLimit.set(ip, entry);
  if (rateLimit.size > 1000) {
    for (const [key, val] of rateLimit.entries()) {
      if (now > val.resetAt) rateLimit.delete(key);
    }
  }
  return entry.count <= maxRequests;
}

// Lecture du system prompt — relatif à ce fichier (api/ → ../system_prompt.txt)
let _cachedPrompt = null;
function getSystemPrompt() {
  if (_cachedPrompt) return _cachedPrompt;
  const paths = [
    join(__dirname, '..', 'system_prompt.txt'),
    join(process.cwd(), 'system_prompt.txt'),
    '/var/task/system_prompt.txt',
  ];
  for (const filePath of paths) {
    try {
      const content = readFileSync(filePath, 'utf-8').trim();
      if (content) {
        console.log('[chat] system_prompt.txt chargé depuis:', filePath);
        _cachedPrompt = content;
        return content;
      }
    } catch (e) {
      // Essai suivant
    }
  }
  console.error('[chat] system_prompt.txt introuvable dans tous les chemins essayés:', paths);
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit atteint. Réessayez dans une heure.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Payload invalide.' });
  if (messages.length > 20) return res.status(400).json({ error: 'Payload invalide.' });
  for (const msg of messages) {
    if (typeof msg.role !== 'string' || typeof msg.content !== 'string') return res.status(400).json({ error: 'Payload invalide.' });
    if (!['user', 'assistant'].includes(msg.role)) return res.status(400).json({ error: 'Payload invalide.' });
    if (msg.content.length > 4000) return res.status(400).json({ error: 'Payload invalide.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[chat] ANTHROPIC_API_KEY manquante');
    return res.status(503).json({ error: 'Service temporairement indisponible.' });
  }

  const systemPrompt = getSystemPrompt();
  if (!systemPrompt) {
    return res.status(503).json({ error: 'Service temporairement indisponible.' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages: messages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok) {
      console.error('[chat] Erreur Anthropic', response.status, data?.error?.type);
      return res.status(502).json({ error: 'Erreur de service. Réessayez.' });
    }

    return res.status(200).json(data);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[chat] Timeout');
      return res.status(504).json({ error: 'Délai dépassé. Réessayez.' });
    }
    console.error('[chat] Exception', error.message);
    return res.status(500).json({ error: 'Erreur inattendue. Réessayez.' });
  }
}
