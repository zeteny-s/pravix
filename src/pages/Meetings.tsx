import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";

const Meetings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Meetings</h1>
            <p className="text-muted-foreground mt-2">
              Schedule and manage your meetings
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
          </Button>
        </div>

        <div className="grid gap-4">
          {/* Meeting components will be added here */}
        </div>
      </div>
    </MainLayout>
  );
};

export default Meetings;
