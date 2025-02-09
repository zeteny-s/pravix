import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, StopCircle, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TimeTracker() {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [hourlyRate, setHourlyRate] = useState("250");

  const startTimeTracking = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('time-entries', {
        body: {
          action: 'start',
          timeEntryData: {
            description,
            caseId: selectedCase,
            billable: true,
            hourlyRate: parseFloat(hourlyRate)
          }
        }
      });

      if (error) throw error;

      setIsTracking(true);
      toast({
        title: "Time tracking started",
        description: "Your time is now being tracked"
      });
    } catch (error) {
      console.error('Error starting time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to start time tracking",
        variant: "destructive"
      });
    }
  };

  const pauseTimeTracking = async () => {
    try {
      const { error } = await supabase.functions.invoke('time-entries', {
        body: { action: 'pause' }
      });

      if (error) throw error;

      setIsPaused(true);
      toast({
        title: "Time tracking paused",
        description: "Your time entry has been paused"
      });
    } catch (error) {
      console.error('Error pausing time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to pause time tracking",
        variant: "destructive"
      });
    }
  };

  const resumeTimeTracking = async () => {
    try {
      const { error } = await supabase.functions.invoke('time-entries', {
        body: { action: 'resume' }
      });

      if (error) throw error;

      setIsPaused(false);
      toast({
        title: "Time tracking resumed",
        description: "Your time entry has been resumed"
      });
    } catch (error) {
      console.error('Error resuming time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to resume time tracking",
        variant: "destructive"
      });
    }
  };

  const stopTimeTracking = async () => {
    try {
      const { error } = await supabase.functions.invoke('time-entries', {
        body: { action: 'stop' }
      });

      if (error) throw error;

      setIsTracking(false);
      setIsPaused(false);
      setDescription("");
      toast({
        title: "Time tracking stopped",
        description: "Your time entry has been saved"
      });
    } catch (error) {
      console.error('Error stopping time tracking:', error);
      toast({
        title: "Error",
        description: "Failed to stop time tracking",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="What are you working on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isTracking}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="case">Case</Label>
          <Select
            value={selectedCase}
            onValueChange={setSelectedCase}
            disabled={isTracking}
          >
            <SelectTrigger id="case">
              <SelectValue placeholder="Select a case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="case1">Case #1234 - Smith vs. Jones</SelectItem>
              <SelectItem value="case2">Case #5678 - Corporate Merger</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">Hourly Rate ($)</Label>
          <Input
            id="rate"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            disabled={isTracking}
          />
        </div>

        <div className="flex gap-2">
          {!isTracking ? (
            <Button onClick={startTimeTracking} disabled={!description || !selectedCase}>
              <Play className="mr-2 h-4 w-4" />
              Start Timer
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button variant="outline" onClick={pauseTimeTracking}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" onClick={resumeTimeTracking}>
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              )}
              <Button variant="destructive" onClick={stopTimeTracking}>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
