import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  chart?: React.ReactNode;
  detailView?: React.ReactNode;
  icon?: React.ReactNode;
  expandedChart?: React.ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  chart, 
  detailView, 
  icon,
  expandedChart 
}: MetricCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="hover:bg-accent/5 cursor-pointer transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              {icon && <div className="text-muted-foreground">{icon}</div>}
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {chart && <div className="mt-4 h-[100px]">{chart}</div>}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {expandedChart ? (
            <div className="h-[400px] w-full">
              {expandedChart}
            </div>
          ) : chart ? (
            <div className="h-[400px] w-full">
              {chart}
            </div>
          ) : null}
          {detailView && (
            <div className="mt-6 border-t pt-6">
              {detailView}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
