let count = 0;
const startTime = Date.now();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    count++;
    return res.status(200).json({ count, since: startTime });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
