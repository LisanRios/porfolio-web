# Evolucion segura del portfolio

## Estado implementado

- Base HTML mas semantica: `header`, `nav`, `main`, `footer`, enlaces validos y textos alternativos.
- SEO tecnico inicial: metadatos, Open Graph, canonical, idioma `es` y titulos por ruta.
- Carga de datos optimizada: `PorfolioService` cachea `assets/data/data.json` con `shareReplay`.
- Configuracion central: `environment.ts` define `apiBaseUrl`, `googleClientId` y ruta del CV.
- Panel `/admin`: integra Google Identity Services cuando se configura un Web Client ID.
- Contrato inicial para API administrativa: el frontend ya envia el ID token de Google como `Authorization: Bearer`.

## Seguridad requerida antes de habilitar CRUD real

La validacion de correos en Angular solo sirve para ocultar la UI. Las escrituras deben protegerse en backend porque cualquier usuario puede modificar codigo cliente desde el navegador.

El backend debe:

1. Recibir el ID token emitido por Google Identity Services.
2. Verificar firma, `aud`, `iss`, vencimiento y `email_verified`.
3. Aceptar solo los correos configurados en la allowlist.
4. Ejecutar CRUD contra la fuente de datos usando credenciales guardadas como variables de entorno.
5. Registrar auditoria minima: usuario, accion, entidad y fecha.

Google recomienda enviar el ID token al backend y validarlo alli antes de confiar en la identidad del usuario.

Referencias oficiales:

- https://developers.google.com/identity/gsi/web/guides/display-button
- https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- https://developers.google.com/identity/sign-in/web/backend-auth

## Contrato de API propuesto

Base configurable: `environment.apiBaseUrl`.

Todos los endpoints administrativos deben exigir:

```http
Authorization: Bearer <google_id_token>
```

Endpoints:

```http
GET /portfolio
PUT /portfolio
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
GET /cv
```

`GET /portfolio` puede alimentar el portfolio publico cuando la API este lista. Mientras tanto, el sitio mantiene fallback a `assets/data/data.json`.

## Persistencia recomendada

Opcion A, Firebase/Firestore:

- Lectura publica para el documento publicado del portfolio.
- Escritura solo para usuarios autenticados con email verificado y allowlist.
- Reglas de seguridad en Firebase, sin secretos en Angular.

Opcion B, Google Sheets API con backend:

- La cuenta de servicio y el ID de planilla viven solo en el servidor.
- El backend normaliza los datos antes de responder al frontend.
- Conveniente si se quiere editar contenido desde una hoja sin panel complejo.

## Generador de CV ATS

El endpoint `GET /cv` debe generar un PDF sobrio desde la misma fuente de datos:

- Texto real, no imagenes de texto.
- Una columna principal.
- Encabezados simples: Perfil, Experiencia, Proyectos, Educacion, Tecnologias.
- Fechas consistentes y logros con verbos de accion.
- Sin tablas complejas, iconos decorativos ni barras de nivel.
- Nombre de archivo estable: `Lisandro-Gabriel-Rios-De-Morla-CV.pdf`.

## Variables pendientes

```ts
apiBaseUrl: 'https://tu-api.example.com'
googleClientId: 'TU_CLIENT_ID.apps.googleusercontent.com'
```

La allowlist de administradores no debe vivir en Angular. Configurala solo en las variables de entorno del backend.
