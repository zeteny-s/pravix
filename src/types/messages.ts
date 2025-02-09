export interface Message {
  id: string;
  content: string | null;
  sender_id: string | null;
  receiver_id: string | null;
  status: "sent" | "delivered" | "read";
  created_at: string;
  updated_at: string;
  attachments?: {
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    storage_path: string;
  }[];
}
