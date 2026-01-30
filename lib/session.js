// lib/session.js
import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'financial-tracker-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
};

export async function getSession(req, res) {
  return await getIronSession(req, res, sessionOptions);
}

export async function withAuth(handler) {
  return async (req, res) => {
    const session = await getSession(req, res);

    if (!session.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    return handler(req, res, session);
  };
}
