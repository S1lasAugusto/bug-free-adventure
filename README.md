# 🚀 Bug Free Adventure - Adaptive Learning Platform

A modern learning platform built with Next.js, tRPC, Prisma, and external API integration for Java programming exercise tracking.

## 🎯 Overview

**Bug Free Adventure** is a personalized learning platform for Java programming students. The system integrates with the external Adapt/Protus API to sync exercise progress and provides interactive dashboards for learning analytics.

### Key Features

- **Custom JWT Authentication** (migrated from NextAuth)
- **External API Integration** for exercise tracking
- **Interactive Dashboard** with progress charts
- **Personalized Onboarding** flow
- **Todo Management** system
- **Metacognitive Reflection System** (Regula)
- **Leaderboard** for gamification

## 🛠 Tech Stack

- **Frontend**: Next.js 12, TypeScript, TailwindCSS, Chart.js
- **Backend**: tRPC, Prisma ORM, PostgreSQL, JWT
- **Deploy**: Vercel + Supabase
- **External API**: Adapt/Protus Learning Analytics

## 📁 Project Structure

```
bug-free-adventure/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Initial data population
├── src/
│   ├── components/           # React components
│   │   ├── regula/          # Metacognitive system
│   │   └── auth/            # Authentication components
│   ├── contexts/
│   │   └── AuthContext.tsx  # JWT authentication context
│   ├── pages/               # Next.js pages
│   │   ├── api/trpc/        # tRPC API routes
│   │   ├── auth/            # Auth pages (login/register)
│   │   ├── courses/         # Course modules
│   │   └── onboarding/      # User onboarding
│   ├── server/
│   │   ├── api/routers/     # tRPC routers
│   │   └── schema/          # Zod validation schemas
│   └── utils/               # Utilities and API client
```

## 🗄️ Supabase Database Setup

### 1. Initial Supabase Configuration

```bash
# 1. Create project at https://supabase.com
# 2. Get connection strings from Settings > Database
# 3. Add to .env file:

DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
```

### 2. Database Schema Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase (creates all tables)
npx prisma db push

# Populate with initial data (Java course + 850+ activities)
npm run db:seed
```

### 3. Database Tables Created

The `prisma db push` command creates these tables:

- **User** - User accounts and preferences
- **ExerciseHistory** - Activity tracking (visitedAt, completedAt, attempts)
- **ActivityResource** - Course exercises (Examples, Challenges, Coding)
- **Module** - Course modules (arrays, loops, conditionals, etc.)
- **Course** - Course structure
- **ToDo** - User task management
- **SubPlan/GeneralPlan** - Study planning
- **Reflection** - Metacognitive reflections

## ⚙️ Environment Variables

```env
# Supabase Database
DATABASE_URL="your-pooled-connection-string"
DIRECT_URL="your-direct-connection-string"

# JWT Authentication
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/S1lasAugusto/bug-free-adventure.git
cd bug-free-adventure
npm install

# Setup database
npx prisma db push
npm run db:seed

# Run development server
npm run dev
```

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy automatically

## 🔌 External API Integration

Integrates with Adapt/Protus API for progress tracking:

```typescript
// API endpoint
const API_URL = "http://adapt2.sis.pitt.edu/aggregate2/GetContentLevels";

// Syncs user progress data
// Maps to Examples, Challenges, Coding categories
// Tracks visitedAt, completedAt, attempts
```

## 📊 Key Commands Used

```bash
# Database setup
npx prisma generate        # Generate client
npx prisma db push         # Create tables in Supabase
npm run db:seed           # Populate initial data
npx prisma studio         # View data

# Development
npm run dev               # Start dev server
npm run build             # Build for production

# Database management
npx prisma migrate dev    # Create new migration
npx prisma db pull        # Pull schema from database
```

---

**Built with T3 Stack** - Next.js, TypeScript, tRPC, Prisma, TailwindCSS
