// pages/api/auth/me.js
import { getSession } from '../../../lib/session';

export default async function handler(req, res) {
  const session = await getSession(req, res);

  if (session.user) {
    return res.status(200).json({ user: session.user });
  }

  return res.status(401).json({ user: null });
}
