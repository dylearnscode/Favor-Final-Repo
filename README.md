# Favor - Campus Community App

A Next.js application for campus communities to connect, share resources, and help each other.

## Features

- **Academic**: Share and access study materials, textbooks, and resources
- **Rideshare**: Organize group rides and split costs
- **Exchange**: Buy and sell items within your campus community
- **Messages**: Direct messaging between users
- **Authentication**: Secure user accounts with Supabase

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (Database & Auth)
- shadcn/ui components

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## Database Setup

Run the SQL scripts in the `scripts/` folder to set up your Supabase database tables.
