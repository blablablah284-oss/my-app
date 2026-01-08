
export interface JournalEntry {
  date: string; // ISO format YYYY-MM-DD
  content: string;
}

export interface UserState {
  streak: number;
  lastExecutionDate: string | null;
  history: Record<string, JournalEntry>;
}

export enum AppStage {
  INIT = 'INIT',
  BOOT = 'BOOT',
  MAIN = 'MAIN',
  MIRROR = 'MIRROR'
}
