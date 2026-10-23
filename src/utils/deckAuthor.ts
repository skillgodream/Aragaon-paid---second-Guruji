import { getApiHeaders } from './apiHelper';

export interface CardDraft {
  id: string;
  label: string;
  value: string;
  subtext: string;
  sourceRef: string;
}

export interface AuthorCardResponse {
  title: string;
  body: string;
  cue: string;
  status: 'SUCCESS' | 'UNRESOLVED' | 'FAILURE';
}

export async function authorCard(draft: CardDraft): Promise<AuthorCardResponse> {
  try {
    const response = await fetch('/api/gemini/author-card', {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({ draft }),
    });

    if (!response.ok) {
      return { title: '', body: '', cue: '', status: 'FAILURE' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to author card:', error);
    return { title: '', body: '', cue: '', status: 'FAILURE' };
  }
}
