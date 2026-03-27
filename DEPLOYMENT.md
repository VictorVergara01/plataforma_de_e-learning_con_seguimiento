# 📖 Guía Completa de Implementación — Nexus LMS

Esta guía cubre desde la configuración de servicios de terceros (AWS S3, Stripe, Email) hasta el despliegue en producción.

---

## 📋 Índice

1. [Configuración de AWS S3](#1-aws-s3)
2. [Configuración de Stripe](#2-stripe)
3. [Configuración de Email SMTP](#3-email-smtp)
4. [Variables de Entorno Completas](#4-variables-de-entorno)
5. [Despliegue del Frontend (Vercel)](#5-despliegue-del-frontend-vercel)
6. [Despliegue del Backend (Railway / Render)](#6-despliegue-del-backend)
7. [Despliegue de MongoDB (Atlas)](#7-mongodb-atlas)
8. [DNS y Dominio Personalizado](#8-dominio-personalizado)
9. [Checklist de Producción](#9-checklist-final)

---

## 1. AWS S3

S3 se usa para almacenar videos de lecciones, portadas de cursos, recursos descargables y certificados PDF.

### 1.1 Crear una cuenta AWS
1. Ve a [aws.amazon.com](https://aws.amazon.com) y crea una cuenta gratuita.
2. Ingresa a la **Consola de AWS** (console.aws.amazon.com).

### 1.2 Crear el Bucket de S3
1. En la consola, busca y abre **S3**.
2. Haz clic en **"Create bucket"**.
3. Configura:
   - **Bucket name**: `nexus-elearning` (debe ser único globalmente)
   - **Region**: elige la más cercana a tus usuarios (ej. `us-east-1` para América)
   - **Block all public access**: **desactiva** esta opción para que los archivos sean accesibles públicamente vía URL.
4. Haz clic en **"Create bucket"**.

### 1.3 Configurar CORS (Cross-Origin Resource Sharing)
Necesario para que el navegador del usuario pueda subir archivos directamente al bucket desde el frontend.

1. Dentro del bucket, ve a la pestaña **"Permissions"**.
2. Baja hasta **"Cross-origin resource sharing (CORS)"** y haz clic en **"Edit"**.
3. Pega esta configuración:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://tu-dominio.com"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. Haz clic en **"Save changes"**.

### 1.4 Crear un usuario IAM con permisos mínimos
Nunca uses las credenciales root de AWS en tu aplicación. Crea un usuario IAM dedicado.

1. Ve al servicio **IAM** en la consola.
2. Clic en **"Users"** → **"Create user"**.
3. Nombre: `nexus-lms-s3-user`.
4. En **"Attachments permissions"**, selecciona **"Attach policies directly"**.
5. Haz clic en **"Create policy"** (se abre una nueva ventana).
6. Ve a la pestaña **JSON** y pega:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::nexus-elearning/*"
    }
  ]
}
```

7. Guarda la política con el nombre `NexusLMS-S3-Policy` y adjúntala al usuario.
8. Finaliza la creación del usuario.
9. Ve al usuario recién creado → pestaña **"Security credentials"** → **"Create access key"**.
10. Elige **"Application running outside AWS"** → copia el `Access Key ID` y el `Secret Access Key`. 

> ⚠️ **Guárdalos en un lugar seguro. Solo se muestran una vez.**

### 1.5 Rellenar variables de entorno
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=abc123...
AWS_S3_BUCKET_NAME=nexus-elearning
```

---

## 2. Stripe

Stripe procesa los pagos de matrícula de los estudiantes.

### 2.1 Crear cuenta de Stripe
1. Ve a [stripe.com](https://stripe.com) y regístrate (es gratis).
2. Activa tu cuenta con la información de tu negocio para recibir pagos reales.

### 2.2 Obtener las Claves de API
1. En el dashboard de Stripe, haz clic en **"Developers"** → **"API Keys"**.
2. Verás dos modos:
   - **Test mode**: usa estas claves para desarrollo (tarjetas de prueba, sin dinero real).
   - **Live mode**: para producción con dinero real.
3. Copia las claves correspondientes al modo que quieras usar:
   - `Publishable key` (empieza con `pk_test_` o `pk_live_`)
   - `Secret key` (empieza con `sk_test_` o `sk_live_`)

### 2.3 Configurar el Webhook
El webhook notifica a tu backend cuando un pago se completa, activando la matrícula automática.

#### Para desarrollo local:
1. Instala el [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   # Windows (con Scoop)
   scoop install stripe
   
   # O descarga el ejecutable desde:
   # https://github.com/stripe/stripe-cli/releases
   ```
2. Autentícate:
   ```bash
   stripe login
   ```
3. Reenvía los eventos a tu backend local:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
4. El CLI te mostrará un `whsec_...` — cópialo en tu `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### Para producción:
1. En el dashboard de Stripe → **"Developers"** → **"Webhooks"** → **"Add endpoint"**.
2. URL: `https://tu-backend.com/api/payments/webhook`
3. Eventos a escuchar: `checkout.session.completed`
4. Copia el **"Signing secret"** (`whsec_...`) que aparece en el detalle del webhook.

### 2.4 Tarjetas de prueba (modo test)

| Número | Escenario |
|--------|-----------|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 9995` | Tarjeta declinada |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

- Fecha de expiración: cualquier fecha futura (ej. `12/34`)
- CVV: cualquier 3 dígitos
- Código postal: cualquiera

### 2.5 Rellenar variables de entorno
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 3. Email SMTP

Se usa para enviar correos de bienvenida al matricularse y de certificado al completar un curso.

### Opción A: Gmail (más fácil para empezar)

1. En tu cuenta de Google, ve a **Seguridad** → **Verificación en dos pasos** (actívala si no está activa).
2. Luego ve a **Contraseñas de aplicación** (busca en Google "Google App Passwords").
3. Crea una nueva contraseña de aplicación para "Correo" / "Windows".
4. Copia la contraseña de 16 caracteres generada.

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop   # La contraseña de aplicación de 16 caracteres
```

> ⚠️ Gmail tiene límite de 500 correos/día. Para producción real, usa una alternativa.

### Opción B: Resend (recomendado para producción)

[Resend](https://resend.com) es moderno, tiene 3,000 emails/mes gratis y excelente entregabilidad.

1. Regístrate en [resend.com](https://resend.com).
2. Verifica tu dominio en la sección **"Domains"**.
3. Obtén tu API Key en **"API Keys"**.
4. Instala el SDK:
   ```bash
   cd backend && npm install resend
   ```
5. Actualiza `backend/services/emailService.js` para usar Resend:
   ```js
   const { Resend } = require('resend');
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   const sendEnrollmentEmail = async ({ to, studentName, courseName, courseId }) => {
     await resend.emails.send({
       from: 'Nexus LMS <noreply@tu-dominio.com>',
       to,
       subject: `¡Bienvenido al curso "${courseName}"!`,
       html: `...` // mismo HTML del emailService actual
     });
   };
   ```

### Opción C: SendGrid, Mailgun, etc.
Todos son compatibles con Nodemailer. Solo cambia `EMAIL_HOST` y las credenciales.

---

## 4. Variables de Entorno

### `backend/.env` (Producción)
```env
NODE_ENV=production
PORT=5000

# Base de datos
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nexuslms

# Autenticación JWT
JWT_SECRET=una_cadena_aleatoria_muy_larga_y_segura_aqui

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=nexus-elearning

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@tu-dominio.com
EMAIL_PASS=...

# URL del frontend
FRONTEND_URL=https://tu-dominio.com
```

### `frontend/.env.local` (Producción)
```env
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=otra_cadena_aleatoria_muy_larga_aqui

NEXT_PUBLIC_API_URL=https://tu-backend.com/api
```

> 💡 Genera secretos aleatorios con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 5. Despliegue del Frontend (Vercel)

Vercel es la plataforma oficial para Next.js, con despliegue automático desde GitHub.

### 5.1 Preparar el repositorio
1. Sube tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/nexus-lms.git
   git push -u origin main
   ```
2. Asegúrate de que `.env` y `.env.local` estén en `.gitignore`:
   ```
   # .gitignore
   backend/.env
   frontend/.env.local
   node_modules/
   ```

### 5.2 Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (puedes usar tu cuenta de GitHub).
2. Haz clic en **"Add New Project"**.
3. Importa tu repositorio de GitHub.
4. Configura:
   - **Framework Preset**: `Next.js` (detectado automáticamente)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 5.3 Variables de entorno en Vercel
1. En la configuración del proyecto → **"Environment Variables"**.
2. Agrega cada variable de `frontend/.env.local`:
   - `NEXTAUTH_URL` = `https://tu-proyecto.vercel.app`
   - `NEXTAUTH_SECRET` = (el valor generado)
   - `NEXT_PUBLIC_API_URL` = `https://tu-backend.com/api`

### 5.4 Deploy
1. Haz clic en **"Deploy"**.
2. Cada `git push` a `main` desplegará automáticamente.

---

## 6. Despliegue del Backend

### Opción A: Railway (más fácil — recomendado)

1. Ve a [railway.app](https://railway.app) y conéctate con GitHub.
2. Clic en **"New Project"** → **"Deploy from GitHub repo"**.
3. Selecciona tu repositorio.
4. En la configuración del servicio:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
5. Ve a **"Variables"** y agrega todas las variables de `backend/.env`.
6. Railway te dará una URL pública automáticamente (ej. `nexus-lms-backend.up.railway.app`).

### Opción B: Render (gratis con limitaciones)

1. Ve a [render.com](https://render.com).
2. Crea un **"New Web Service"** → connect tu repositorio.
3. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (tiene cold starts) o Starter ($7/mes)
4. Agrega las variables de entorno en la sección **"Environment"**.

### Opción C: VPS (máximo control)

Si quieres mayor control, usa un VPS de DigitalOcean ($6/mes), Linode o AWS EC2.

```bash
# En el servidor (Ubuntu)
sudo apt update && sudo apt install nodejs npm nginx -y

# Clonar el repositorio
git clone https://github.com/tu-usuario/nexus-lms.git
cd nexus-lms/backend

# Instalar dependencias y configurar el .env
npm install
nano .env  # pega tus variables

# Instalar PM2 para mantener el proceso vivo
sudo npm install -g pm2
pm2 start index.js --name nexus-backend
pm2 startup  # para que arranque automáticamente al reiniciar el servidor
pm2 save
```

**Configurar Nginx como proxy inverso:**
```nginx
server {
    listen 80;
    server_name api.tu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Activar HTTPS con Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.tu-dominio.com
```

---

## 7. MongoDB Atlas

Para producción, usa MongoDB Atlas en lugar de Docker (alta disponibilidad, backups automáticos).

1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta.
2. Crea un **Cluster** gratuito (M0, 512MB).
3. En **"Database Access"** → crea un usuario con contraseña.
4. En **"Network Access"** → para empezar, agrega `0.0.0.0/0` (cualquier IP). Para producción, restringe a las IPs de tu backend.
5. En tu cluster → **"Connect"** → **"Connect your application"** → copia el URI:
   ```
   mongodb+srv://usuario:password@cluster0.abc123.mongodb.net/nexuslms?retryWrites=true&w=majority
   ```
6. Pega ese URI en `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://...
   ```

---

## 8. Dominio Personalizado

### Comprar un dominio
- [Namecheap](https://namecheap.com) — económico
- [Cloudflare Registrar](https://cloudflare.com/registrar) — más económico aún (precio de costo)
- [Porkbun](https://porkbun.com) — muy buenas ofertas

### Conectar el dominio al Frontend (Vercel)
1. En Vercel → Settings → **"Domains"** → agrega `tu-dominio.com`.
2. Vercel te dará registros DNS. Ve al panel de tu dominio y agrega:
   - **A record**: `@` → la IP de Vercel
   - **CNAME**: `www` → `cname.vercel-dns.com`

### Conectar el dominio al Backend
Si usas Railway o Render, puedes agregar un dominio personalizado desde su panel (ej. `api.tu-dominio.com`). Luego solo agrega un CNAME en tu proveedor de DNS.

---

## 9. Checklist Final

Antes de lanzar en producción, verifica:

- [ ] `backend/.env` tiene todas las claves en modo **live** (no test)
- [ ] `STRIPE_SECRET_KEY` empieza con `sk_live_`
- [ ] El webhook de Stripe apunta a la URL de producción
- [ ] La política CORS de S3 incluye tu dominio de producción
- [ ] `NEXTAUTH_URL` apunta a `https://tu-dominio.com` (no localhost)
- [ ] `NEXTAUTH_SECRET` es una cadena aleatoria larga — **nunca el valor de desarrollo**
- [ ] MongoDB Atlas tiene restricción de IPs (solo las IPs de tu backend)
- [ ] HTTPS habilitado en frontend y backend
- [ ] `.env` y `.env.local` están en `.gitignore`
- [ ] Testea el flujo completo: registro → matrícula → video → quiz → certificado
- [ ] Verifica que los correos de bienvenida y certificado llegan correctamente

---

## 🆘 Solución de Problemas Comunes

| Error | Causa | Solución |
|---|---|---|
| `CORS error` en S3 | Falta política CORS en el bucket | Revisar sección 1.3 |
| `No signature found` en Stripe | Webhook sin secret configurado | Revisar `STRIPE_WEBHOOK_SECRET` |
| `Invalid credentials` en login | JWT_SECRET distinto entre sesiones | Usa el mismo valor en producción |
| `MongoServerError: Authentication failed` | URI de Atlas incorrecto | Verifica usuario/contraseña en el URI |
| Email no llega | Contraseña de app Gmail incorrecta | Regenerar en Google Account Security |
| `NEXTAUTH_URL` mismatch | Variable apunta a localhost en producción | Actualizar en Vercel env vars |
