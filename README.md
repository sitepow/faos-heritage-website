# FAOS

Modern full-stack e-commerce platform built with Next.js, Prisma, and TailwindCSS.
Designed for scalable online stores, secure payments, and production-ready deployments.

## Features

- Next.js 16 (App Router)
- Prisma ORM
- Authentication (NextAuth)
- Payment integration (Stripe, Omise)
- Email system (Resend)
- TailwindCSS UI
- Internationalization support
- Production-ready architecture

## Project Structure

```
zentracore/
├─ app/            # Next.js routes
├─ components/     # UI components
├─ lib/            # Utilities & helpers
├─ prisma/         # Database schema & seed
├─ scripts/        # Custom scripts
├─ public/         # Static files
├─ package.json
└─ README.md
```

## Requirements

- Node.js 20+
- PostgreSQL
- npm

## Installation

```sh
git clone <repo-url>
cd zentracore
npm install
```

Create environment file:

```sh
cp .env.example .env
```

Setup database:

```sh
npx prisma migrate dev
npx prisma db seed
```

## Development

Start dev server:

```sh
npm run dev
```

Open:

```
http://localhost:3000
```

## Production Build

```sh
npm run build
npm run start
```

## Useful Commands

Cleanup orders:

```sh
npm run order:cleanup
```

Lint:

```sh
npm run lint
```

Format:

```sh
npm run format
```

## Tech Stack

- Next.js
- Prisma
- TailwindCSS
- NextAuth
- Stripe / Omise
- Resend
- React Query
- Zustand
