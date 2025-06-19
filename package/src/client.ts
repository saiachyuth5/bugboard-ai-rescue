
import axios from 'axios';
import { BugReport, BugBoardConfig } from './types';

export class BugBoardClient {
  private apiUrl: string;
  private config: BugBoardConfig;

  constructor(config: BugBoardConfig = {}) {
    this.apiUrl = config.apiUrl || 'https://luaarxdiwvuztjfigtfc.supabase.co/functions/v1';
    this.config = {
      autoDetect: {
        enabled: true,
        repeatedOutputThreshold: 3,
        failureThreshold: 3,
        timeoutMs: 30000,
        ...config.autoDetect
      },
      ...config
    };
  }

  async reportBug(bug: BugReport): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const response = await axios.post(`${this.apiUrl}/report-bug`, {
        agent_name: bug.agentName,
        title: bug.title,
        summary: bug.summary,
        input: bug.input,
        error: bug.error,
        logs: bug.logs || [],
        bounty: bug.bounty || 0,
        status: 'open'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        id: response.data.id
      };
    } catch (error) {
      console.error('Failed to report bug to BugBoard:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async reportBugWithBounty(bug: BugReport, bountyInCents: number): Promise<{ success: boolean; id?: string; error?: string }> {
    return this.reportBug({
      ...bug,
      bounty: bountyInCents
    });
  }
}
