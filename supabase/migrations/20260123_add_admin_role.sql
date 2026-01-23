-- ========================================
-- Migration: إضافة نظام صلاحيات المسؤولين
-- تاريخ: 2026-01-23
-- ========================================

-- ========================================
-- 1) إضافة عمود is_admin إلى جدول auth.users metadata
-- ========================================
-- ملاحظة: في Supabase، معلومات المستخدم الإضافية تُخزن في raw_user_meta_data
-- سنستخدم app_metadata للصلاحيات الإدارية

-- إنشاء جدول user_profiles لتخزين معلومات المستخدمين الإضافية
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إنشاء فهرس على is_admin
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON public.user_profiles(is_admin);

-- تفعيل RLS على جدول user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 2) سياسات RLS لجدول user_profiles
-- ========================================

-- السماح للجميع بقراءة معلوماتهم الخاصة
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

-- السماح للمسؤولين بقراءة جميع الملفات الشخصية
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- السماح بإنشاء ملف شخصي عند التسجيل (سيتم تعيين is_admin = false افتراضياً)
CREATE POLICY "Users can create own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- فقط المسؤولين يمكنهم تحديث حقل is_admin
CREATE POLICY "Admins can update admin status"
ON public.user_profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ========================================
-- 3) تحديث سياسات RLS لجدول reports
-- ========================================

-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Anyone can create reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can view reports" ON public.reports;

-- السماح لأي مستخدم مسجل بإنشاء بلاغ
CREATE POLICY "Authenticated users can create reports"
ON public.reports
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- فقط المسؤولين يمكنهم قراءة البلاغات
CREATE POLICY "Only admins can view reports"
ON public.reports
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- فقط المسؤولين يمكنهم حذف البلاغات
CREATE POLICY "Only admins can delete reports"
ON public.reports
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ========================================
-- 4) إنشاء function لإنشاء ملف المستخدم تلقائياً
-- ========================================

-- Function لإنشاء user_profile عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, is_admin)
  VALUES (NEW.id, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger لتشغيل الـ function عند إنشاء مستخدم جديد
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 5) إنشاء ملفات شخصية للمستخدمين الحاليين
-- ========================================

-- إنشاء ملفات شخصية لجميع المستخدمين الموجودين (إذا لم تكن موجودة)
-- سيتم إنشاء الملفات تلقائياً عبر الـ trigger للمستخدمين الجدد
-- للمستخدمين الحاليين، نستخدم INSERT مباشرة
DO $$
BEGIN
  INSERT INTO public.user_profiles (id, is_admin)
  SELECT id, false
  FROM auth.users
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.users.id
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'تحذير: بعض المستخدمين لديهم ملفات شخصية بالفعل';
END $$;

-- ========================================
-- 6) ملاحظة مهمة للمطور
-- ========================================
-- لتعيين مستخدم كمسؤول، قم بتشغيل هذا الأمر في SQL Editor:
-- UPDATE public.user_profiles SET is_admin = true WHERE id = 'USER_ID_HERE';
--
-- للحصول على user_id الخاص بك:
-- SELECT id, email FROM auth.users;
