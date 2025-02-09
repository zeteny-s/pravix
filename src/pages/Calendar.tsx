import { MainLayout } from "@/components/layout/MainLayout";
import { GoogleCalendar } from "@/components/calendar/GoogleCalendar";

const Calendar = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage your schedule and appointments
          </p>
        </div>
        <GoogleCalendar />
      </div>
    </MainLayout>
  );
};

export default Calendar;
