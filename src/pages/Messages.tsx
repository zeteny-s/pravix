import { MainLayout } from "@/components/layout/MainLayout";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";

const Messages = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Communicate securely with clients and team members
          </p>
        </div>
        <MessagingInterface />
      </div>
    </MainLayout>
  );
};

export default Messages;
