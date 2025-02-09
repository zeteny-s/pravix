import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { UserList } from "./UserList";
import { Loader2 } from "lucide-react";
import { NewConversationDialog } from "./NewConversationDialog";
import { useToast } from "@/components/ui/use-toast";

export const MessagingInterface = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return [];
      
      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:sender_id(*), receiver:receiver_id(*), attachments:message_attachments(*)")
        .or(`sender_id.eq.${selectedUserId},receiver_id.eq.${selectedUserId}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedUserId,
  });

  const handleNewMessage = async (content: string, file?: File) => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a recipient first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          content,
          sender_id: user.id,
          receiver_id: selectedUserId,
          status: "sent",
        })
        .select()
        .single();

      if (messageError) throw messageError;

      if (file && messageData) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("messageId", messageData.id);

        const { error: attachmentError } = await supabase.functions.invoke("message-attachments", {
          body: formData,
        });

        if (attachmentError) {
          throw new Error(attachmentError.message);
        }
      }

      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-background border rounded-lg">
      <div className="flex flex-1 overflow-hidden">
        <UserList onSelectUser={setSelectedUserId} selectedUserId={selectedUserId} />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : messages ? (
              <MessageList messages={messages} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-muted-foreground">No messages yet</p>
                <NewConversationDialog onSuccess={setSelectedUserId} />
              </div>
            )}
          </div>
          <MessageInput onSendMessage={handleNewMessage} />
        </div>
      </div>
    </div>
  );
};
