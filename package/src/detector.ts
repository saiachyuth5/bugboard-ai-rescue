
import { BugBoardClient } from './client';
import { ExecutionContext, BugBoardConfig } from './types';

export class BugDetector {
  private client: BugBoardClient;
  private config: BugBoardConfig;
  private context: ExecutionContext | null = null;

  constructor(agentName: string, config: BugBoardConfig = {}) {
    this.client = new BugBoardClient(config);
    this.config = config;
  }

  startExecution(input: string): void {
    this.context = {
      input,
      outputs: [],
      errors: [],
      startTime: Date.now()
    };
  }

  addOutput(output: string): void {
    if (!this.context) return;
    
    this.context.outputs.push(output);
    
    // Check for repeated outputs
    if (this.config.autoDetect?.enabled) {
      this.checkForRepeatedOutput();
    }
  }

  addError(error: string): void {
    if (!this.context) return;
    
    this.context.errors.push(error);
    
    // Check for failure threshold
    if (this.config.autoDetect?.enabled) {
      this.checkForFailureThreshold();
    }
  }

  async endExecution(agentName: string, finalError?: string): Promise<void> {
    if (!this.context) return;

    const executionTime = Date.now() - this.context.startTime;
    
    // Check for timeout
    if (this.config.autoDetect?.enabled && 
        this.config.autoDetect.timeoutMs && 
        executionTime > this.config.autoDetect.timeoutMs) {
      
      await this.reportTimeoutBug(agentName, executionTime);
    }

    // Check for final error
    if (finalError) {
      await this.reportExecutionBug(agentName, finalError);
    }

    this.context = null;
  }

  private checkForRepeatedOutput(): void {
    if (!this.context || !this.config.autoDetect?.repeatedOutputThreshold) return;

    const outputs = this.context.outputs;
    const threshold = this.config.autoDetect.repeatedOutputThreshold;
    
    if (outputs.length >= threshold) {
      const lastOutputs = outputs.slice(-threshold);
      const allSame = lastOutputs.every(output => output === lastOutputs[0]);
      
      if (allSame) {
        this.reportRepeatedOutputBug(lastOutputs[0]);
      }
    }
  }

  private checkForFailureThreshold(): void {
    if (!this.context || !this.config.autoDetect?.failureThreshold) return;

    if (this.context.errors.length >= this.config.autoDetect.failureThreshold) {
      this.reportFailureThresholdBug();
    }
  }

  private async reportRepeatedOutputBug(repeatedOutput: string): Promise<void> {
    if (!this.context) return;

    await this.client.reportBug({
      agentName: 'Auto-detected',
      title: 'Agent stuck in repeated output loop',
      summary: `Agent produced the same output ${this.config.autoDetect?.repeatedOutputThreshold} times in a row`,
      input: this.context.input,
      error: `Repeated output: "${repeatedOutput}"`,
      logs: this.context.outputs.slice(-10) // Last 10 outputs
    });
  }

  private async reportFailureThresholdBug(): Promise<void> {
    if (!this.context) return;

    await this.client.reportBug({
      agentName: 'Auto-detected',
      title: 'Agent exceeded failure threshold',
      summary: `Agent failed ${this.context.errors.length} times during execution`,
      input: this.context.input,
      error: this.context.errors[this.context.errors.length - 1],
      logs: this.context.errors
    });
  }

  private async reportTimeoutBug(agentName: string, executionTime: number): Promise<void> {
    if (!this.context) return;

    await this.client.reportBug({
      agentName,
      title: 'Agent execution timeout',
      summary: `Agent execution exceeded ${this.config.autoDetect?.timeoutMs}ms timeout`,
      input: this.context.input,
      error: `Execution timed out after ${executionTime}ms`,
      logs: this.context.outputs.slice(-10)
    });
  }

  private async reportExecutionBug(agentName: string, error: string): Promise<void> {
    if (!this.context) return;

    await this.client.reportBug({
      agentName,
      title: 'Agent execution failed',
      summary: 'Agent encountered an unhandled error during execution',
      input: this.context.input,
      error,
      logs: [...this.context.outputs, ...this.context.errors]
    });
  }
}
