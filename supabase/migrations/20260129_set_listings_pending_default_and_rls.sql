-- ========================================
-- Migration: فرض أن الإعلانات الجديدة تكون pending
-- تاريخ: 2026-01-29 (تكملة لنظام الموافقة)
-- ========================================

-- 1) جعل القيمة الافتراضية للحالة هي pending
ALTER TABLE public.listings
ALTER COLUMN status SET DEFAULT 'pending';

-- 2) تحديث سياسة الإدخال بحيث لا يمكن لأي مستخدم عادي إنشاء إعلان بحالة غير pending
DROP POLICY IF EXISTS "Authenticated users can create listings" ON public.listings;

CREATE POLICY "Authenticated users can create listings"
ON public.listings
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND owner_id = auth.uid()
  AND status = 'pending'
);

