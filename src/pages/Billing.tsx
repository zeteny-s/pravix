import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Receipt, BarChart3, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

const invoiceFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  client_id: z.string().uuid("Please select a client"),
  due_date: z.string().min(1, "Due date is required"),
});

const Billing = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      amount: "",
      description: "",
      client_id: "",
      due_date: "",
    },
  });

  const { data: stripeAccount } = useQuery({
    queryKey: ['stripe-account'],
    queryFn: async () => {
      const response = await supabase.functions.invoke('get-stripe-account', {
        method: 'GET',
      });
      if (response.error) throw response.error;
      return response.data;
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

  const { data: invoices, refetch: refetchInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleStripeConnect = async () => {
    try {
      const response = await supabase.functions.invoke('create-stripe-account', {
        method: 'POST',
      });
      
      if (response.error) throw response.error;
      
      window.location.href = response.data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect with Stripe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof invoiceFormSchema>) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .insert({
          amount: parseFloat(values.amount),
          notes: values.description,
          client_id: values.client_id,
          due_date: values.due_date,
          status: 'draft',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice created successfully.",
      });
      
      setIsCreateDialogOpen(false);
      form.reset();
      refetchInvoices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openStripeDashboard = () => {
    if (stripeAccount?.dashboardUrl) {
      window.open(stripeAccount.dashboardUrl, '_blank');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground mt-2">
            Manage your invoices and payments with Stripe
          </p>
        </div>

        {!stripeAccount?.connected ? (
          <Card>
            <CardHeader>
              <CardTitle>Connect with Stripe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Connect your Stripe account to start accepting payments and managing invoices.
              </p>
              <Button onClick={handleStripeConnect}>
                <CreditCard className="mr-2 h-4 w-4" />
                Connect Stripe Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Invoice
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Invoice</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="client_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Client</FormLabel>
                                <select
                                  {...field}
                                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                  <option value="">Select a client</option>
                                  {clients?.map((client) => (
                                    <option key={client.id} value={client.id}>
                                      {client.name}
                                    </option>
                                  ))}
                                </select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="due_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full">
                            Create Invoice
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stripe Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={openStripeDashboard} variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Reports & Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices?.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {invoice.clients?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.notes}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(invoice.due_date), 'PP')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Billing;
