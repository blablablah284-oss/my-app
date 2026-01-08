/**
 * API Service Module
 * Handles all communication with the backend for user state, commitments, and journal entries
 * Created: 2026-01-08 16:20:53 UTC
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface UserState {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Commitment {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch the current user's state from the backend
 * @returns Promise with user state data
 */
export async function getUserState(): Promise<UserState> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/state`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user state: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user state:', error);
    throw error;
  }
}

/**
 * Execute a commitment action on the backend
 * @param commitmentId - The ID of the commitment to execute
 * @param action - The action to perform (e.g., 'complete', 'archive', 'update')
 * @param payload - Optional additional data for the action
 * @returns Promise with updated commitment data
 */
export async function executeCommitment(
  commitmentId: string,
  action: string,
  payload?: Record<string, any>
): Promise<Commitment> {
  try {
    const response = await fetch(`${API_BASE_URL}/commitments/${commitmentId}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(payload || {}),
    });

    if (!response.ok) {
      throw new Error(`Failed to execute commitment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error executing commitment action "${action}":`, error);
    throw error;
  }
}

/**
 * Save a new journal entry to the backend
 * @param content - The journal entry content
 * @param mood - Optional mood indicator
 * @param tags - Optional array of tags
 * @returns Promise with the created journal entry
 */
export async function saveJournalEntry(
  content: string,
  mood?: string,
  tags?: string[]
): Promise<JournalEntry> {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('Journal entry content cannot be empty');
    }

    const response = await fetch(`${API_BASE_URL}/journal/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        content: content.trim(),
        mood,
        tags,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save journal entry: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
}

/**
 * Retrieve journal entries from the backend
 * @param limit - Maximum number of entries to retrieve (default: 20)
 * @param offset - Number of entries to skip for pagination (default: 0)
 * @param tags - Optional array of tags to filter by
 * @returns Promise with array of journal entries
 */
export async function getJournalEntries(
  limit: number = 20,
  offset: number = 0,
  tags?: string[]
): Promise<JournalEntry[]> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }

    const response = await fetch(`${API_BASE_URL}/journal/entries?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch journal entries: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
}

/**
 * Helper function to retrieve the authentication token from storage
 * @returns The auth token string or empty string if not found
 */
function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || '';
  }
  return '';
}
