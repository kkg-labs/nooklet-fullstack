export type TabType = 'embed' | 'chat';

export interface EmbedFormData {
  content: string;
  user: string;
  date: string; // formatted via shared/utils.ts formatDate
}
export interface EmbedResponse {
  success: boolean;
  chunksProcessed?: number;
  collection?: string;
  error?: string;
  [x: string]: any; // allow any additional fields
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  systemPrompt?: string;
  retrieved?: number;
  error?: string;
}

