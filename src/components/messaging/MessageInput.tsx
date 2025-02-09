import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      await onSendMessage(message, file);
      setMessage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-4">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > 10 * 1024 * 1024) {
              toast({
                title: "Error",
                description: "File size must be less than 10MB",
                variant: "destructive",
              });
              e.target.value = "";
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[2.5rem] max-h-32"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" disabled={isSubmitting || !message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
