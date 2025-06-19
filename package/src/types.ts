
export interface BugReport {
  agentName: string;
  title: string;
  summary: string;
  input: string;
  error: string;
  logs?: string[];
  bounty?: number; // in cents
}

export interface BugBoardConfig {
  apiUrl?: string;
  autoDetect?: {
    enabled: boolean;
    repeatedOutputThreshold?: number;
    failureThreshold?: number;
    timeoutMs?: number;
  };
}

export interface ExecutionContext {
  input: string;
  outputs: string[];
  errors: string[];
  startTime: number;
}
