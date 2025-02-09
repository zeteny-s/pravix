import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileUp, FileSearch } from "lucide-react";

const DocumentAnalysis = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Document Analysis</h1>
            <p className="text-muted-foreground mt-2">
              Analyze legal documents using AI
            </p>
          </div>
          <Button>
            <FileUp className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>

        <div className="grid gap-4">
          {/* Analysis components will be added here */}
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentAnalysis;
