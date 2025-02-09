import { Database } from "@/integrations/supabase/types";

export interface InvolvedParty {
  name: string;
  role: string;
  email: string;
}

export type Task = Database["public"]["Tables"]["cases"]["Row"] & {
  involved_parties?: InvolvedParty[];
};
