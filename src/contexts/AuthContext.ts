import { createContext } from "react";
import { User, Session } from "@supabase/supabase-js";

// ========================================
// أنواع البيانات
// ========================================

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// ========================================
// Context
// ========================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
