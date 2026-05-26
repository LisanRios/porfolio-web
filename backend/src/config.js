import 'dotenv/config';

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function optionalList(name, fallback = '') {
  return (process.env[name] ?? fallback)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  corsOrigins: optionalList('CORS_ORIGIN', 'http://127.0.0.1:4200,http://localhost:4200'),
  googleClientId: requiredEnv('GOOGLE_CLIENT_ID'),
  googleSheetId: requiredEnv('GOOGLE_SHEET_ID'),
  serviceAccountEmail: requiredEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
  serviceAccountPrivateKey: requiredEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  adminEmails: new Set(optionalList('ADMIN_EMAILS').map((email) => email.toLowerCase())),
};
