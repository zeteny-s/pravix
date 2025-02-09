import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cases from "./pages/Cases";
import Contacts from "./pages/Contacts";
import Documents from "./pages/Documents";
import Research from "./pages/Research";
import Messages from "./pages/Messages";
import Finance from "./pages/Finance";
import TimeTracking from "./pages/TimeTracking";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Tasks from "./pages/Tasks";
import Templates from "./pages/Templates";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import TextToSpeech from "./pages/TextToSpeech";
import Meetings from "./pages/Meetings";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/research" element={<Research />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/document-analysis" element={<DocumentAnalysis />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
