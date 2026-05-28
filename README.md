# Portfolio Web

Portfolio profesional editable con Angular, backend Express, Google Identity
Services y Google Sheets como base de datos administrable. El frontend no guarda
credenciales: la cuenta de servicio, allowlist de administradores y acceso a
Sheets viven solamente en el backend.

## Arquitectura

```txt
Firebase Hosting / Angular
        |
        | GET publico / CRUD admin con Google ID token
        v
Cloud Run / Express backend
        |
        | Service account
        v
Google Sheets
```

## Estructura

- `porfolio-web`: frontend Angular.
- `backend`: API Express segura para Google Sheets, OAuth y CV PDF.
- `backend/scripts/bootstrap-sheet.js`: crea pestañas y encabezados.
- `backend/scripts/import-data-json.js`: importa `data.json` a Google Sheets.
- `porfolio-web/src/assets/data/data.json`: respaldo local y semilla inicial.

## Secciones Editables

El sitio permite administrar desde la UI, con cuenta autorizada:

- Perfil principal: nombre, edad, foto, cargo, ubicación, frase superior, bajada,
  título de contacto y copyright.
- Sobre mí.
- Organizaciones del carrusel de logos.
- Indicadores de impacto.
- Áreas de foco.
- Educación y formación.
- Diplomas y certificados.
- Enlaces y llamadas a la acción del hero/footer.
- Trabajos.
- Mis Proyectos.
- Tecnologías dominadas.

Los registros se crean, editan y eliminan mediante baja lógica en Google Sheets
usando la columna `active`.

Cada registro editable incluye el campo `order`. Los valores mas bajos se
muestran primero en el portfolio. Si importas desde `data.json`, el script
asigna el orden segun la posicion de cada elemento cuando no exista un valor
definido.

## Requisitos

- Node.js 20 o superior.
- npm.
- Una cuenta de Google Cloud.
- Google Sheets API activada.
- Firebase CLI para publicar frontend.
- Google Cloud CLI o Cloud Shell para publicar backend.

## Variables del Backend

Crear `backend/.env`:

```env
PORT=3000
CORS_ORIGIN=http://127.0.0.1:4200,http://localhost:4200

GOOGLE_CLIENT_ID=tu-web-client-id.apps.googleusercontent.com
GOOGLE_SHEET_ID=id-real-de-la-planilla
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

No subir `.env` al repositorio. Si alguna private key real se compartió fuera de
Google Cloud, rotarla antes de producción.

## Google Cloud y Sheets

1. Crear o elegir un proyecto en Google Cloud.
2. Activar Google Sheets API.
3. Crear una service account.
4. Crear una key JSON para esa service account.
5. Crear una Google Sheet.
6. Copiar el ID de la Sheet desde la URL:

```txt
https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
```

7. Compartir la Sheet con el email de la service account como Editor.
8. Crear un OAuth Client ID tipo `Web application`.
9. En `Authorized JavaScript origins`, agregar:

```txt
http://localhost:4200
http://127.0.0.1:4200
```

No agregar `/admin`, `/inicio`, `/callback` ni barra final.

10. Si la pantalla de consentimiento está en `Testing`, agregar los correos
    administradores como test users.

## Configurar Angular

En `porfolio-web/src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  googleClientId: 'tu-web-client-id.apps.googleusercontent.com',
  cvPdfPath: 'assets/data/CV_Lisandro_Rios_De_Morla.pdf',
};
```

En `porfolio-web/src/environments/environment.prod.ts`, `apiBaseUrl` se completa
cuando Cloud Run entregue la URL del backend.

## Ejecutar Local

Backend:

```bash
cd backend
npm install
npm run check-env
npm run setup-sheet
npm run seed:data-json
npm run dev
```

Frontend:

```bash
cd porfolio-web
npm install
npm start
```

Abrir:

```txt
http://127.0.0.1:4200
http://127.0.0.1:4200/admin
```

## Pestañas de Google Sheets

`npm run setup-sheet` crea estas pestañas:

- `profile`
- `projects`
- `work`
- `technologies`
- `education`
- `certifications`
- `organizations`
- `highlights`
- `focusAreas`
- `links`

`npm run seed:data-json` limpia y vuelve a cargar esas pestañas con el contenido
de `porfolio-web/src/assets/data/data.json`.
Si agregas la columna `order` a una base existente, ejecuta primero
`npm run setup-sheet` y luego `npm run seed:data-json` para regenerar encabezados
y datos de prueba.

## Endpoints

Públicos:

```http
GET /health
GET /portfolio
```

Administrativos, requieren:

```http
Authorization: Bearer <google_id_token>
```

```http
GET /auth/session
PUT /profile/:key
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
POST /certifications
PUT /certifications/:certificationId
DELETE /certifications/:certificationId
POST /organizations
PUT /organizations/:organizationId
DELETE /organizations/:organizationId
POST /highlights
PUT /highlights/:highlightId
DELETE /highlights/:highlightId
POST /focus-areas
PUT /focus-areas/:focusAreaId
DELETE /focus-areas/:focusAreaId
POST /links
PUT /links/:linkId
DELETE /links/:linkId
GET /cv
```

## Verificación

Backend:

```bash
cd backend
npm run check
```

Frontend:

```bash
cd porfolio-web
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

## Producción Paso a Paso

### Opcion gratis: Render Blueprint

Este repo incluye `render.yaml` en la raiz para desplegar sin billing en Render:

