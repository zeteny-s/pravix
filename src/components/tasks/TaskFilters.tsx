import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Calendar } from "lucide-react";

interface TaskFiltersProps {
  onFilterChange: (filters: {
    search: string;
    priority: string;
    deadline: string;
    status?: string;
  }) => void;
}

export const TaskFilters = ({ onFilterChange }: TaskFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          onChange={(e) => onFilterChange({ search: e.target.value, priority: '', deadline: '', status: 'all' })}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Select onValueChange={(value) => onFilterChange({ search: '', priority: value, deadline: '', status: 'all' })}>
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ search: '', priority: '', deadline: value, status: 'all' })}>
          <SelectTrigger className="w-[140px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deadlines</SelectItem>
            <SelectItem value="today">Due Today</SelectItem>
            <SelectItem value="week">Due This Week</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
