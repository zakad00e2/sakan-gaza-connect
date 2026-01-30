-- ========================================
-- Migration: موافقة المشرف على الإعلانات قبل النشر
-- تاريخ: 2026-01-29
-- ========================================
-- الإعلانات الجديدة تُنشأ بحالة pending ولا تظهر للمستخدمين
-- حتى يوافق عليها المشرف (status = active) أو يرفضها (status = hidden)

-- ========================================
-- 1) المشرف يمكنه قراءة الإعلانات المعلقة (pending)
-- ========================================
CREATE POLICY "Admins can view pending listings"
ON public.listings
FOR SELECT
USING (
  status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ========================================
-- 2) المشرف يمكنه تحديث حالة الإعلان (موافقة/رفض)
-- ========================================
CREATE POLICY "Admins can update listing status"
ON public.listings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (true);

-- ========================================
-- 3) صور الإعلانات المعلقة: المشرف يمكنه رؤيتها
-- ========================================
DROP POLICY IF EXISTS "Anyone can view images of active listings" ON public.listing_images;

CREATE POLICY "Anyone can view images of active listings"
ON public.listing_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.listings l
    WHERE l.id = listing_images.listing_id
    AND (
      l.status = 'active'
      OR l.owner_id = auth.uid()
      OR (
        l.status = 'pending'
        AND EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE id = auth.uid() AND is_admin = true
        )
      )
    )
  )
);
