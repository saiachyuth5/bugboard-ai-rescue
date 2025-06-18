
export interface Bug {
  id: string;
  title: string;
  summary: string;
  agentName: string;
  input: string;
  logs: string[];
  error: string;
  timestamp: string;
  status: 'open' | 'in-progress' | 'resolved';
  bounty: number;
  upvotes: number;
  fixes?: Fix[];
}

export interface Fix {
  id: string;
  bugId: string;
  submitterName: string;
  prLink: string;
  explanation: string;
  timestamp: string;
  verified: boolean;
}
