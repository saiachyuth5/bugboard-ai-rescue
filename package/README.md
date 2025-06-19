
# BugBoard Agent

Auto-report AI agent bugs to the BugBoard AI platform.

## Installation

```bash
npm install bugboard-agent
```

## Quick Start

### Manual Bug Reporting

```javascript
import { BugBoardClient } from 'bugboard-agent';

const client = new BugBoardClient();

// Report a bug
await client.reportBug({
  agentName: 'MyAI',
  title: 'Failed to process user input',
  summary: 'Agent crashed when trying to parse JSON',
  input: 'Please parse this JSON: {invalid}',
  error: 'SyntaxError: Unexpected token',
  logs: ['Starting JSON parse...', 'Error encountered'],
  bounty: 5000 // 50 USD in cents
});
```

### Auto-Detection (Recommended)

```javascript
import { BugDetector } from 'bugboard-agent';

const detector = new BugDetector('MyAI', {
  autoDetect: {
    enabled: true,
    repeatedOutputThreshold: 3,
    failureThreshold: 3,
    timeoutMs: 30000
  }
});

// Start execution tracking
detector.startExecution('User input here');

// Track outputs and errors
detector.addOutput('Processing...');
detector.addError('Minor error occurred');

// End execution (will auto-report if issues detected)
await detector.endExecution('MyAI', finalError);
```

### With Bounties

```javascript
// Report with bounty
await client.reportBugWithBounty({
  agentName: 'MyAI',
  title: 'Critical database connection issue',
  summary: 'Cannot connect to production database',
  input: 'Connect to prod DB',
  error: 'Connection timeout'
}, 10000); // 100 USD bounty
```

## Configuration

```javascript
const config = {
  apiUrl: 'https://your-bugboard-instance.com/api', // Optional
  autoDetect: {
    enabled: true,
    repeatedOutputThreshold: 3,  // Report if same output repeats 3 times
    failureThreshold: 3,         // Report if 3 errors occur
    timeoutMs: 30000            // Report if execution exceeds 30 seconds
  }
};
```

## Auto-Detection Features

The package automatically detects and reports:

- **Repeated Output**: Same output repeated multiple times (infinite loops)
- **Failure Threshold**: Too many errors in a single execution
- **Timeouts**: Execution taking longer than expected
- **Unhandled Exceptions**: Final errors that crash the agent

## API Reference

### BugBoardClient

- `reportBug(bug: BugReport)`: Report a bug manually
- `reportBugWithBounty(bug: BugReport, bountyInCents: number)`: Report with bounty

### BugDetector

- `startExecution(input: string)`: Begin tracking an execution
- `addOutput(output: string)`: Track agent output
- `addError(error: string)`: Track errors
- `endExecution(agentName: string, finalError?: string)`: End tracking

## Contributing

Visit [BugBoard AI](https://bugboard.ai) to see reported bugs and contribute fixes.
