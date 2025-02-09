import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User } from "lucide-react";

interface UserListProps {
  onSelectUser: (userId: string, email: string) => void;
  selectedUserId?: string | null;
}

export const UserList = ({ onSelectUser, selectedUserId }: UserListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .ilike("email", `%${searchQuery}%`);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="w-full md:w-80 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {isLoading ? (
            <div className="text-center text-sm text-muted-foreground">
              Loading users...
            </div>
          ) : users?.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No users found
            </div>
          ) : (
            users?.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectUser(user.id, user.email || "")}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  selectedUserId === user.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <Avatar>
                  <User className="h-5 w-5" />
                </Avatar>
                <span className="text-sm truncate">{user.email}</span>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
