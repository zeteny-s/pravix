import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewConversationDialogProps {
  onSuccess: (userId: string) => void;
}

export const NewConversationDialog = ({ onSuccess }: NewConversationDialogProps) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const { toast } = useToast();

  const handleStartConversation = async () => {
    try {
      setIsStartingConversation(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: recipientData, error: recipientError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", recipientEmail)
        .single();

      if (recipientError || !recipientData) {
        throw new Error("Recipient not found");
      }

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: recipientData.id,
          recipient_email: recipientEmail,
          content: "Started a new conversation",
          status: "sent",
        });

      if (messageError) throw messageError;

      onSuccess(recipientData.id);
      toast({
        title: "Success",
        description: "Conversation started successfully",
      });
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setIsStartingConversation(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Start New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter recipient's email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <Button 
            onClick={handleStartConversation}
            disabled={isStartingConversation || !recipientEmail}
            className="w-full"
          >
            {isStartingConversation && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Start Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
