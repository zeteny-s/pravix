import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/tasks";
import { Json } from "@/integrations/supabase/types";
import { TaskForm } from "./TaskForm";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSuccess?: () => void;
}

export function TaskDialog({ open, onOpenChange, task, onSuccess }: TaskDialogProps) {
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        priority_level: data.priority_level,
        deadline: data.deadline?.toISOString(),
        is_task: true,
        status: data.status || 'active',
        involved_parties: data.involved_parties as unknown as Json,
      };

      if (task?.id) {
        const { error } = await supabase
          .from("cases")
          .update(taskData)
          .eq("id", task.id);

        if (error) throw error;
        toast({ description: "Task updated successfully" });
      } else {
        const { error } = await supabase.from("cases").insert(taskData);
        if (error) throw error;
        toast({ description: "Task created successfully" });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        variant: "destructive",
        description: "There was an error saving the task",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <TaskForm onSubmit={onSubmit} defaultValues={task} />
      </DialogContent>
    </Dialog>
  );
}
