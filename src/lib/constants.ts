// مناطق غزة
export const AREAS = [
  "رفح",
  "خان يونس",
  "دير البلح",
  "النصيرات",
  "البريج",
  "المغازي",
  "الزوايدة",
  "غزة المدينة",
  "الشاطئ",
  "الرمال",
  "تل الهوا",
  "الشجاعية",
  "الزيتون",
  "جباليا",
  "بيت لاهيا",
  "بيت حانون",
] as const;

export type Area = typeof AREAS[number];

// أنواع العروض (إيجار/بيع)
export const LISTING_TYPES = {
  rent: "إيجار",
  sale: "بيع",
} as const;

export type ListingType = keyof typeof LISTING_TYPES;

// أنواع العقارات
export const PROPERTY_TYPES = {
  warehouse: "حاصل",
  land: "أرض",
  apartment: "شقة",
} as const;

export type PropertyType = keyof typeof PROPERTY_TYPES;

// حالات الإعلان
export const LISTING_STATUS = {
  active: "نشط",
  pending: "قيد المراجعة",
  hidden: "مخفي",
} as const;

export type ListingStatus = keyof typeof LISTING_STATUS;

// مقدمات الدول
export const COUNTRY_CODES = [
  { code: "+970", country: "فلسطين (Palestine)" },
  { code: "+972", country: "فلسطين المحتلة (48)" },
  { code: "+20", country: "مصر (Egypt)" },
  { code: "+962", country: "الأردن (Jordan)" },
  { code: "+966", country: "السعودية (Saudi Arabia)" },
  { code: "+971", country: "الإمارات (UAE)" },
  { code: "+974", country: "قطر (Qatar)" },
  { code: "+90", country: "تركيا (Turkey)" },
  { code: "+1", country: "أمريكا/كندا (US/CA)" },
  { code: "+44", country: "بريطانيا (UK)" },
  { code: "+49", country: "ألمانيا (Germany)" },
  { code: "+33", country: "فرنسا (France)" },
] as const;

// أسباب الإبلاغ
export const REPORT_REASONS = [
  "إعلان وهمي أو احتيال",
  "معلومات غير صحيحة",
  "سعر مبالغ فيه",
  "محتوى مسيء",
  "تم تأجير العقار",
  "سبب آخر",
] as const;

// المرافق
export const UTILITIES = {
  water: "ماء",
  electricity: "كهرباء",
  internet: "إنترنت",
} as const;

export type UtilityKey = keyof typeof UTILITIES;

export interface Utilities {
  water: boolean | string;
  electricity: boolean | string;
  internet: boolean | string;
}

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  property_type: PropertyType;
  area: string;
  price: number | null;
  price_note: string | null;
  rooms: number | null;
  floor_area: number | null;
  capacity: number;
  utilities: Utilities;
  description: string | null;
  contact_name: string;
  contact_phone: string;
  whatsapp_enabled: boolean;
  status: ListingStatus;
  created_at: string;
  owner_id: string | null;
  listing_images?: { id: string; url: string }[];
}
