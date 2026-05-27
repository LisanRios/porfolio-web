import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import '../src/config.js';
import { config } from '../src/config.js';
import { createGoogleSheetsClient } from '../src/services/googleSheetsClient.js';
import { makeId, stringifyJsonCell } from '../src/utils/sheetRows.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, '../../porfolio-web/src/assets/data/data.json');
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

const rawData = JSON.parse(await readFile(dataPath, 'utf8'));
const data = repairMojibake(rawData);

await ensureSheetStructure();
await sheets.spreadsheets.values.batchClear({
  spreadsheetId: config.googleSheetId,
  requestBody: {
    ranges: [
      'profile!A:B',
      'projects!A:J',
      'work!A:K',
      'technologies!A:F',
      'education!A:H',
      'certifications!A:I',
      'organizations!A:G',
      'highlights!A:F',
      'focusAreas!A:F',
      'links!A:H',
    ],
  },
});

await sheets.spreadsheets.values.batchUpdate({
  spreadsheetId: config.googleSheetId,
  requestBody: {
    valueInputOption: 'RAW',
    data: [
      {
        range: 'profile!A:B',
        values: [
          sheetDefinitions.profile,
          ['nombre', data.nombre],
          ['age', data.age],
          ['foto', data.foto],
          ['position', data.position],
          ['ubication', data.ubication],
          ['heroKicker', data.heroKicker || `Hola, soy ${data.nombre}`],
          [
            'heroSubtitle',
            data.heroSubtitle ||
              'Especializado en crear experiencias web modernas, accesibles y orientadas a producto.',
          ],
          ['contactTitle', data.contactTitle || '¿Interesado en conocerme?'],
          [
            'copyrightName',
            data.copyrightName || 'Lisandro Gabriel Rios De Morla',
          ],
          [
            'about',
            data.about ||
              'Me destaco por ser una persona responsable, dedicada y orientada a la mejora continua. Mi ética de trabajo se refleja en el esfuerzo constante por elevar mis habilidades y conocimientos. Mi entusiasmo por la tecnología y mi compromiso con el crecimiento profesional son activos que busco aportar a cada equipo.',
          ],
        ],
      },
      {
        range: 'projects!A:J',
        values: [
          sheetDefinitions.projects,
          ...(data.project ?? []).map((project, index) => [
            project.id || makeId(project.name),
            orderValue(project, index),
            project.type,
            project.name,
            project.date,
            project.image,
            project.description,
            project.link,
            stringifyJsonCell(project.lenguaje),
            'TRUE',
          ]),
        ],
      },
      {
        range: 'work!A:K',
        values: [
          sheetDefinitions.work,
          ...(data.trabajo ?? []).map((work, index) => [
            work.id || makeId(`${work.name}-${work.type}`),
            orderValue(work, index),
            work.type,
            work.name,
            work.dateInicio,
            work.dateFin,
            work.logo,
            work.link,
            stringifyJsonCell(work.description),
            stringifyJsonCell(work.technologies ?? []),
            'TRUE',
          ]),
        ],
      },
      {
        range: 'technologies!A:F',
        values: [
          sheetDefinitions.technologies,
          ...(data.tecnology ?? []).map((technology, index) => [
            technology.id || makeId(technology.name),
            orderValue(technology, index),
            technology.icon,
            technology.name,
            technology.nivel,
            'TRUE',
          ]),
        ],
      },
      {
        range: 'education!A:H',
        values: [
          sheetDefinitions.education,
          ...(data.titule ?? []).map((education, index) => [
            education.id || makeId(`${education.name}-${education.type}`),
            orderValue(education, index),
            education.type,
            education.name,
            education.dateInicio,
            education.dateFin,
            education.description,
            'TRUE',
          ]),
        ],
      },
      {
        range: 'certifications!A:I',
        values: [
          sheetDefinitions.certifications,
          ...(data.certifications ?? []).map((certification, index) => [
            certification.id || makeId(`${certification.issuer}-${certification.title}`),
            orderValue(certification, index),
            certification.title,
            certification.issuer,
            certification.date,
            certification.credentialUrl,
            certification.description,
            certification.icon,
            'TRUE',
          ]),
        ],
      },
      {
        range: 'organizations!A:G',
        values: [
          sheetDefinitions.organizations,
          ...(data.organizations ?? []).map((organization, index) => [
            organization.id || makeId(organization.name),
            orderValue(organization, index),
            organization.name,
            organization.image,
            organization.alt,
            organization.link ?? '',
            'TRUE',
          ]),
        ],
      },
      {
        range: 'highlights!A:F',
        values: [
          sheetDefinitions.highlights,
          ...(data.highlights ?? []).map((highlight, index) => [
            highlight.id || makeId(highlight.label),
            orderValue(highlight, index),
            highlight.value,
            highlight.label,
            highlight.icon,
            'TRUE',
          ]),
        ],
      },
      {
        range: 'focusAreas!A:F',
        values: [
          sheetDefinitions.focusAreas,
          ...(data.focusAreas ?? []).map((focusArea, index) => [
            focusArea.id || makeId(focusArea.title),
            orderValue(focusArea, index),
            focusArea.icon,
            focusArea.title,
            focusArea.description,
            'TRUE',
          ]),
        ],
      },
      {
        range: 'links!A:H',
        values: [
          sheetDefinitions.links,
          ...(data.links ?? []).map((link, index) => [
            link.id || makeId(`${link.placement}-${link.label}`),
            orderValue(link, index),
            link.label,
            link.url,
            link.icon,
            link.placement,
            link.downloadName ?? '',
            'TRUE',
          ]),
        ],
      },
    ],
  },
});

console.log('Datos de data.json importados en Google Sheets.');

async function ensureSheetStructure() {
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: config.googleSheetId,
  });
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
}

const WINDOWS_1252_BYTES = new Map([
  ['€', 0x80],
  ['‚', 0x82],
  ['ƒ', 0x83],
  ['„', 0x84],
  ['…', 0x85],
  ['†', 0x86],
  ['‡', 0x87],
  ['ˆ', 0x88],
  ['‰', 0x89],
  ['Š', 0x8a],
  ['‹', 0x8b],
  ['Œ', 0x8c],
  ['Ž', 0x8e],
  ['‘', 0x91],
  ['’', 0x92],
  ['“', 0x93],
  ['”', 0x94],
  ['•', 0x95],
  ['–', 0x96],
  ['—', 0x97],
  ['˜', 0x98],
  ['™', 0x99],
  ['š', 0x9a],
  ['›', 0x9b],
  ['œ', 0x9c],
  ['ž', 0x9e],
  ['Ÿ', 0x9f],
]);

function repairMojibake(value) {
  if (typeof value === 'string') {
    return looksMojibake(value) ? decodeWindows1252AsUtf8(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map(repairMojibake);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, repairMojibake(entry)])
    );
  }

  return value;
}

function looksMojibake(value) {
  return /Ã|Â|â|ð/.test(value);
}

function orderValue(item, index) {
  const parsed = Number(item?.order);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : index + 1;
}

function decodeWindows1252AsUtf8(value) {
  const bytes = [];

  for (const char of value) {
    const code = char.charCodeAt(0);

    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    const mapped = WINDOWS_1252_BYTES.get(char);

    if (mapped === undefined) {
      return value;
    }

    bytes.push(mapped);
  }

  return Buffer.from(bytes).toString('utf8');
}
