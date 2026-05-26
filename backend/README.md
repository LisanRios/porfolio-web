# Portfolio Sheets Backend

Backend seguro para leer y administrar el portfolio desde Google Sheets.

## Que automatiza

- Verifica Google ID tokens recibidos desde Angular.
- Permite CRUD de proyectos solo a correos autorizados en `ADMIN_EMAILS`.
- Lee Google Sheets con una service account.
- Normaliza la planilla al formato que usa el portfolio Angular.
- Genera un PDF basico de CV desde la misma fuente de datos.
- Incluye `npm run setup-sheet` para crear pestañas y encabezados.

## Que tenes que hacer una vez

1. Crear o elegir un proyecto en Google Cloud.
2. Activar Google Sheets API.
3. Crear una service account.
4. Crear una key JSON para esa service account.
5. Crear una Google Sheet.
6. Compartir la Sheet con el email de la service account como Editor.
7. Copiar `.env.example` a `.env` y completar las variables reales.

## Instalacion local

```bash
cd backend
npm install
copy .env.example .env
```

Completa `.env` con:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_SHEET_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_EMAILS=tu-admin@example.com,otro-admin@example.com
```

## Preparar la planilla

Con `.env` completo y la planilla compartida:

```bash
npm run setup-sheet
```

Ese comando crea estas pestañas si faltan:

- `profile`
- `projects`
- `work`
- `technologies`
- `education`

Tambien escribe los encabezados esperados por el backend.

## Ejecutar

```bash
npm run dev
```

La API queda en:

```txt
http://localhost:3000
```

## Endpoints

Publico:

```http
GET /health
GET /portfolio
```

Administrativos:

```http
POST /projects
PUT /projects/:projectId
DELETE /projects/:projectId
POST /work
PUT /work/:workId
DELETE /work/:workId
POST /technologies
PUT /technologies/:technologyId
DELETE /technologies/:technologyId
POST /education
PUT /education/:educationId
DELETE /education/:educationId
GET /cv
```

Los endpoints administrativos requieren:

```http
Authorization: Bearer <google_id_token>
```
