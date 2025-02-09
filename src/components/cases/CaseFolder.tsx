import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, ChevronRight, ChevronDown } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";

interface CaseFolderProps {
  folder: any;
  level?: number;
  onCreateSubfolder?: (parentId: string) => void;
}

export const CaseFolder = ({ folder, level = 0, onCreateSubfolder }: CaseFolderProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4" style={{ marginLeft: `${level * 20}px` }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-2"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{folder.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateSubfolder?.(folder.id)}
          >
            New Subfolder
          </Button>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <Droppable droppableId={folder.id} type="case">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[50px]"
                >
                  {/* Cases will be rendered here */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {folder.subfolders?.map((subfolder: any) => (
              <CaseFolder
                key={subfolder.id}
                folder={subfolder}
                level={level + 1}
                onCreateSubfolder={onCreateSubfolder}
              />
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
};
