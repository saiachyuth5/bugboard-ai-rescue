
import { BugBoardClient } from 'bugboard-agent';

interface LovableTask {
  id: string;
  type: string;
  description: string;
  input?: string;
  output?: string;
  error?: string;
  startTime: number;
  endTime?: number;
}

interface LovableTaskNotification {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface PluginConfig {
  enabled: boolean;
  defaultBounty: number;
  retryThreshold: number;
  apiUrl?: string;
}

interface LovableAPI {
  notify: (notification: LovableTaskNotification) => void;
}

export class BugBoardRescuePlugin {
  private client: BugBoardClient;
  private config: PluginConfig;
  private taskRetries: Map<string, number> = new Map();
  private taskLogs: Map<string, string[]> = new Map();
  private taskStartTimes: Map<string, number> = new Map();
  private api?: LovableAPI;

  constructor(config: PluginConfig, api?: LovableAPI) {
    this.config = {
      retryThreshold: 3,
      defaultBounty: 25,
      ...config
    };
    
    this.api = api;
    
    const apiUrl = config.apiUrl || 'https://luaarxdiwvuztjfigtfc.supabase.co/functions/v1';
    this.client = new BugBoardClient({ apiUrl });
    
    console.log('[BugBoard] Plugin initialized with config:', {
      enabled: this.config.enabled,
      defaultBounty: this.config.defaultBounty,
      retryThreshold: this.config.retryThreshold,
      apiUrl
    });
  }

  async onStatus(task: LovableTask, status: 'success' | 'retry' | 'error' | 'timeout'): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    console.log(`[BugBoard] Task ${task.id} status: ${status}`);
    
    try {
      switch (status) {
        case 'success':
          await this.handleSuccess(task);
          break;
        case 'retry':
          await this.handleRetry(task);
          break;
        case 'error':
          await this.handleError(task);
          break;
        case 'timeout':
          await this.handleTimeout(task);
          break;
      }
    } catch (error) {
      console.error('[BugBoard] Error handling task status:', error);
    }
  }

  private async handleSuccess(task: LovableTask): Promise<void> {
    console.log(`[BugBoard] Task ${task.id} completed successfully, clearing tracking data`);
    this.clearTaskData(task.id);
  }

  private async handleRetry(task: LovableTask): Promise<void> {
    const retryCount = (this.taskRetries.get(task.id) || 0) + 1;
    this.taskRetries.set(task.id, retryCount);
    
    // Add retry to logs
    const logs = this.taskLogs.get(task.id) || [];
    logs.push(`Retry ${retryCount}: ${task.description}`);
    this.taskLogs.set(task.id, logs);
    
    console.log(`[BugBoard] Task ${task.id} retry ${retryCount}/${this.config.retryThreshold}`);
    
    if (retryCount >= this.config.retryThreshold) {
      await this.reportBug(task, 'excessive-retries', `Task failed after ${retryCount} retries`);
    }
  }

  private async handleError(task: LovableTask): Promise<void> {
    const logs = this.taskLogs.get(task.id) || [];
    logs.push(`Error: ${task.error || 'Unknown error'}`);
    this.taskLogs.set(task.id, logs);
    
    console.log(`[BugBoard] Task ${task.id} encountered error: ${task.error}`);
    
    await this.reportBug(task, 'task-error', task.error || 'Task encountered an error');
  }

  private async handleTimeout(task: LovableTask): Promise<void> {
    const logs = this.taskLogs.get(task.id) || [];
    logs.push('Task timed out');
    this.taskLogs.set(task.id, logs);
    
    console.log(`[BugBoard] Task ${task.id} timed out`);
    
    await this.reportBug(task, 'task-timeout', 'Task execution timed out');
  }

