import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Users, 
  Briefcase, 
  FileText, 
  Search, 
  MessageSquare, 
  Receipt,
  FileUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleCalendar } from "@/components/calendar/GoogleCalendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  const { data: activeCases } = useQuery({
    queryKey: ['active-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('status', 'active');
      if (error) throw error;
      return data;
    },
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: revenue } = useQuery({
    queryKey: ['revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('amount')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());
      if (error) throw error;
      return data.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    },
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome to Pravix</h1>
          <p className="text-muted-foreground mt-2">
            Manage your legal practice efficiently
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className="hover:bg-accent/5 cursor-pointer transition-colors" 
            onClick={() => navigate("/reports?tab=cases")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-legal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCases?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Current cases</p>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:bg-accent/5 cursor-pointer transition-colors" 
            onClick={() => navigate("/reports?tab=clients")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-legal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active clients</p>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:bg-accent/5 cursor-pointer transition-colors" 
            onClick={() => navigate("/reports?tab=documents")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-legal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total documents</p>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:bg-accent/5 cursor-pointer transition-colors" 
            onClick={() => navigate("/reports?tab=financial")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <Receipt className="h-4 w-4 text-legal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Section */}
        <GoogleCalendar />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={() => navigate("/cases/new")}>
              <Briefcase className="mr-2 h-4 w-4" />
              New Case
            </Button>
            <Button onClick={() => navigate("/documents/upload")}>
              <FileText className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <Button onClick={() => navigate("/invoices/new")}>
              <Receipt className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Main Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Legal Research</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Search and analyze similar cases using CourtListener database
              </p>
              <Button onClick={() => navigate("/research")} className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Start Research
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                AI-powered analysis of legal documents with risk assessment
              </p>
              <Button onClick={() => navigate("/documents")} className="w-full">
                <FileUp className="mr-2 h-4 w-4" />
                Analyze Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default Index;
