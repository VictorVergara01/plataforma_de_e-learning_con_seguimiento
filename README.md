# Nexus LMS — E-Learning Platform

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, NextAuth.js
- **Backend**: Node.js + Express, MongoDB + Mongoose
- **Cloud**: AWS S3 (videos y certificados PDF)
- **Pagos**: Stripe (Checkout + Webhooks)
- **Email**: Nodemailer (SMTP)

## Project Structure
```
├── backend/
│   ├── config/db.js              # Conexión MongoDB
│   ├── models/
│   │   ├── User.js               # Schema de usuarios (3 roles)
│   │   ├── Course.js             # Schema de cursos, módulos, quizzes
│   │   ├── Enrollment.js         # Matrícula y tracking de progreso
│   │   └── Certificate.js        # Certificados emitidos
│   ├── routes/
│   │   ├── auth.js               # Login / Register (JWT)
│   │   ├── upload.js             # Pre-signed URLs para S3
│   │   └── payments.js           # Stripe Checkout + Webhooks
│   ├── services/
│   │   ├── emailService.js       # Correos de matrícula y certificado
│   │   └── certificateService.js # Generación de PDF y upload a S3
│   ├── .env                      # Variables de entorno (**completar**)
│   └── index.js                  # Entry point de Express
│
├── frontend/
│   └── src/app/
│       ├── api/auth/[...nextauth]/route.ts  # NextAuth con JWT
│       ├── login/page.tsx                    # Login premium
│       ├── courses/
│       │   ├── page.tsx                      # Catálogo con filtros
│       │   ├── [courseId]/page.tsx           # Detalle + Stripe checkout
│       │   └── [courseId]/lessons/[lessonId]/page.tsx  # Reproductor + Quiz + Notas
│       ├── instructor/
│       │   ├── layout.tsx                    # Dashboard protegido por rol
│       │   ├── page.tsx                      # Home instructor (métricas)
│       │   ├── courses/page.tsx              # Lista de cursos
│       │   ├── courses/new/page.tsx          # Crear nuevo curso
│       │   └── uploads/page.tsx              # Subida de videos a S3
│       └── admin/page.tsx                   # Panel administrador (KPIs)
│
└── docker-compose.yml            # MongoDB en Docker
```

## Quick Start

### 1. Levantar MongoDB
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
# Edita el archivo .env con tus credenciales de AWS, Stripe y Email
npm start
# ó para desarrollo:
npx nodemon index.js
```

### 3. Frontend
```bash
cd frontend
# Edita .env.local si es necesario
npm run dev
```

### 4. URLs
| Servicio      | URL                         |
|---------------|-----------------------------|
| Frontend      | http://localhost:3000        |
| Backend API   | http://localhost:5000/api    |
| MongoDB       | mongodb://localhost:27017    |

## Variables de Entorno Requeridas

### `backend/.env`
| Variable | Descripción |
|---|---|
| `MONGO_URI` | URI de MongoDB |
| `JWT_SECRET` | Clave secreta para tokens JWT |
| `AWS_ACCESS_KEY_ID` | Clave IAM de AWS |
| `AWS_SECRET_ACCESS_KEY` | Secreto IAM de AWS |
| `AWS_S3_BUCKET_NAME` | Nombre del bucket de S3 |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook Stripe (`stripe listen --forward-to ...`) |
| `EMAIL_USER` | Email SMTP remitente |
| `EMAIL_PASS` | Password de aplicación SMTP |

### `frontend/.env.local`
| Variable | Descripción |
|---|---|
| `NEXTAUTH_SECRET` | Clave aleatoria para NextAuth |
| `NEXTAUTH_URL` | URL base del frontend |

## Testing Stripe Webhooks Localmente
```bash
# Instala el CLI de Stripe
stripe listen --forward-to localhost:5000/api/payments/webhook
```
Usa la tarjeta de prueba: `4242 4242 4242 4242` con cualquier fecha/CVV futuros.
