-- إضافة عمود نوع العقار
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'apartment' CHECK (property_type IN ('apartment', 'land', 'warehouse'));

-- إضافة عمود المساحة
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS floor_area INTEGER;

-- تعديل عمود الغرف ليكون nullable
ALTER TABLE listings 
ALTER COLUMN rooms DROP NOT NULL;

-- تحديث قيد نوع العرض ليشمل sale بدلاً من hosting
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_type_check;
ALTER TABLE listings ADD CONSTRAINT listings_type_check CHECK (type IN ('rent', 'sale'));

-- إنشاء index لتحسين البحث
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON listings(property_type);
