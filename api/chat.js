import fs from 'node:fs';
import path from 'node:path';

let cachedSystemPrompt = null;

function getSystemPrompt() {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  const envPrompt = process.env.SYSTEM_PROMPT?.trim();
  if (envPrompt) {
    cachedSystemPrompt = envPrompt;
    return cachedSystemPrompt;
  }

  const filePath = path.join(process.cwd(), 'prompts', 'system-prompt.txt');

  if (!fs.existsSync(filePath)) {
    throw new Error(`System prompt introuvable : ${filePath}`);
  }

  const filePrompt = fs.readFileSync(filePath, 'utf8').trim();

  if (!filePrompt) {
    throw new Error('Le fichier system-prompt.txt est vide.');
  }

  cachedSystemPrompt = filePrompt;
  return cachedSystemPrompt;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      content: [{ text: 'DEBUG: Clé API manquante — variable ANTHROPIC_API_KEY non trouvée.' }]
    });
  }

  let systemPrompt = '';
  try {
    systemPrompt = getSystemPrompt();
  } catch (error) {
    return res.status(200).json({
      content: [{ text: `DEBUG: ${error.message}` }]
    });
  }

  try {
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
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        content: [{ text: 'DEBUG erreur Anthropic ' + response.status + ' : ' + JSON.stringify(data) }]
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(200).json({
      content: [{ text: 'DEBUG exception : ' + error.message }]
    });
  }
}
