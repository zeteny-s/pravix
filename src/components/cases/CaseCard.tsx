import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Draggable } from "@hello-pangea/dnd";
import { Briefcase, Calendar, Share2, Users, CheckSquare } from "lucide-react";
import { useState } from "react";
import { ShareCaseDialog } from "./ShareCaseDialog";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface CaseCardProps {
  caseItem: any;
  index: number;
  onUpdate?: () => void;
}

export const CaseCard = ({ caseItem, index, onUpdate }: CaseCardProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleDeadlineChange = async (date: Date | undefined) => {
    if (!date) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({ deadline: date.toISOString() })
        .eq('id', caseItem.id);

      if (error) throw error;

      // Send notification about deadline update
      await supabase.functions.invoke('case-notifications', {
        body: {
          recipientEmail: caseItem.user_email,
          caseTitle: caseItem.title,
          notificationType: 'deadline',
          deadline: format(date, 'PPp')
        }
      });

      toast({
        title: "Deadline updated",
        description: "The case deadline has been updated successfully."
      });
      
      onUpdate?.();
    } catch (error) {
      console.error('Error updating deadline:', error);
      toast({
        title: "Error",
        description: "Failed to update the deadline",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleTaskStatus = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({ is_task: !caseItem.is_task })
        .eq('id', caseItem.id);

      if (error) throw error;

      // Send notification about status update
      await supabase.functions.invoke('case-notifications', {
        body: {
          recipientEmail: caseItem.user_email,
          caseTitle: caseItem.title,
          notificationType: 'update'
        }
      });

      toast({
        title: caseItem.is_task ? "Converted to case" : "Converted to task",
        description: `Successfully ${caseItem.is_task ? 'converted to case' : 'converted to task'}`
      });
      
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Draggable draggableId={caseItem.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className={cn("mb-4", caseItem.is_task && "border-primary")}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(caseItem.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTaskStatus}
                  disabled={isUpdating}
                  className={cn(caseItem.is_task && "text-primary")}
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarPicker
                      mode="single"
                      selected={caseItem.deadline ? new Date(caseItem.deadline) : undefined}
                      onSelect={handleDeadlineChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {caseItem.deadline && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(new Date(caseItem.deadline), 'PPp')}
                  </div>
                )}
                {caseItem.involved_parties && (
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {caseItem.involved_parties.length} parties
                  </div>
                )}
              </div>
              {caseItem.description && (
                <p className="mt-2 text-sm">{caseItem.description}</p>
              )}
            </CardContent>
          </Card>

          <ShareCaseDialog
            open={shareDialogOpen}
            onClose={() => setShareDialogOpen(false)}
            caseId={caseItem.id}
            onShare={async (email) => {
              try {
                await supabase.functions.invoke('case-notifications', {
                  body: {
                    recipientEmail: email,
                    caseTitle: caseItem.title,
                    notificationType: 'share'
                  }
                });
              } catch (error) {
                console.error('Error sending share notification:', error);
              }
            }}
          />
        </div>
      )}
    </Draggable>
  );
};
