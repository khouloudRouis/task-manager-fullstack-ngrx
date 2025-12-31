export interface ApiResponse<T> {
  data: T;
  message: string;
  errors?: string;
  type: MessageType;
} 
export type MessageType = 'SUCCESS' | 'ERROR' | 'INFO';
