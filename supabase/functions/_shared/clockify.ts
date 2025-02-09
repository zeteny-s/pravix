export const clockifyHeaders = {
  'X-Api-Key': Deno.env.get('CLOCKIFY_API_KEY') || '',
  'Content-Type': 'application/json',
};

export const CLOCKIFY_API_BASE = 'https://api.clockify.me/api/v1';

export interface TimeEntry {
  id: string;
  description: string;
  userId: string;
  projectId?: string;
  timeInterval: {
    start: string;
    end?: string;
    duration?: string;
  };
  billable: boolean;
  hourlyRate?: number;
}
