# Favor App

A campus community platform for students to share academic materials, coordinate rideshares, exchange items, and connect with each other.

## Features

- **Academic Materials**: Share and discover study materials, notes, and resources
- **Rideshare**: Coordinate rides with fellow students
- **Exchange**: Buy, sell, and trade items within the campus community
- **Messaging**: Direct messaging between users
- **Profile Management**: Manage your profile and preferences

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)
- Radix UI Components

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
