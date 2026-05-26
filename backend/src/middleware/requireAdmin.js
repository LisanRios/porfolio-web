import { OAuth2Client } from 'google-auth-library';
import { config } from '../config.js';

const oauthClient = new OAuth2Client(config.googleClientId);

export async function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();

    if (!email || !payload?.email_verified || !config.adminEmails.has(email)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    req.user = { email };
    return next();
  } catch {
    return res.status(401).json({ message: 'Sesion invalida' });
  }
}
