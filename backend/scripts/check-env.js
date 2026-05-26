import 'dotenv/config';

const variables = {
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
};

const checks = [
  {
    name: 'GOOGLE_CLIENT_ID',
    ok: Boolean(variables.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com')),
    hint: 'Debe ser un OAuth Client ID Web, no el email de la service account.',
  },
  {
    name: 'GOOGLE_SHEET_ID',
    ok: Boolean(variables.GOOGLE_SHEET_ID && variables.GOOGLE_SHEET_ID.length > 20),
    hint: 'Debe ser el ID entre /d/ y /edit en la URL de Google Sheets.',
  },
  {
    name: 'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    ok: Boolean(variables.GOOGLE_SERVICE_ACCOUNT_EMAIL?.endsWith('.iam.gserviceaccount.com')),
    hint: 'Debe ser el email de la service account y la Sheet debe estar compartida con este email.',
  },
  {
    name: 'GOOGLE_PRIVATE_KEY',
    ok: Boolean(
      variables.GOOGLE_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY') &&
        variables.GOOGLE_PRIVATE_KEY?.includes('END PRIVATE KEY')
    ),
    hint: 'Debe venir de la key JSON de la service account.',
  },
  {
    name: 'ADMIN_EMAILS',
    ok: Boolean(variables.ADMIN_EMAILS?.includes('@')),
    hint: 'Debe contener los correos autorizados separados por coma.',
  },
];

for (const [name, value] of Object.entries(variables)) {
  console.log(`${name}: ${mask(name, value)}`);
}

console.log('');

let hasErrors = false;

for (const check of checks) {
  if (check.ok) {
    console.log(`OK ${check.name}`);
    continue;
  }

  hasErrors = true;
  console.log(`ERROR ${check.name}: ${check.hint}`);
}

process.exitCode = hasErrors ? 1 : 0;

function mask(name, value) {
  if (!value) {
    return '(vacio)';
  }

  if (name === 'GOOGLE_PRIVATE_KEY') {
    return value.includes('BEGIN PRIVATE KEY') ? '(private key cargada)' : '(valor no reconocido)';
  }

  if (name === 'ADMIN_EMAILS') {
    return `${value.split(',').filter(Boolean).length} correo(s) configurado(s)`;
  }

  if (value.length <= 12) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}
