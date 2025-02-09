import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { DocumentShareDialog } from "./DocumentShareDialog";
import { DocumentFilters } from "./DocumentFilters";
import { DocumentCard } from "./DocumentCard";
import { DocumentPagination } from "./DocumentPagination";
import { useState } from "react";

export const DocumentList = () => {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['documents', selectedFolder, searchTerm, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select(`
          *,
          document_permissions (
            user_id,
            permission
          ),
          document_folders (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedFolder) {
        query = query.eq('folder_id', selectedFolder);
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async (document: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error: any) {
      console.error('Error downloading file:', error.message);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;

    const documentId = result.draggableId;
    const newFolderId = result.destination.droppableId === 'documents' ? null : result.destination.droppableId;

    try {
      const { error } = await supabase
        .from('documents')
        .update({ folder_id: newFolderId })
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Document moved successfully",
        description: "The document has been moved to the new folder.",
      });

      refetch();
    } catch (error: any) {
      console.error('Error moving document:', error.message);
      toast({
        title: "Error moving document",
        description: "There was an error moving the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <DocumentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          folders={folders || []}
        />

        <Droppable droppableId={selectedFolder || "documents"}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {documents?.map((doc: any, index: number) => (
                <Draggable key={doc.id} draggableId={doc.id} index={index}>
                  {(provided) => (
                    <DocumentCard
                      document={doc}
                      onDownload={handleDownload}
                      onShare={setSelectedDoc}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        <DocumentPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          hasNextPage={documents?.length === 10}
          isLoading={isLoading}
        />
        
        <DocumentShareDialog
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      </div>
    </DragDropContext>
  );
};
