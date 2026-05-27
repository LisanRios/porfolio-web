# Setup CRUD con Google Sheets

Esta guia usa el backend creado en `../backend`.

## 1. Crear credenciales de Google

1. En Google Cloud, crea o elegi un proyecto.
2. Activa Google Sheets API.
3. Crea una service account.
4. Crea una key JSON para esa service account.
5. Crea una Google Sheet vacia.
6. Comparte la Sheet con el email de la service account como Editor.

## 2. Configurar backend

```bash
cd backend
npm install
copy .env.example .env
```

Completa `backend/.env`:

```env
PORT=3000
CORS_ORIGIN=http://127.0.0.1:4200,http://localhost:4200
GOOGLE_CLIENT_ID=tu-web-client-id.apps.googleusercontent.com
GOOGLE_SHEET_ID=id-de-la-planilla
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

`ADMIN_EMAILS` queda solo en el backend. No va en Angular.

## 3. Preparar Google Sheet automaticamente

```bash
cd backend
npm run setup-sheet
```

El comando crea estas pestañas y encabezados:

- `profile`
- `projects`
- `work`
- `technologies`
- `education`
- `certifications`

Para importar los datos actuales de `data.json`:

```bash
npm run seed:data-json
```

## 4. Levantar backend

```bash
cd backend
npm run dev
```

Probar salud:

```txt
http://localhost:3000/health
```

## 5. Configurar Angular

En `porfolio-web/src/environments/environment.ts`:

```ts
apiBaseUrl: 'http://localhost:3000',
googleClientId: 'tu-web-client-id.apps.googleusercontent.com',
```

Si aparece `no registered origin` o `invalid_client`, revisa
`docs/oauth-and-firebase-deploy.md`.

## 6. Usar el panel

```bash
cd porfolio-web
npm start
```

Abrir:

```txt
http://127.0.0.1:4200/admin
```

Flujo:

1. Iniciar sesion con Google.
2. Cargar datos.
3. Crear, editar o desactivar proyectos.
4. Verificar los cambios en la pestaña `projects` de la Sheet.

## 7. Deploy

1. Subir el backend a Render, Railway, Cloud Run u otro host Node.
2. Cargar las mismas variables de `.env` en el proveedor.
3. Actualizar `environment.prod.ts`:

```ts
apiBaseUrl: 'https://tu-backend.com',
googleClientId: 'tu-web-client-id.apps.googleusercontent.com',
```

4. Deployar Angular en Firebase Hosting.
