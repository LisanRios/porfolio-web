# Portfolio Web

Repositorio con frontend Angular y backend Express para administrar el portfolio
desde Google Sheets.

## Carpetas principales

- [Frontend Angular](porfolio-web/README.md)
- [Backend Google Sheets](backend/README.md)

## Documentación central

- [Evolución del portfolio](porfolio-web/docs/portfolio-evolution.md)
- [Setup CRUD con Google Sheets](porfolio-web/docs/google-sheets-crud-setup.md)
- [OAuth y deploy Firebase/Cloud Run](porfolio-web/docs/oauth-and-firebase-deploy.md)
- [Reglas Firestore de ejemplo](porfolio-web/docs/firebase-firestore-rules.example)
- [Plantilla de Google Sheets](backend/scripts/sheets-template.csv.md)

## Desarrollo local

Backend:

```bash
cd backend
npm install
npm run check-env
npm run setup-sheet
npm run dev
```

Frontend:

```bash
cd porfolio-web
npm install
npm start
```

## Producción

1. Desplegar `backend` en Cloud Run.
2. Configurar variables secretas en Cloud Run.
3. Actualizar `environment.prod.ts` con la URL del backend.
4. Desplegar `porfolio-web` en Firebase Hosting.

La guía completa está en
[OAuth y deploy Firebase/Cloud Run](porfolio-web/docs/oauth-and-firebase-deploy.md).
