import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Folder } from "lucide-react";

interface DocumentCardProps {
  document: any;
  onDownload: (document: any) => void;
  onShare: (document: any) => void;
  provided: any;
}

export const DocumentCard = ({ document, onDownload, onShare, provided }: DocumentCardProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            {document.folder_id ? (
              <Folder className="h-6 w-6 text-muted-foreground" />
            ) : (
              <FileText className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <CardTitle className="text-lg">{document.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(document.created_at).toLocaleDateString()}
                {document.document_folders && ` • ${document.document_folders.name}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDownload(document)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onShare(document)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{document.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};
