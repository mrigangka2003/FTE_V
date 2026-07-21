# Ledgerly

Ledgerly is a private transaction workspace that turns messy bank statement text, SMS alerts, email receipts, and copied ledger snippets into structured transaction records.

It provides:

- A polished landing page with light/dark theme support
- Secure registration and login
- JWT-protected transaction APIs
- Organization-aware transaction isolation
- Text extraction with amount, date, description, balance, debit/credit direction, and confidence score
- Cursor-based transaction pagination
- Responsive dashboard with Motion micro-animations
- Sample inputs for common bank statement formats

![Ledgerly dashboard](frontend/public/hero.png)

## Project structure

```text
transactor/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── middlewares/       # JWT authentication middleware
│       ├── routes/            # Auth and transaction routes
│       ├── services/          # Auth and extraction business logic
│       ├── lib/               # Prisma client
│       └── utils/             # Password hashing and JWT helpers
├── frontend/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # UI components
│   ├── services/              # API client services
│   └── public/hero.png        # Dashboard preview image
└── README.md
```

## Technology stack

### Frontend

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion for micro-animations
- Lucide icons

### Backend

- Hono
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing

## Main user flow

1. A user creates an account with an email, password, and organization name.
2. The backend hashes the password and creates an organization plus user record.
3. Login returns a signed JWT containing `userId`, `email`, and `organizationId`.
4. The frontend stores the token and sends it as a Bearer token on protected requests.
5. The user pastes a transaction statement and selects **Parse & Save**.
6. The backend extracts structured fields and saves the row in PostgreSQL.
7. The dashboard refreshes the private transaction list.

## API endpoints

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "minimum-8-characters",
  "organizationName": "Acme Finance"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "minimum-8-characters"
}
```

### Extract and save a transaction

```http
POST /api/transactions/extract
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "text": "Date: 11 Dec 2025\nDescription: STARBUCKS COFFEE MUMBAI\nAmount: -420.00\nBalance after transaction: 18,420.50"
}
```

### List transactions

```http
GET /api/transactions?limit=20&cursor=<transaction-id>
Authorization: Bearer <jwt>
```

The response includes `transactions`, `nextCursor`, and `hasMore`.

## Supported sample text

```text
Date: 11 Dec 2025
Description: STARBUCKS COFFEE MUMBAI
Amount: -420.00
Balance after transaction: 18,420.50
```

```text
Uber Ride * Airport Drop
12/11/2025 → ₹1,250.00 debited
Available Balance → ₹17,170.50
```

```text
txn123 2025-12-10 Amazon.in Order #403-1234567-8901234 ₹2,999.00 Dr Bal 14171.50 Shopping
```

## Database and data isolation

The Prisma schema includes `Organization`, `User`, and `Transaction` relations. Each transaction stores both `userId` and `organizationId`.

Protected transaction queries derive both values from the verified JWT and never accept them from the request body or query string. This means listing and creation are scoped to the authenticated user and organization.

Indexes are present for:

- `userId`
- `organizationId`
- `organizationId + createdAt`
- `userId + date`

## Installation

### Requirements

- Node.js 20+
- PostgreSQL database
- npm

### 1. Install backend dependencies

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

Generate Prisma Client and apply the schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:4000`.

### 2. Install frontend dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

Optional `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start Next.js:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
cd backend
npm run build

cd ../frontend
npm run build
npm run start
```

## Notes

The current backend uses its existing signed JWT authentication middleware. The transaction API is ready for the frontend contract described above. For a full Better Auth deployment, the JWT verification layer can be replaced with Better Auth session verification while keeping the transaction service and organization-scoped Prisma queries unchanged.