- `lisanrios-porfolio-api`: backend Express en plan `free`.
- `lisanrios-porfolio-web`: frontend Angular como static site.

En Render, crear un Blueprint con:

```txt
Branch: main
Blueprint Path: render.yaml
```

Render va a pedir estas variables porque estan marcadas con `sync: false`:

```env
GOOGLE_CLIENT_ID=tu-web-client-id.apps.googleusercontent.com
GOOGLE_SHEET_ID=id-real-de-la-planilla
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

La URL esperada del backend es:

```txt
https://lisanrios-porfolio-api.onrender.com
```

Probar:

```txt
https://lisanrios-porfolio-api.onrender.com/health
```

El frontend de produccion ya apunta a esa API desde
`porfolio-web/src/environments/environment.prod.ts`.

Para que el login admin funcione desde Render, agregar este origin al OAuth
Client ID de Google:

```txt
https://lisanrios-porfolio-web.onrender.com
```

Mantener tambien los origins de Firebase si vas a seguir usando Firebase
Hosting:

```txt
https://porfolio-web-fe382.web.app
https://porfolio-web-fe382.firebaseapp.com
```

Nota: el plan gratis de Render puede dormir el backend cuando no recibe trafico.
La primera carga despues de un rato puede tardar mas.

### 1. Preparar OAuth

1. En Google Cloud, abrir `APIs & Services` -> `Credentials`.
2. Editar el OAuth Client ID tipo `Web application`.
3. Agregar origins de producción:

```txt
https://TU_PROJECT_ID.web.app
https://TU_PROJECT_ID.firebaseapp.com
```

4. Mantener también los origins locales si vas a seguir desarrollando.
5. Confirmar que el mismo `GOOGLE_CLIENT_ID` esté en Angular y backend.

### 2. Publicar Backend en Cloud Run

Si `gcloud` no existe en PowerShell:

```powershell
winget install Google.CloudSDK
```

Cerrar y abrir la terminal, luego:

```bash
gcloud init
gcloud config set project TU_PROJECT_ID
```

Desde la raíz del repo:

```bash
cd backend
gcloud run deploy portfolio-api --source . --region us-central1 --allow-unauthenticated
```

En Cloud Run configurar variables:

```env
PORT=8080
CORS_ORIGIN=https://TU_PROJECT_ID.web.app,https://TU_PROJECT_ID.firebaseapp.com
GOOGLE_CLIENT_ID=tu-web-client-id.apps.googleusercontent.com
GOOGLE_SHEET_ID=id-real-de-la-planilla
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=private-key-real
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

Para `GOOGLE_PRIVATE_KEY`, usar Secret Manager o la UI de Cloud Run. No pegar
claves reales en comandos ni commits.

Cloud Run entregará una URL parecida a:

```txt
https://portfolio-api-xxxxx-uc.a.run.app
```

Probar:

```txt
https://portfolio-api-xxxxx-uc.a.run.app/health
```

### 3. Conectar Frontend de Producción

Editar `porfolio-web/src/environments/environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://portfolio-api-xxxxx-uc.a.run.app',
  googleClientId: 'tu-web-client-id.apps.googleusercontent.com',
  cvPdfPath: 'assets/data/CV_Lisandro_Rios_De_Morla.pdf',
};
```

### 4. Publicar Frontend en Firebase Hosting

```bash
cd porfolio-web
npm run build
firebase login
firebase use TU_PROJECT_ID
firebase deploy --only hosting
```

### 5. Checklist Final

- La Sheet está compartida con la service account como Editor.
- `GOOGLE_SHEET_ID` es el ID real entre `/d/` y `/edit`.
- `GOOGLE_CLIENT_ID` es Web Application y coincide en Angular/backend.
- `Authorized JavaScript origins` incluye local y Firebase.
- `ADMIN_EMAILS` está solo en backend/Cloud Run.
- `CORS_ORIGIN` incluye únicamente los dominios reales permitidos.
- `environment.prod.ts` apunta a la URL real de Cloud Run.
- `/health` responde en producción.
- Login funciona desde `/admin`.
- Crear, editar y eliminar registros actualiza Google Sheets.

## Actualizar Producción Después de Cambios

1. Probar local:

```bash
cd backend
npm run check
cd ../porfolio-web
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

2. Si cambiaste estructura de Sheets:

```bash
cd ../backend
npm run setup-sheet
```

3. Si querés reemplazar la base con `data.json`:

```bash
npm run seed:data-json
```

4. Publicar backend si cambió código del servidor:

```bash
gcloud run deploy portfolio-api --source backend --region us-central1 --allow-unauthenticated
```

5. Publicar frontend:

```bash
cd porfolio-web
npm run build
firebase deploy --only hosting
```

6. Validar producción:

```txt
https://TU_PROJECT_ID.web.app
https://TU_BACKEND_CLOUD_RUN_URL/health
```

## Futuras Mejoras

- Auditoría visible de cambios: usuario, fecha, entidad y acción.
- Reordenamiento visual con drag and drop en lugar de campo numerico.
- Subida de imágenes a Firebase Storage o Cloudinary.
- Vista previa antes de publicar cambios.
- Estados `draft/published` para preparar cambios sin mostrarlos al público.
- Exportación e importación completa de la base.
- Tests e2e con Playwright para login, CRUD y navegación.
- CV con plantillas seleccionables desde la administración.
- Internacionalización español/inglés.
- Métricas de visitas y clics por enlace.
