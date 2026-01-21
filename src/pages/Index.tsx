import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchFilters, Filters } from "@/components/SearchFilters";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/lib/constants";
import { Loader2, Home, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

export default function Index() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    area: "",
    type: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
    capacity: "",
  });

  const fetchListings = async (pageNum: number, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let query = supabase
        .from("listings")
        .select(`
          *,
          listing_images (id, url)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      // تطبيق الفلاتر
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.area && filters.area !== "all") {
        query = query.eq("area", filters.area);
      }
      if (filters.type && filters.type !== "all") {
        query = query.eq("type", filters.type);
      }
      if (filters.propertyType && filters.propertyType !== "all") {
        query = query.eq("property_type", filters.propertyType);
      }
      if (filters.minPrice) {
        query = query.gte("price", parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte("price", parseInt(filters.maxPrice));
      }
      if (filters.rooms && filters.rooms !== "all") {
        const roomsNum = parseInt(filters.rooms);
        if (roomsNum === 4) {
          query = query.gte("rooms", 4);
        } else {
          query = query.eq("rooms", roomsNum);
        }
      }
      if (filters.capacity && filters.capacity !== "all") {
        query = query.lte("capacity", parseInt(filters.capacity));
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData: Listing[] = (data || []).map(item => {
        const anyItem = item as Record<string, unknown>;
        return {
          ...item,
          type: item.type as "rent" | "sale",
          property_type: ((anyItem.property_type as string) || "apartment") as "apartment" | "land" | "warehouse",
          rooms: item.rooms ?? null,
          floor_area: (anyItem.floor_area as number) ?? null,
          status: item.status as "active" | "pending" | "hidden",
          utilities: (item.utilities as { water: boolean; electricity: boolean; internet: boolean }) || { water: false, electricity: false, internet: false },
        };
      });

      if (isLoadMore) {
        setListings((prev) => [...prev, ...formattedData]);
      } else {
        setListings(formattedData);
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchListings(0);
  }, [filters]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage, true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* البانر العلوي */}
      <div className="bg-primary text-primary-foreground py-8 sm:py-12">
        <div className="container px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">سكن غزة</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
       منصة لمساعدة النازحين في إيجاد سكن مناسب 
          </p>
        </div>
      </div>

      {/* تنبيه الأمان */}
      <Link to="/safety" className="block">
        <div className="bg-warning/10 border-b border-warning/20 py-3 hover:bg-warning/15 transition-colors">
          <div className="container px-4 flex items-center justify-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span>
              <strong>تنبيه هام:</strong> لا تدفع أي عربون قبل معاينة السكن
            </span>
          </div>
        </div>
      </Link>

      <main className="container px-4 py-6">
        <SearchFilters filters={filters} onFiltersChange={setFilters} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-bold mb-2">لا توجد إعلانات</h2>
            <p className="text-muted-foreground mb-6">
              لم نجد إعلانات تطابق بحثك. جرب تغيير الفلاتر أو أضف إعلانك.
            </p>
            <Link to="/add">
              <Button>أضف إعلان جديد</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="min-w-[200px]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جاري التحميل...
                    </>
                  ) : (
                    "تحميل المزيد"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* الفوتر */}
      <footer className="bg-card border-t border-border py-6 mt-auto">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>جميع الحقوق محفوظة - سكن غزة © 2026

</p>
          {/* <p className="mt-2">نسأل الله أن يفرج عن أهلنا في غزة 🤲</p> */}
        </div>
      </footer>
    </div>
  );
}
