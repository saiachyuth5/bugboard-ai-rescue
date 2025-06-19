
// Basic usage example
const { BugBoardClient } = require('bugboard-agent');

async function example() {
  const client = new BugBoardClient();

  // Manual bug report
  const result = await client.reportBug({
    agentName: 'ExampleBot',
    title: 'Failed to process user request',
    summary: 'Bot encountered an error while processing the user input',
    input: 'Please create a dashboard with charts',
    error: 'TypeError: Cannot read property "map" of undefined',
    logs: [
      'Starting dashboard creation...',
      'Fetching data from API...',
      'Error: Data is undefined'
    ],
    bounty: 2500 // 25 USD
  });

  if (result.success) {
    console.log('Bug reported successfully! ID:', result.id);
  } else {
    console.error('Failed to report bug:', result.error);
  }
}

example();
