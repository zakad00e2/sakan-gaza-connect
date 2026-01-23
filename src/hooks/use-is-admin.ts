import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Checking admin status for user:", user.id);
        
        const { data, error } = await supabase
          .from("user_profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        console.log("📊 Admin check result:", { data, error });

        if (error) {
          console.error("❌ Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          const adminStatus = data?.is_admin || false;
          console.log("✅ Admin status:", adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("❌ Exception checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
}
