import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfileButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => navigate('/profile')}
    >
      <UserRound className="h-5 w-5" />
      <span className="sr-only">Profile</span>
    </Button>
  );
}
