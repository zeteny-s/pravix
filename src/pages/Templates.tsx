import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

const Templates = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Document Templates</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage document templates
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Template cards will be added here */}
        </div>
      </div>
    </MainLayout>
  );
};

export default Templates;
