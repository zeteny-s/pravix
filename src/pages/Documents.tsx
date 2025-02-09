import { MainLayout } from "@/components/layout/MainLayout";
import { DocumentUploadDialog } from "@/components/documents/DocumentUploadDialog";
import { DocumentList } from "@/components/documents/DocumentList";

const Documents = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground mt-2">
              Manage and share your legal documents
            </p>
          </div>
          <DocumentUploadDialog />
        </div>
        <DocumentList />
      </div>
    </MainLayout>
  );
};

export default Documents;
