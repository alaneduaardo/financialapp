// pages/api/auth/login.js
import { getSession } from '../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Verificar credenciais do .env
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (username === validUsername && password === validPassword) {
    const session = await getSession(req, res);
    session.user = {
      username,
      loggedInAt: Date.now(),
    };
    await session.save();

    return res.status(200).json({ success: true, user: { username } });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
}
