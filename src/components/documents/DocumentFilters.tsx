import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderDialog } from "./FolderDialog";

interface DocumentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFolder: string;
  setSelectedFolder: (value: string) => void;
  folders: any[];
}

export const DocumentFilters = ({
  searchTerm,
  setSearchTerm,
  selectedFolder,
  setSelectedFolder,
  folders,
}: DocumentFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Select value={selectedFolder} onValueChange={setSelectedFolder}>
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="All folders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All folders</SelectItem>
          {folders?.map((folder) => (
            <SelectItem key={folder.id} value={folder.id}>
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FolderDialog />
    </div>
  );
};
