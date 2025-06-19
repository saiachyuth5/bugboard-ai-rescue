
export { BugBoardClient } from './client';
export { BugDetector } from './detector';
export * from './types';

// Convenience exports
export const createClient = (config?: import('./types').BugBoardConfig) => new BugBoardClient(config);
export const createDetector = (agentName: string, config?: import('./types').BugBoardConfig) => new BugDetector(agentName, config);
