# OAuth y deploy Firebase

## Error local: no registered origin / invalid_client

Ese error ocurre antes de llegar al backend. Google bloquea el login porque el
OAuth Client ID usado por Angular no acepta el origen actual del navegador.

Verifica en Google Cloud Console:

1. Ir a `APIs & Services` -> `Credentials`.
2. Crear o editar un `OAuth client ID`.
3. El tipo debe ser `Web application`.
4. Copiar el `Client ID`, que termina en:

```txt
.apps.googleusercontent.com
```

5. En `Authorized JavaScript origins`, agregar exactamente:

```txt
http://localhost:4200
http://127.0.0.1:4200
```

No agregues `/admin`, `/inicio`, `/callback` ni barra final. Google espera solo
el origen: protocolo, dominio y puerto.

6. Si la pantalla de consentimiento esta en modo `Testing`, agregar tus correos
en `Test users`.
7. Esperar unos minutos. Google indica que los cambios pueden tardar en aplicar.

Luego configurar el mismo Client ID en:

```ts
// porfolio-web/src/environments/environment.ts
googleClientId: 'TU_CLIENT_ID_WEB.apps.googleusercontent.com',
```

y en:

```env
# backend/.env
GOOGLE_CLIENT_ID=TU_CLIENT_ID_WEB.apps.googleusercontent.com
```

## Deploy recomendado

Firebase Hosting sirve el Angular estatico. El backend Express con Google Sheets
necesita un servidor, asi que se despliega como Cloud Run y se conecta desde
Firebase Hosting.

Flujo:

```txt
Firebase Hosting -> Angular
Cloud Run -> backend Express
Google Sheets -> base de datos editable
```

## 1. Deploy frontend en Firebase Hosting

Desde la raiz del repo:

```bash
cd porfolio-web
npm run build
firebase login
firebase use TU_PROJECT_ID
firebase deploy --only hosting
```

Firebase Hosting publicara en:

```txt
https://TU_PROJECT_ID.web.app
https://TU_PROJECT_ID.firebaseapp.com
```

Agrega esos origins al OAuth Client:

```txt
https://TU_PROJECT_ID.web.app
https://TU_PROJECT_ID.firebaseapp.com
```

## 2. Deploy backend en Cloud Run

Desde la raiz del repo:

Si PowerShell muestra `gcloud : El termino 'gcloud' no se reconoce`, instala
Google Cloud CLI y vuelve a abrir la terminal. En Windows puedes usar:

```powershell
winget install Google.CloudSDK
```

Luego:

```powershell
gcloud init
gcloud config set project TU_PROJECT_ID
```

Tambien puedes usar Google Cloud Shell desde el navegador; Cloud Shell ya trae
`gcloud` instalado.

```bash
cd backend
gcloud run deploy portfolio-api ^
  --source . ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --set-env-vars PORT=8080 ^
  --set-env-vars CORS_ORIGIN=https://TU_PROJECT_ID.web.app,https://TU_PROJECT_ID.firebaseapp.com ^
  --set-env-vars GOOGLE_CLIENT_ID=TU_CLIENT_ID_WEB.apps.googleusercontent.com ^
  --set-env-vars GOOGLE_SHEET_ID=TU_SHEET_ID ^
  --set-env-vars GOOGLE_SERVICE_ACCOUNT_EMAIL=TU_SERVICE_ACCOUNT_EMAIL ^
  --set-env-vars ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

Para `GOOGLE_PRIVATE_KEY`, usa Secret Manager o carga la variable desde el panel
de Cloud Run. No la pegues en un comando si es real.

Cloud Run devolvera una URL parecida a:

```txt
https://portfolio-api-xxxxx-uc.a.run.app
```

## 3. Conectar Angular de produccion

En:

```ts
// porfolio-web/src/environments/environment.prod.ts
apiBaseUrl: 'https://portfolio-api-xxxxx-uc.a.run.app',
googleClientId: 'TU_CLIENT_ID_WEB.apps.googleusercontent.com',
```

Luego:

```bash
cd porfolio-web
npm run build
firebase deploy --only hosting
```

## Checklist final

- OAuth Client ID es Web Application.
- `Authorized JavaScript origins` incluye local y Firebase.
- `GOOGLE_CLIENT_ID` es el mismo en Angular y backend.
- La Google Sheet esta compartida con la service account como Editor.
- `GOOGLE_SHEET_ID` es el ID entre `/d/` y `/edit`.
- `ADMIN_EMAILS` vive solo en backend o Cloud Run.
