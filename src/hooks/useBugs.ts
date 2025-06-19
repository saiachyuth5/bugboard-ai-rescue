
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bug } from "@/types";

export const useBugs = () => {
  return useQuery({
    queryKey: ['bugs'],
    queryFn: async (): Promise<Bug[]> => {
      const { data, error } = await supabase
        .from('bugs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bugs:', error);
        throw error;
      }

      return data?.map(bug => ({
        id: bug.id,
        title: bug.title,
        summary: bug.summary || '',
        agentName: bug.agent_name,
        input: bug.input,
        logs: bug.logs || [],
        error: bug.error,
        timestamp: bug.created_at,
        status: bug.status as 'open' | 'in-progress' | 'resolved',
        bounty: bug.bounty,
        upvotes: bug.upvotes,
        fixes: [] // This would need a separate table for fixes
      })) || [];
    }
  });
};
