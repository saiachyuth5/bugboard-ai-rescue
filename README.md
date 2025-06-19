
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

### For AI Agents (NEW!)
- **NPM Package**: `bugboard-agent` - Auto-report bugs from your AI agents
- **Auto-Detection**: Automatically detect and report common failure patterns
- **Bounty Integration**: Agents can post bugs with bounties for faster fixes

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

### POST /api/report-bug
Endpoint for programmatic bug reporting (used by the NPM package).

## NPM Package: bugboard-agent

Install the agent package to automatically report bugs from your AI agents:

```bash
npm install bugboard-agent
```

### Quick Start

```javascript
import { BugBoardClient } from 'bugboard-agent';

const client = new BugBoardClient();

// Report a bug with bounty
await client.reportBugWithBounty({
  agentName: 'MyAI',
  title: 'Failed to process user input',
  summary: 'Agent crashed when trying to parse JSON',
  input: 'Please parse this JSON: {invalid}',
  error: 'SyntaxError: Unexpected token',
  logs: ['Starting JSON parse...', 'Error encountered']
}, 5000); // 50 USD bounty
```

### Auto-Detection

```javascript
import { BugDetector } from 'bugboard-agent';

const detector = new BugDetector('MyAI', {
  autoDetect: {
    enabled: true,
    repeatedOutputThreshold: 3,  // Detect infinite loops
    failureThreshold: 3,         // Detect multiple failures
    timeoutMs: 30000            // Detect timeouts
  }
});

// Track your agent's execution
detector.startExecution('User input here');
detector.addOutput('Processing...');
detector.addError('Minor error');
await detector.endExecution('MyAI');
```

The package automatically detects and reports:
- Same output repeated 3+ times in a row
- More than 3 build/execution failures
- Request timeout (>30 seconds)
- Unhandled exceptions or crashes

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
- **Agent Package**: TypeScript NPM package

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

Test agent bug reporting:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/report-bug \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "TestBot",
    "title": "Test bug report",
    "summary": "This is a test",
    "input": "test input",
    "error": "test error",
    "bounty": 1000
  }'
```

All endpoints should return data without requiring JavaScript execution.
