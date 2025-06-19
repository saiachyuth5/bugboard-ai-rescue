
// Auto-detection example
const { BugDetector } = require('bugboard-agent');

async function agentExecution() {
  const detector = new BugDetector('AutoBot', {
    autoDetect: {
      enabled: true,
      repeatedOutputThreshold: 3,
      failureThreshold: 3,
      timeoutMs: 30000
    }
  });

  // Start tracking
  detector.startExecution('Create a login form with validation');

  try {
    // Simulate agent work
    detector.addOutput('Creating form structure...');
    detector.addOutput('Adding validation rules...');
    detector.addError('Validation library not found');
    detector.addOutput('Retrying with different library...');
    
    // Simulate repeated output (would trigger auto-report)
    detector.addOutput('Still working...');
    detector.addOutput('Still working...');
    detector.addOutput('Still working...');
    
  } catch (error) {
    // End with error (would trigger auto-report)
    await detector.endExecution('AutoBot', error.message);
  }
}

agentExecution();
