import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareCaseDialogProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  onShare?: (email: string) => Promise<void>;
}

export const ShareCaseDialog = ({ open, onClose, caseId, onShare }: ShareCaseDialogProps) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("read");
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      // First, get the user ID from the profiles table using the email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError) throw new Error('User not found');

      // Create the permission record
      const { error: permissionError } = await supabase
        .from('case_permissions')
        .insert({
          case_id: caseId,
          user_id: profiles.id,
          permission,
          granted_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (permissionError) throw permissionError;

      // Call onShare callback if provided
      if (onShare) {
        await onShare(email);
      }

      toast({
        title: "Success",
        description: "Case shared successfully",
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
          <DialogTitle>Share Case</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="permission">Permission Level</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger>
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={!email || !permission}>
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
