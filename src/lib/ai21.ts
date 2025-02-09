import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SimilarityResponse {
  score: number;
}

export const calculateSimilarity = async (
  text1: string,
  text2: string
): Promise<number> => {
  try {
    console.log('Invoking calculate-similarity function')
    const { data, error } = await supabase.functions.invoke('calculate-similarity', {
      body: {
        text1,
        text2
      }
    })

    if (error) {
      console.error('Supabase function error:', error)
      throw error
    }

    return Math.round((data as SimilarityResponse).score * 100)
  } catch (error) {
    console.error('Error in calculateSimilarity:', error)
    toast.error("Error calculating similarity score")
    return 0
  }
}
