
const { BugBoardRescuePlugin } = require('./dist/index.js');

// Mock Lovable API
const mockAPI = {
  notify: (notification) => {
    console.log(`📢 Notification: ${notification.title} - ${notification.message}`);
  }
};

// Test configuration
const testConfig = {
  enabled: true,
  defaultBounty: 10, // $10 for testing
  retryThreshold: 3,
  apiUrl: 'https://luaarxdiwvuztjfigtfc.supabase.co/functions/v1'
};

// Create plugin instance
const plugin = new BugBoardRescuePlugin(testConfig, mockAPI);

// Helper function to create mock tasks
function createMockTask(id, type, description, input) {
  return {
    id,
    type,
    description,
    input: input || `Test input for ${description}`,
    startTime: Date.now()
  };
}

// Test helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('🧪 Starting BugBoard Plugin Tests...\n');

  // Test 1: Excessive Retries
  console.log('--- Test 1: Excessive Retries ---');
  const retryTask = createMockTask('task-retry-1', 'component-generation', 'Create React component with TypeScript');
  
  await plugin.onTaskStart(retryTask);
  await sleep(100);
  
  // Simulate 3 retries (should trigger bug report)
  for (let i = 0; i < 3; i++) {
    await plugin.onStatus(retryTask, 'retry');
    await sleep(100);
  }
  
  await sleep(2000); // Wait for bug report
  console.log('✅ Retry test completed\n');

  // Test 2: Task Error
  console.log('--- Test 2: Task Error ---');
  const errorTask = createMockTask('task-error-1', 'api-integration', 'Set up API endpoints');
  errorTask.error = 'TypeScript compilation failed: Cannot find module @types/react';
  
  await plugin.onTaskStart(errorTask);
  await sleep(100);
  await plugin.onStatus(errorTask, 'error');
  
  await sleep(2000); // Wait for bug report
  console.log('✅ Error test completed\n');

  // Test 3: Task Timeout
  console.log('--- Test 3: Task Timeout ---');
  const timeoutTask = createMockTask('task-timeout-1', 'database-setup', 'Configure Supabase database');
  
  await plugin.onTaskStart(timeoutTask);
  await sleep(100);
  await plugin.onStatus(timeoutTask, 'timeout');
  
  await sleep(2000); // Wait for bug report
  console.log('✅ Timeout test completed\n');

  // Test 4: Successful Task (should clear tracking)
  console.log('--- Test 4: Successful Task ---');
  const successTask = createMockTask('task-success-1', 'styling', 'Apply Tailwind CSS classes');
  
  await plugin.onTaskStart(successTask);
  await sleep(100);
  await plugin.onStatus(successTask, 'retry'); // One retry
  await sleep(100);
  await plugin.onStatus(successTask, 'success'); // Then success
  
  console.log('✅ Success test completed\n');

  // Test 5: Complex Scenario
  console.log('--- Test 5: Complex Scenario ---');
  const complexTask = createMockTask(
    'task-complex-1', 
    'full-stack-setup', 
    'Create full-stack app with auth, database, and API',
    'Build a complete task management app with user authentication, real-time updates, and file uploads'
  );
  
  await plugin.onTaskStart(complexTask);
  await sleep(100);
  
  // Multiple retries and errors
  await plugin.onStatus(complexTask, 'retry');
  await sleep(100);
  await plugin.onStatus(complexTask, 'retry');
  await sleep(100);
  complexTask.error = 'Failed to initialize Supabase client';
  await plugin.onStatus(complexTask, 'error');
  
  await sleep(2000); // Wait for bug report
  console.log('✅ Complex scenario test completed\n');

  console.log('🎉 All tests completed! Check your BugBoard to see the reported bugs.');
  console.log('Expected bug reports:');
  console.log('1. Excessive retries for React component generation');
  console.log('2. API integration compilation error');
  console.log('3. Database setup timeout');
  console.log('4. Complex full-stack setup error');
  console.log('\nCheck the BugBoard at: https://your-app.lovable.app');
}

// Run the tests
runTests().catch(console.error);
