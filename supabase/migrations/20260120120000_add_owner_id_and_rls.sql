-- ========================================
-- Migration: إضافة owner_id وسياسات RLS
-- تاريخ: 2026-01-20
-- ========================================

-- ========================================
-- 1) إضافة عمود owner_id إلى جدول listings
-- ========================================

-- إضافة العمود owner_id (nullable أولاً للإعلانات الموجودة)
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- إنشاء فهرس على owner_id لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON public.listings(owner_id);

-- ========================================
-- 2) حذف السياسات القديمة
-- ========================================

-- حذف سياسات listings القديمة
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.listings;
DROP POLICY IF EXISTS "Anyone can create listings" ON public.listings;
DROP POLICY IF EXISTS "Owners can update their listings" ON public.listings;
DROP POLICY IF EXISTS "Owners can delete their listings" ON public.listings;
DROP POLICY IF EXISTS "Users can view own listings" ON public.listings;

-- حذف سياسات listing_images القديمة
DROP POLICY IF EXISTS "Anyone can view listing images" ON public.listing_images;
DROP POLICY IF EXISTS "Anyone can add listing images" ON public.listing_images;
DROP POLICY IF EXISTS "Owners can delete listing images" ON public.listing_images;

-- حذف سياسات reports القديمة
DROP POLICY IF EXISTS "Anyone can create reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can view reports" ON public.reports;

-- ========================================
-- 3) سياسات جدول listings
-- ========================================

-- SELECT: الجميع يمكنهم قراءة الإعلانات النشطة
CREATE POLICY "Anyone can view active listings" 
ON public.listings 
FOR SELECT 
USING (status = 'active');

-- SELECT: المستخدم المسجل يمكنه قراءة إعلاناته بأي حالة
CREATE POLICY "Users can view own listings" 
ON public.listings 
FOR SELECT 
USING (auth.uid() = owner_id);

-- INSERT: فقط المستخدم المسجل ويجب أن يكون owner_id = auth.uid()
CREATE POLICY "Authenticated users can create listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND owner_id = auth.uid()
);

-- UPDATE: فقط مالك الإعلان
CREATE POLICY "Owners can update their listings" 
ON public.listings 
FOR UPDATE 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- DELETE: فقط مالك الإعلان
CREATE POLICY "Owners can delete their listings" 
ON public.listings 
FOR DELETE 
USING (auth.uid() = owner_id);

-- ========================================
-- 4) سياسات جدول listing_images
-- ========================================

-- SELECT: يمكن رؤية صور الإعلانات النشطة أو إعلانات المالك
CREATE POLICY "Anyone can view images of active listings" 
ON public.listing_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = listing_images.listing_id 
    AND (listings.status = 'active' OR listings.owner_id = auth.uid())
  )
);

-- INSERT: فقط مالك الإعلان يمكنه إضافة صور
CREATE POLICY "Owners can add listing images" 
ON public.listing_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = listing_images.listing_id 
    AND listings.owner_id = auth.uid()
  )
);

-- DELETE: فقط مالك الإعلان يمكنه حذف صور
CREATE POLICY "Owners can delete listing images" 
ON public.listing_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = listing_images.listing_id 
    AND listings.owner_id = auth.uid()
  )
);

-- ========================================
-- 5) سياسات جدول reports
-- ========================================

-- INSERT: الجميع يمكنهم الإبلاغ (حتى بدون تسجيل)
CREATE POLICY "Anyone can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (true);

-- SELECT: منع القراءة العامة (للمشرف فقط لاحقاً)
-- لا نضيف سياسة SELECT، مما يعني أن لا أحد يمكنه القراءة إلا المشرف من Dashboard

-- ========================================
-- 6) سياسات Storage bucket للصور
-- ========================================

-- ملاحظة: يجب تنفيذ هذه السياسات من Supabase Dashboard
-- أو عبر SQL إذا كان الـ bucket موجوداً

-- إنشاء bucket إذا لم يكن موجوداً (يتطلب صلاحيات service_role)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('listings', 'listings', true) ON CONFLICT DO NOTHING;

-- سياسة رفع الصور - فقط للمسجلين
-- CREATE POLICY "Authenticated users can upload listing images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'listings' AND auth.role() = 'authenticated');

-- سياسة قراءة الصور - للجميع
-- CREATE POLICY "Anyone can view listing images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'listings');

-- سياسة حذف الصور - فقط المالك (حسب path)
-- CREATE POLICY "Users can delete own listing images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
