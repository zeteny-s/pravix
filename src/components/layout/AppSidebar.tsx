import {
  Briefcase,
  Calendar,
  FileText,
  Settings,
  BarChart,
  Search,
  MessageSquare,
  Receipt,
  Timer,
  CreditCard,
  FileSpreadsheet,
  Brain,
  Mic,
  Video,
  ClipboardList,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();

  const mainMenuItems = [
    { title: "My Cases", icon: Briefcase, url: "/cases" },
    { title: "Calendar", icon: Calendar, url: "/calendar" },
    { title: "Task Management", icon: ClipboardList, url: "/tasks" },
    { title: "Contact Management", icon: Users, url: "/contacts" },
  ];

  const workMenuItems = [
    { title: "Document Management", icon: FileText, url: "/documents" },
    { title: "Document Templates", icon: FileSpreadsheet, url: "/templates" },
    { title: "Document Analysis", icon: Brain, url: "/document-analysis" },
    { title: "AI Legal Research", icon: Search, url: "/research" },
    { title: "Text to Speech", icon: Mic, url: "/text-to-speech" },
    { title: "Messaging", icon: MessageSquare, url: "/messages" },
    { title: "Meetings", icon: Video, url: "/meetings" },
  ];

  const financeMenuItems = [
    { title: "Time Tracking", icon: Timer, url: "/time-tracking" },
    { title: "Billing", icon: CreditCard, url: "/billing" },
    { title: "Finance", icon: Receipt, url: "/finance" },
    { title: "Reports", icon: BarChart, url: "/reports" },
  ];

  return (
    <Sidebar>
      <div className="p-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/010e1db4-f554-4c6b-b860-6dc16b829877.png" 
            alt="Logo" 
            className="h-8" 
          />
        </Link>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Work</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Finance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Law Firm Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1 text-sm text-muted-foreground">
              Available for Law Firm accounts only
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenuButton asChild>
          <a
            href="/settings"
            className="flex items-center gap-2"
            data-active={location.pathname === "/settings"}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
