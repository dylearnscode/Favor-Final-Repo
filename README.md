# Favor Hive - Campus Community App (Frontend Demo)

A Next.js application for campus communities to connect, share resources, and help each other.

**This is a frontend-only demo version with mock data for investor presentations.**

## Features

- **Academic Hive**: Browse and share study materials, textbooks, and resources
- **Rideshare**: View available rides and organize group transportation
- **Exchange**: Browse marketplace items within your campus community
- **Messages**: Direct messaging interface (demo mode)

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Mock data for demo purposes

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Demo Mode

This version runs entirely in the browser with no backend dependencies. All data is mocked for demonstration purposes, making it perfect for:

- Investor presentations
- UI/UX demonstrations
- Frontend development and testing
- Quick prototyping

## Project Structure

\`\`\`
app/
├── page.tsx              # Academic Hive (main page)
├── rideshare/           # Rideshare feature
├── messages/            # Messaging interface
├── academic/            # Academic resources
└── exchange/            # Marketplace

lib/
├── mock-data.ts         # Sample data for demo
└── mock-auth.ts         # Mock authentication

components/
├── ui/                  # shadcn/ui components
└── bottom-nav.tsx       # Navigation component
\`\`\`

## Converting to Full-Stack

To convert this to a full-stack application:

1. Set up a Supabase project
2. Add environment variables for Supabase
3. Replace mock data imports with real API calls
4. Implement authentication with Supabase Auth
5. Add database queries and mutations

## License

MIT
