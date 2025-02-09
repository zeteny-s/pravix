import { Message } from "@/types/messages";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col ${
            message.sender_id === currentUserId
              ? "items-end"
              : "items-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-4 ${
              message.sender_id === currentUserId
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            {message.attachments?.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center mt-2 text-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>{attachment.file_name}</span>
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {format(new Date(message.created_at), "MMM d, h:mm a")}
          </span>
        </div>
      ))}
    </div>
  );
};
