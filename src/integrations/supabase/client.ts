// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dzmmujactfglppguhppm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bW11amFjdGZnbHBwZ3VocHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyODc3MTIsImV4cCI6MjA1Mjg2MzcxMn0.aQzPbTf1bax38c2QY3qnjzGQqJtIJnjGM1kRj_Y94AM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
