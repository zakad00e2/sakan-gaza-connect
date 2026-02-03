import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// ========================================
// أنواع البيانات
// ========================================

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// ========================================
// دوال المصادقة
// ========================================

/**
 * جلب المستخدم الحالي
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * جلب الجلسة الحالية
 */
export async function getCurrentSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * تسجيل حساب جديد
 */
export async function signUp({ email, password, fullName }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "",
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * تسجيل الدخول بكلمة المرور
 */
export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * تسجيل الدخول بـ Magic Link
 */
export async function signInWithMagicLink(email: string, redirectTo?: string) {
  // حفظ الصفحة المطلوبة للتوجيه إليها بعد تسجيل الدخول
  if (redirectTo) {
    localStorage.setItem("auth_redirect", redirectTo);
  }
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * تسجيل الدخول عبر Google
 */
export async function signInWithGoogle(redirectTo?: string) {
  // حفظ الصفحة المطلوبة للتوجيه إليها بعد تسجيل الدخول
  if (redirectTo) {
    localStorage.setItem("auth_redirect", redirectTo);
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * تسجيل الدخول عبر Facebook
 */
export async function signInWithFacebook(redirectTo?: string) {
  // حفظ الصفحة المطلوبة للتوجيه إليها بعد تسجيل الدخول
  if (redirectTo) {
    localStorage.setItem("auth_redirect", redirectTo);
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * تسجيل الخروج
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * إعادة تعيين كلمة المرور
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

/**
 * التحقق من حالة المصادقة (للاستخدام في الصفحات المحمية)
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول للوصول لهذه الصفحة");
  }
  return user;
}

/**
 * الاشتراك في تغييرات حالة المصادقة
 */
export function onAuthStateChange(
  callback: (user: User | null, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null, session);
  });
}
