import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Opinion {
  id: number;
  resource_uri: string;
  absolute_url: string;
  cluster: string;
  author: string;
  joined_by: string[];
  date_created: string;
  date_modified: string;
  type: string;
  html_with_citations: string;
  plain_text: string;
  html: string;
}

export interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Opinion[];
}

export const searchOpinions = async (
  query: string,
  court?: string,
  page: number = 1
): Promise<SearchResponse> => {
  try {
    console.log('Invoking search-opinions function with query:', query)
    const { data, error } = await supabase.functions.invoke('search-opinions', {
      body: {
        query,
        court,
        page
      }
    })

    if (error) {
      console.error('Supabase function error:', error)
      throw error
    }

    return data as SearchResponse
  } catch (error) {
    console.error('Error in searchOpinions:', error)
    toast.error("Error fetching opinions")
    throw error
  }
}
