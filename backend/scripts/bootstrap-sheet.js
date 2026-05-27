import '../src/config.js';
import { config } from '../src/config.js';
import { createGoogleSheetsClient } from '../src/services/googleSheetsClient.js';

const sheets = createGoogleSheetsClient();

const sheetDefinitions = {
  profile: ['key', 'value'],
  projects: [
    'id',
    'order',
    'type',
    'name',
    'date',
    'image',
    'description',
    'link',
    'lenguaje_json',
    'active',
  ],
  work: [
    'id',
    'order',
    'type',
    'name',
    'dateInicio',
    'dateFin',
    'logo',
    'link',
    'description_json',
    'technologies_json',
    'active',
  ],
  technologies: ['id', 'order', 'icon', 'name', 'nivel', 'active'],
  education: [
    'id',
    'order',
    'type',
    'name',
    'dateInicio',
    'dateFin',
    'description',
    'active',
  ],
  certifications: [
    'id',
    'order',
    'title',
    'issuer',
    'date',
    'credentialUrl',
    'description',
    'icon',
    'active',
  ],
  organizations: ['id', 'order', 'name', 'image', 'alt', 'link', 'active'],
  highlights: ['id', 'order', 'value', 'label', 'icon', 'active'],
  focusAreas: ['id', 'order', 'icon', 'title', 'description', 'active'],
  links: ['id', 'order', 'label', 'url', 'icon', 'placement', 'downloadName', 'active'],
};

let metadata;

try {
  metadata = await sheets.spreadsheets.get({
    spreadsheetId: config.googleSheetId,
  });
} catch (error) {
  handleGoogleSheetsError(error);
}
const existingTitles = new Set(
  metadata.data.sheets?.map((sheet) => sheet.properties?.title).filter(Boolean)
);
const missingSheets = Object.keys(sheetDefinitions).filter(
  (title) => !existingTitles.has(title)
);

if (missingSheets.length) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: config.googleSheetId,
    requestBody: {
      requests: missingSheets.map((title) => ({
        addSheet: {
          properties: { title },
        },
      })),
    },
  });
}

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: config.googleSheetId,
  requestBody: {
    valueInputOption: 'RAW',
    data: Object.entries(sheetDefinitions).map(([title, headers]) => ({
      range: `${title}!A1:${columnLetter(headers.length)}1`,
      values: [headers],
    })),
  },
});

console.log('Google Sheet preparada para el CRUD del portfolio.');

function columnLetter(columnNumber) {
  let number = columnNumber;
  let letters = '';

  while (number > 0) {
    const remainder = (number - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    number = Math.floor((number - 1) / 26);
  }

  return letters;
}

function handleGoogleSheetsError(error) {
  const status = error?.status ?? error?.response?.status;
  const reason = error?.errors?.[0]?.reason;

  console.error('No se pudo acceder a la Google Sheet.');

  if (status === 404) {
    console.error('');
    console.error('Causas probables:');
    console.error('1. GOOGLE_SHEET_ID no es el ID real de la planilla.');
    console.error('2. La planilla no esta compartida con la service account.');
    console.error('3. La planilla fue borrada o pertenece a otra cuenta.');
    console.error('');
    console.error('El ID correcto esta en la URL:');
    console.error('https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit');
  } else if (status === 403) {
    console.error('');
    console.error('La service account existe, pero no tiene permiso sobre la planilla.');
    console.error('Comparte la Sheet con GOOGLE_SERVICE_ACCOUNT_EMAIL como Editor.');
  } else if (reason) {
    console.error(`Motivo de Google: ${reason}`);
  }

  process.exit(1);
}
