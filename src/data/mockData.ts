
import { Bug } from "../types";

export const mockBugs: Bug[] = [
  {
    id: "1",
    title: "GPT-4 Agent stuck in infinite loop on data processing",
    summary: "Agent repeatedly tries to process malformed JSON data and gets stuck in retry loop. Console shows same error 15+ times.",
    agentName: "DataProcessorGPT",
    input: "Process customer_data.json and extract email addresses",
    logs: [
      "[2024-01-15 10:30:12] Starting data processing task",
      "[2024-01-15 10:30:13] Reading file: customer_data.json", 
      "[2024-01-15 10:30:13] ERROR: JSON.parse() failed - Unexpected token",
      "[2024-01-15 10:30:14] Retrying data processing...",
      "[2024-01-15 10:30:14] ERROR: JSON.parse() failed - Unexpected token",
      "[2024-01-15 10:30:15] Retrying data processing...",
      "[2024-01-15 10:30:15] ERROR: JSON.parse() failed - Unexpected token"
    ],
    error: "SyntaxError: Unexpected token < in JSON at position 0",
    timestamp: "2024-01-15T10:30:12Z",
    status: "open",
    bounty: 25,
    upvotes: 12,
    fixes: [
      {
        id: "fix-1",
        bugId: "1",
        submitterName: "dev_sarah",
        prLink: "https://github.com/example/bugboard-ai/pull/1",
        explanation: "Added JSON validation before parsing and fallback error handling. The issue was malformed HTML being returned instead of JSON.",
        timestamp: "2024-01-15T14:22:30Z",
        verified: false
      }
    ]
  },
  {
    id: "2", 
    title: "Claude Agent timeout on large file uploads",
    summary: "Agent fails to process files larger than 10MB with timeout error after exactly 30 seconds.",
    agentName: "FileAnalyzerClaude",
    input: "Analyze code quality in large_codebase.zip (15MB)",
    logs: [
      "[2024-01-14 16:45:01] Received file upload: large_codebase.zip",
      "[2024-01-14 16:45:02] File size: 15.2MB",
      "[2024-01-14 16:45:02] Starting code analysis...",
      "[2024-01-14 16:45:15] Processing src/ directory...",
      "[2024-01-14 16:45:28] Processing tests/ directory...",
      "[2024-01-14 16:45:32] TIMEOUT: Request exceeded 30 second limit"
    ],
    error: "TimeoutError: Request timeout after 30000ms",
    timestamp: "2024-01-14T16:45:32Z", 
    status: "in-progress",
    bounty: 15,
    upvotes: 8
  },
  {
    id: "3",
    title: "API rate limit causing agent crashes",
    summary: "Agent doesn't handle 429 rate limit responses properly and crashes instead of implementing backoff.",
    agentName: "TwitterBotGPT", 
    input: "Post daily summary tweets for the past week",
    logs: [
      "[2024-01-13 09:00:00] Starting tweet generation...",
      "[2024-01-13 09:00:15] Generated tweet 1/7",
      "[2024-01-13 09:00:16] Posted tweet successfully",
      "[2024-01-13 09:00:17] Generated tweet 2/7", 
      "[2024-01-13 09:00:18] API Error: Rate limit exceeded",
      "[2024-01-13 09:00:18] FATAL: Unhandled error, shutting down"
    ],
    error: "Error: Rate limit exceeded (429) - Too Many Requests",
    timestamp: "2024-01-13T09:00:18Z",
    status: "resolved",
    bounty: 10,
    upvotes: 15
  },
  {
    id: "4",
    title: "Memory leak in conversation tracking",
    summary: "Long-running chat agent accumulates memory and eventually crashes after processing ~1000 messages.",
    agentName: "ChatSupportAI",
    input: "Handle customer support conversations continuously", 
    logs: [
      "[2024-01-12 08:00:00] Chat agent started",
      "[2024-01-12 10:30:45] Memory usage: 512MB",
      "[2024-01-12 13:15:22] Memory usage: 1.2GB", 
      "[2024-01-12 15:45:10] Memory usage: 2.8GB",
      "[2024-01-12 16:22:33] WARNING: High memory usage detected",
      "[2024-01-12 16:45:01] FATAL: Out of memory error"
    ],
    error: "Error: JavaScript heap out of memory",
    timestamp: "2024-01-12T16:45:01Z",
    status: "open", 
    bounty: 35,
    upvotes: 22
  }
];
