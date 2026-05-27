# Portfolio Web

Portfolio personal desarrollado en Angular con panel de administración protegido
por Google Identity Services y persistencia mediante Google Sheets API desde un
backend seguro.

## Estructura

- `src/app`: aplicación Angular.
- `src/app/components`: vistas públicas y login administrativo.
- `src/app/service`: servicios de datos, autenticación y API administrativa.
- `src/environments`: configuración local y de producción.
- `docs`: documentación central del sistema.
- `../backend`: API Express para Google Sheets, OAuth y generación de CV.

## Desarrollo local

Levantar backend:

```bash
cd ../backend
npm install
npm run check-env
npm run setup-sheet
npm run seed:data-json
npm run dev
```

Levantar frontend:

```bash
cd ../porfolio-web
npm install
npm start
```

Abrir:

```txt
http://127.0.0.1:4200
```

Panel/login:

```txt
http://127.0.0.1:4200/admin
```

## Administración

La navegación muestra `Login` con el icono de Google. Una vez iniciada sesión y
validada la cuenta contra el backend, aparecen controles inline:

- `+` para crear registros.
- Lápiz para editar.
- Tacho de basura para eliminar mediante baja lógica en Google Sheets.

Secciones editables:

- Sobre mí.
- Educación y formación.
- Trabajos.
- Tecnologías dominadas.
- Mis Proyectos.
- Diplomas y certificados.

La allowlist de administradores vive solo en `backend/.env` o en las variables
del servidor de producción.

## Documentación

- [Evolución del portfolio](docs/portfolio-evolution.md)
- [Setup CRUD con Google Sheets](docs/google-sheets-crud-setup.md)
- [OAuth y deploy Firebase/Cloud Run](docs/oauth-and-firebase-deploy.md)
- [Reglas Firestore de ejemplo](docs/firebase-firestore-rules.example)
- [Backend README](../backend/README.md)
- [Plantilla de Google Sheets](../backend/scripts/sheets-template.csv.md)

## Build y tests

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

## Publicación en producción

1. Crear OAuth Client ID tipo `Web application`.
2. Agregar origins autorizados:

```txt
http://localhost:4200
http://127.0.0.1:4200
https://TU_PROJECT_ID.web.app
https://TU_PROJECT_ID.firebaseapp.com
```

3. Deployar backend en Cloud Run:

```bash
cd ../backend
gcloud run deploy portfolio-api --source . --region us-central1 --allow-unauthenticated
```

4. Configurar variables en Cloud Run:

```txt
GOOGLE_CLIENT_ID
GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
ADMIN_EMAILS
CORS_ORIGIN
```

5. Actualizar `src/environments/environment.prod.ts`:

```ts
apiBaseUrl: 'https://TU_BACKEND_CLOUD_RUN_URL',
googleClientId: 'TU_CLIENT_ID_WEB.apps.googleusercontent.com',
```

6. Deployar Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

## Futuras implementaciones

- Editor inline también para proyectos y datos del perfil.
- Historial de cambios con usuario, fecha y acción.
- Vista previa antes de publicar cambios.
- Carga de imágenes a Firebase Storage o Cloudinary.
- Validación visual de iconos antes de guardar.
- Generador de CV con plantillas y selección de idioma.
- Modo borrador/publicado para cada registro.
- Ordenamiento drag and drop de trabajos, tecnologías y educación.
- Tests e2e con Playwright para login, CRUD y navegación.
- Panel de métricas con visitas, clicks en CV y clicks de contacto.
