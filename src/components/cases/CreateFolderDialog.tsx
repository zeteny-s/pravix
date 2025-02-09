import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  parentFolderId?: string;
}

export const CreateFolderDialog = ({ open, onClose, parentFolderId }: CreateFolderDialogProps) => {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const session = useSession();

  const handleCreate = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create folders",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('case_folders')
        .insert({
          name,
          parent_folder_id: parentFolderId || null,
          user_id: session.user.id, // Add the user_id here
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
