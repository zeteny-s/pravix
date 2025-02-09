import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Users,
  Calendar,
} from "lucide-react";
import { useState } from "react";

interface CaseFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    deadline: string;
    sortOrder: "asc" | "desc";
  }) => void;
}

export const CaseFilters = ({ onFilterChange }: CaseFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deadline, setDeadline] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = (updates: Partial<{
    search: string;
    status: string;
    deadline: string;
    sortOrder: "asc" | "desc";
  }>) => {
    const newFilters = {
      search,
      status,
      deadline,
      sortOrder,
      ...updates,
    };
    
    setSearch(newFilters.search);
    setStatus(newFilters.status);
    setDeadline(newFilters.deadline);
    setSortOrder(newFilters.sortOrder);
    
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search cases..."
          value={search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select
          value={status}
          onValueChange={(value) => handleFilterChange({ status: value })}
        >
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={deadline}
          onValueChange={(value) => handleFilterChange({ deadline: value })}
        >
          <SelectTrigger className="w-[140px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deadlines</SelectItem>
            <SelectItem value="today">Due Today</SelectItem>
            <SelectItem value="week">Due This Week</SelectItem>
            <SelectItem value="month">Due This Month</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            handleFilterChange({
              sortOrder: sortOrder === "asc" ? "desc" : "asc",
            })
          }
        >
          {sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