  private async reportBug(task: LovableTask, bugType: string, errorMessage: string): Promise<void> {
    try {
      const retryCount = this.taskRetries.get(task.id) || 0;
      const logs = this.taskLogs.get(task.id) || [];
      const bountyInCents = this.config.defaultBounty * 100;

      const bugTitle = this.generateBugTitle(bugType, task);
      const bugSummary = this.generateBugSummary(bugType, task, retryCount);

      console.log(`[BugBoard] Reporting bug for task ${task.id}: ${bugTitle}`);

      const result = await this.client.reportBugWithBounty({
        agentName: 'Lovable-AI',
        title: bugTitle,
        summary: bugSummary,
        input: task.input || task.description,
        error: errorMessage,
        logs: [
          `Task ID: ${task.id}`,
          `Task Type: ${task.type}`,
          `Retry Count: ${retryCount}`,
          ...logs
        ]
      }, bountyInCents);

      if (result.success) {
        console.log(`[BugBoard] Bug reported successfully! ID: ${result.id}`);
        
        // Notify user through Lovable interface
        this.notifyUser({
          title: '🐛 Bug Reported',
          message: `AI agent issue reported to BugBoard (ID: ${result.id}) with $${this.config.defaultBounty} bounty`,
          type: 'warning',
          duration: 5000
        });
        
        // Clear tracking data after successful report
        this.clearTaskData(task.id);
      } else {
        console.error(`[BugBoard] Failed to report bug: ${result.error}`);
        
        this.notifyUser({
          title: '❌ Bug Report Failed',
          message: `Failed to report bug to BugBoard: ${result.error}`,
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('[BugBoard] Error reporting bug:', error);
      
      this.notifyUser({
        title: '❌ Bug Report Error',
        message: 'Unexpected error while reporting bug to BugBoard',
        type: 'error',
        duration: 3000
      });
    }
  }

  private generateBugTitle(bugType: string, task: LovableTask): string {
    switch (bugType) {
      case 'excessive-retries':
        return `Lovable AI stuck in retry loop: ${task.type}`;
      case 'task-error':
        return `Lovable AI task failed: ${task.type}`;
      case 'task-timeout':
        return `Lovable AI task timeout: ${task.type}`;
      default:
        return `Lovable AI issue: ${task.type}`;
    }
  }

  private generateBugSummary(bugType: string, task: LovableTask, retryCount: number): string {
    const baseInfo = `Task "${task.description}" failed during Lovable AI execution.`;
    
    switch (bugType) {
      case 'excessive-retries':
        return `${baseInfo} The AI agent attempted the task ${retryCount} times but could not complete it successfully, indicating a potential infinite loop or persistent issue.`;
      case 'task-error':
        return `${baseInfo} The AI agent encountered an unhandled error that prevented task completion.`;
      case 'task-timeout':
        return `${baseInfo} The AI agent exceeded the maximum execution time, suggesting performance issues or infinite loops.`;
      default:
        return `${baseInfo} An unknown issue occurred during AI execution.`;
    }
  }

  private notifyUser(notification: LovableTaskNotification): void {
    if (this.api?.notify) {
      this.api.notify(notification);
    } else {
      // Fallback to console if API not available
      console.log(`[BugBoard] ${notification.title}: ${notification.message}`);
    }
  }

  private clearTaskData(taskId: string): void {
    this.taskRetries.delete(taskId);
    this.taskLogs.delete(taskId);
    this.taskStartTimes.delete(taskId);
  }

  // Plugin lifecycle methods
  public async onTaskStart(task: LovableTask): Promise<void> {
    if (!this.config.enabled) return;
    
    this.taskStartTimes.set(task.id, Date.now());
    this.taskLogs.set(task.id, [`Task started: ${task.description}`]);
    
    console.log(`[BugBoard] Started tracking task ${task.id}: ${task.description}`);
  }

  public async onTaskEnd(task: LovableTask): Promise<void> {
    if (!this.config.enabled) return;
    
    const startTime = this.taskStartTimes.get(task.id);
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`[BugBoard] Task ${task.id} completed in ${duration}ms`);
    }
    
    // Don't clear data here - let success/error handlers manage it
  }
}

// Factory function for creating the plugin
export default function createBugBoardPlugin(config: PluginConfig = {
  enabled: true,
  defaultBounty: 25,
  retryThreshold: 3
}) {
  return (api?: LovableAPI) => {
    console.log('[BugBoard] Creating BugBoard Rescue plugin...');
    return new BugBoardRescuePlugin(config, api);
  };
}

// Named exports for flexibility
export { createBugBoardPlugin };
export type { PluginConfig, LovableTask, LovableTaskNotification };
