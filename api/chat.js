export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      content: [{ text: 'DEBUG: Clé API manquante — variable ANTHROPIC_API_KEY non trouvée.' }]
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
        system: system || '',
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
