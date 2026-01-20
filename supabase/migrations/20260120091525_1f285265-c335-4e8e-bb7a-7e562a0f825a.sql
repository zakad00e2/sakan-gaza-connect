-- جدول الإعلانات الرئيسي
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rent', 'hosting')),
  area TEXT NOT NULL,
  price INTEGER,
  price_note TEXT,
  rooms INTEGER NOT NULL DEFAULT 1,
  capacity INTEGER NOT NULL DEFAULT 1,
  utilities JSONB DEFAULT '{"water": false, "electricity": false, "internet": false}'::jsonb,
  description TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  whatsapp_enabled BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'hidden')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول صور الإعلانات
CREATE TABLE public.listing_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول البلاغات
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- سياسات الإعلانات - القراءة للجميع (الإعلانات النشطة فقط)
CREATE POLICY "Anyone can view active listings" 
ON public.listings 
FOR SELECT 
USING (status = 'active');

-- الجميع يمكنهم إضافة إعلان
CREATE POLICY "Anyone can create listings" 
ON public.listings 
FOR INSERT 
WITH CHECK (true);

-- سياسات الصور - القراءة للجميع
CREATE POLICY "Anyone can view listing images" 
ON public.listing_images 
FOR SELECT 
USING (true);

-- الجميع يمكنهم إضافة صور
CREATE POLICY "Anyone can add listing images" 
ON public.listing_images 
FOR INSERT 
WITH CHECK (true);

-- سياسات البلاغات - الجميع يمكنهم الإبلاغ
CREATE POLICY "Anyone can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (true);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_type ON public.listings(type);
CREATE INDEX idx_listings_area ON public.listings(area);
CREATE INDEX idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX idx_listing_images_listing_id ON public.listing_images(listing_id);