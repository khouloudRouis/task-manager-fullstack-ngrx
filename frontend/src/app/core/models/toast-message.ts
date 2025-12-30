import { MessageType } from "./api-response";

export interface ToastMessage {
  message: string;
  type: MessageType;
}