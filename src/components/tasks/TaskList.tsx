import { format } from "date-fns";
import { Task } from "@/types/tasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  filter: "all" | "active" | "completed";
}

export function TaskList({ tasks, onEdit, onDelete, filter }: TaskListProps) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredTasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
            <Badge className={getPriorityColor(task.priority_level)}>
              {task.priority_level}
            </Badge>
          </CardHeader>
          <CardContent>
            <CardDescription className="mt-2">
              {task.description}
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                Due: {task.deadline ? format(new Date(task.deadline), "PPp") : "No deadline"}
              </div>
              {task.status === "completed" && (
                <div className="text-sm text-muted-foreground">
                  Completed on: {task.updated_at ? format(new Date(task.updated_at), "PPp") : "Unknown"}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(task)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(task)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
