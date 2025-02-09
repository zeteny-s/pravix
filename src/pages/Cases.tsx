import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, FolderPlus } from "lucide-react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CaseFolder } from "@/components/cases/CaseFolder";
import { CaseCard } from "@/components/cases/CaseCard";
import { CreateFolderDialog } from "@/components/cases/CreateFolderDialog";
import { CaseFilters } from "@/components/cases/CaseFilters";
import { useToast } from "@/components/ui/use-toast";
import { isAfter, isBefore, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

const Cases = () => {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [selectedParentFolder, setSelectedParentFolder] = useState<string | undefined>();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    deadline: "all",
    sortOrder: "desc" as "asc" | "desc",
  });
  const { toast } = useToast();

  const { data: folders } = useQuery({
    queryKey: ['case-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_folders')
        .select('*')
        .is('parent_folder_id', null)
        .order('created_at');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: cases } = useQuery({
    queryKey: ['cases', filters],
    queryFn: async () => {
      let query = supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: filters.sortOrder === 'asc' });

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data: allCases, error } = await query;
      
      if (error) throw error;

      // Filter cases based on deadline
      return allCases.filter((caseItem: any) => {
        if (!filters.deadline || filters.deadline === 'all') return true;
        if (!caseItem.deadline) return false;

        const deadlineDate = new Date(caseItem.deadline);
        const now = new Date();

        switch (filters.deadline) {
          case 'today':
            return isAfter(deadlineDate, startOfDay(now)) && 
                   isBefore(deadlineDate, endOfDay(now));
          case 'week':
            return isAfter(deadlineDate, startOfWeek(now)) && 
                   isBefore(deadlineDate, endOfWeek(now));
          case 'month':
            return isAfter(deadlineDate, startOfMonth(now)) && 
                   isBefore(deadlineDate, endOfMonth(now));
          case 'overdue':
            return isBefore(deadlineDate, now);
          default:
            return true;
        }
      });
    },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newFolderId = destination.droppableId;

    try {
      const { error } = await supabase
        .from('cases')
        .update({ folder_id: newFolderId })
        .eq('id', draggableId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Case moved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateSubfolder = (parentId: string) => {
    setSelectedParentFolder(parentId);
    setCreateFolderOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Cases</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your legal cases
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </div>
        </div>

        <CaseFilters onFilterChange={setFilters} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid gap-6">
            {folders?.map((folder) => (
              <CaseFolder
                key={folder.id}
                folder={folder}
                onCreateSubfolder={handleCreateSubfolder}
              />
            ))}
            
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Uncategorized Cases</h2>
              {cases?.filter((c: any) => !c.folder_id).map((caseItem: any, index: number) => (
                <CaseCard
                  key={caseItem.id}
                  caseItem={caseItem}
                  index={index}
                />
              ))}
            </Card>
          </div>
        </DragDropContext>

        <CreateFolderDialog
          open={createFolderOpen}
          onClose={() => {
            setCreateFolderOpen(false);
            setSelectedParentFolder(undefined);
          }}
          parentFolderId={selectedParentFolder}
        />
      </div>
    </MainLayout>
  );
};

export default Cases;
