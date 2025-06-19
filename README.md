
# BugBoard AI

When your AI agent breaks, let the internet fix it.

## Features

### For Human Users
- **Interactive Dashboard**: View and report AI agent bugs with real-time updates
- **Bug Reporting**: Submit detailed bug reports with logs and error messages
- **Bounty System**: Track bounties for bug fixes
- **Status Tracking**: Monitor bug resolution progress

### For Bots & Crawlers
- **JSON API**: `/api/bugs` - Returns recent bugs in JSON format
- **Server-Side Rendered Board**: `/board` - HTML table optimized for crawlers
- **Bot Detection**: Automatic redirect for common bots (GoogleBot, ChatGPT, etc.)

## API Endpoints

### GET /api/bugs
Returns the 20 most recent bugs in JSON format:

```json
[
  {
    "id": "uuid",
    "title": "Agent fails when linking Supabase",
    "status": "open",
    "bounty": 500,
    "createdAt": "2025-06-18T15:00:22Z"
  }
]
```

**Features:**
- CORS enabled for all origins
- Returns data from Supabase bugs table
- Ordered by creation date (newest first)
- Bounty values in cents

### GET /board
Server-side rendered HTML page showing bug reports in a table format.

**Features:**
- No JavaScript required
- SEO-friendly HTML structure
- Responsive design with Tailwind CSS
- Optimized for web crawlers and link unfurlers

## Bot Detection

The application automatically detects common bot user agents and redirects them from `/` to `/board` for optimal crawling:

- GoogleBot
- BingBot  
- ChatGPTBot
- FacebookExternalHit
- TwitterBot
- LinkedInBot
- SlackBot
- DiscordBot
- WhatsApp
- TelegramBot

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Supabase project
4. Deploy Edge Functions
5. Start development server: `npm run dev`

## Testing Crawler Functionality

Test the JSON API:
```bash
curl https://your-project.supabase.co/functions/v1/bugs
```

Test the server-side rendered board:
```bash
curl https://your-project.supabase.co/functions/v1/board
```

Both endpoints should return data without requiring JavaScript execution.
