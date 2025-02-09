import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeTracker } from "@/components/time-tracking/TimeTracker";
import { TimeEntries } from "@/components/time-tracking/TimeEntries";
import { TimeReports } from "@/components/time-tracking/TimeReports";

const TimeTracking = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your billable hours
          </p>
        </div>

        <Tabs defaultValue="tracker">
          <TabsList>
            <TabsTrigger value="tracker">Timer</TabsTrigger>
            <TabsTrigger value="entries">Time Entries</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="tracker" className="mt-6">
            <TimeTracker />
          </TabsContent>
          <TabsContent value="entries" className="mt-6">
            <TimeEntries />
          </TabsContent>
          <TabsContent value="reports" className="mt-6">
            <TimeReports />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TimeTracking;
