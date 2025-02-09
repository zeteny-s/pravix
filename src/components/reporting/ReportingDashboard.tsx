import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeSelector } from "./DateRangeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseMetricsSection } from "./metrics/CaseMetricsSection";
import { TimeMetricsSection } from "./metrics/TimeMetricsSection";
import { ClientMetrics } from "./ClientMetrics";
import { FinancialMetricsSection } from "./metrics/FinancialMetricsSection";

export function ReportingDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor key metrics and performance indicators
          </p>
        </div>
        <DateRangeSelector onRangeChange={setDateRange} />
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="cases">Case Management</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <FinancialMetricsSection dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <CaseMetricsSection dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <TimeMetricsSection dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ClientMetrics dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
