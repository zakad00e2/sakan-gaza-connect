import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AREAS, LISTING_TYPES, UtilityKey } from "@/lib/constants";
import { ArrowRight, Upload, X, Loader2, CheckCircle } from "lucide-react";

export default function AddListing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    type: "rent" as "rent" | "hosting",
    area: "",
    price: "",
    price_note: "",
    rooms: "1",
    capacity: "1",
    utilities: {
      water: "unavailable",
      electricity: "unavailable",
      internet: "unavailable",
    },
    description: "",
    contact_name: "",
    contact_phone: "",
    whatsapp_enabled: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "الحد الأقصى 5 صور",
        variant: "destructive",
      });
      return;
    }

    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const updateUtility = (key: UtilityKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      utilities: { ...prev.utilities, [key]: value },
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({ title: "يرجى إدخال عنوان الإعلان", variant: "destructive" });
      return false;
    }
    if (!formData.area) {
      toast({ title: "يرجى اختيار المنطقة", variant: "destructive" });
      return false;
    }
    if (!formData.contact_name.trim()) {
      toast({ title: "يرجى إدخال اسم التواصل", variant: "destructive" });
      return false;
    }
    if (!formData.contact_phone.trim()) {
      toast({ title: "يرجى إدخال رقم التواصل", variant: "destructive" });
      return false;
    }
    // تحقق من صحة رقم الهاتف
    const phoneRegex = /^[\d\s\-+()]{8,15}$/;
    if (!phoneRegex.test(formData.contact_phone)) {
      toast({ title: "رقم الهاتف غير صحيح", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // إنشاء الإعلان
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          title: formData.title.trim(),
          type: formData.type,
          area: formData.area,
          price: formData.price ? parseInt(formData.price) : null,
          price_note: formData.price_note.trim() || null,
          rooms: parseInt(formData.rooms),
          capacity: parseInt(formData.capacity),
          utilities: {
            water: formData.utilities.water === "available" ? true : formData.utilities.water === "limited" ? "limited" : false,
            electricity: formData.utilities.electricity === "available" ? true : formData.utilities.electricity === "limited" ? "limited" : false,
            internet: formData.utilities.internet === "available" ? true : formData.utilities.internet === "limited" ? "limited" : false,
          },
          description: formData.description.trim() || null,
          contact_name: formData.contact_name.trim(),
          contact_phone: formData.contact_phone.trim(),
          whatsapp_enabled: formData.whatsapp_enabled,
          status: "active",
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // رفع الصور إن وجدت
      if (images.length > 0 && listing) {
        for (const image of images) {
          const fileExt = image.name.split(".").pop();
          const fileName = `${listing.id}/${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(fileName, image);

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("listings")
              .getPublicUrl(fileName);

            await supabase.from("listing_images").insert({
              listing_id: listing.id,
              url: urlData.publicUrl,
            });
          }
        }
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-20 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-3">تم نشر إعلانك بنجاح!</h1>
          <p className="text-muted-foreground mb-8">
            إعلانك متاح الآن للجميع. نتمنى أن تجد من يحتاج لهذا السكن قريباً.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/">
              <Button className="w-full">العودة للرئيسية</Button>
            </Link>
            <Button variant="outline" onClick={() => {
              setIsSuccess(false);
              setFormData({
                title: "",
                type: "rent",
                area: "",
                price: "",
                price_note: "",
                rooms: "1",
                capacity: "1",
                utilities: { water: "unavailable", electricity: "unavailable", internet: "unavailable" },
                description: "",
                contact_name: "",
                contact_phone: "",
                whatsapp_enabled: true,
              });
              setImages([]);
              setPreviewUrls([]);
            }}>
              إضافة إعلان آخر
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <h1 className="text-2xl font-bold mb-6">إضافة إعلان جديد</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نوع العرض */}
          <div className="space-y-3">
            <Label className="text-base">نوع العرض</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v as "rent" | "hosting" })}
              className="flex gap-4"
            >
              {Object.entries(LISTING_TYPES).map(([key, label]) => (
                <Label
                  key={key}
                  htmlFor={key}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.type === key
                      ? key === "rent"
                        ? "border-rent bg-rent/5"
                        : "border-hosting bg-hosting/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value={key} id={key} className="sr-only" />
                  <span className="font-medium">{label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* العنوان */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الإعلان *</Label>
            <Input
              id="title"
              placeholder="مثال: شقة غرفتين في الرمال"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-touch"
              maxLength={100}
            />
          </div>

          {/* المنطقة */}
          <div className="space-y-2">
            <Label>المنطقة *</Label>
            <Select value={formData.area} onValueChange={(v) => setFormData({ ...formData, area: v })}>
              <SelectTrigger className="input-touch">
                <SelectValue placeholder="اختر المنطقة" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* السعر */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">السعر (شيكل)</Label>
              <Input
                id="price"
                type="number"
                placeholder="مثال: 500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-touch"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_note">أو ملاحظة</Label>
              <Input
                id="price_note"
                placeholder="تفاوض / مساعدة"
                value={formData.price_note}
                onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
                className="input-touch"
              />
            </div>
          </div>

          {/* الغرف والسعة */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>عدد الغرف</Label>
              <Select value={formData.rooms} onValueChange={(v) => setFormData({ ...formData, rooms: v })}>
                <SelectTrigger className="input-touch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>سعة الأشخاص</Label>
              <Select value={formData.capacity} onValueChange={(v) => setFormData({ ...formData, capacity: v })}>
                <SelectTrigger className="input-touch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* المرافق */}
          <div className="space-y-3">
            <Label className="text-base">المرافق</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["water", "electricity", "internet"] as UtilityKey[]).map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    {key === "water" ? "الماء" : key === "electricity" ? "الكهرباء" : "الإنترنت"}
                  </Label>
                  <Select
                    value={formData.utilities[key]}
                    onValueChange={(v) => updateUtility(key, v)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">متوفر</SelectItem>
                      <SelectItem value="limited">محدود</SelectItem>
                      <SelectItem value="unavailable">غير متوفر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* الوصف */}
          <div className="space-y-2">
            <Label htmlFor="description">وصف إضافي</Label>
            <Textarea
              id="description"
              placeholder="أضف تفاصيل عن السكن، الموقع الدقيق، المميزات..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[120px]"
              maxLength={1000}
            />
          </div>

          {/* الصور */}
          <div className="space-y-3">
            <Label className="text-base">الصور (اختياري - حتى 5 صور)</Label>
            <div className="flex flex-wrap gap-3">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">إضافة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                    multiple
                  />
                </label>
              )}
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="bg-card rounded-xl p-4 border border-border space-y-4">
            <h3 className="font-bold">معلومات التواصل</h3>
            
            <div className="space-y-2">
              <Label htmlFor="contact_name">الاسم *</Label>
              <Input
                id="contact_name"
                placeholder="اسمك أو اسم المسؤول"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="input-touch"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">رقم الهاتف *</Label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder="مثال: 059XXXXXXX"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="input-touch"
                dir="ltr"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="whatsapp">تفعيل التواصل عبر واتساب</Label>
              <Switch
                id="whatsapp"
                checked={formData.whatsapp_enabled}
                onCheckedChange={(v) => setFormData({ ...formData, whatsapp_enabled: v })}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full btn-touch"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                جاري النشر...
              </>
            ) : (
              "نشر الإعلان"
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
