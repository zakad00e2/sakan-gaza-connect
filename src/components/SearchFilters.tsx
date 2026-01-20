import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AREAS, LISTING_TYPES } from "@/lib/constants";

export interface Filters {
  search: string;
  area: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  rooms: string;
  capacity: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      area: "",
      type: "",
      minPrice: "",
      maxPrice: "",
      rooms: "",
      capacity: "",
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => key !== "search" && value !== "");

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-6">
      {/* شريط البحث */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-5 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ابحث عن سكن..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="input-touch pr-11"
          />
        </div>
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="icon"
          className="h-10 w-14 shrink-0"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* الفلاتر */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Select value={filters.area} onValueChange={(v) => updateFilter("area", v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="المنطقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المناطق</SelectItem>
                {AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
{/* 
            <Select value={filters.type} onValueChange={(v) => updateFilter("type", v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="نوع العرض" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {Object.entries(LISTING_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            {/* <Select value={filters.rooms} onValueChange={(v) => updateFilter("rooms", v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="عدد الغرف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">أي عدد</SelectItem>
                <SelectItem value="1">غرفة واحدة</SelectItem>
                <SelectItem value="2">غرفتين</SelectItem>
                <SelectItem value="3">3 غرف</SelectItem>
                <SelectItem value="4">4+ غرف</SelectItem>
              </SelectContent>
            </Select> */}

            <Select
              value={filters.minPrice || filters.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : undefined}
              onValueChange={(value) => {
                const [min, max] = value.split("-");
                onFiltersChange({ ...filters, minPrice: min, maxPrice: max });
              }}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="نطاق السعر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">أي سعر</SelectItem>
                <SelectItem value="-500">أقل من 500 ₪</SelectItem>
                <SelectItem value="500-1000">500 - 1000 ₪</SelectItem>
                <SelectItem value="1000-2000">1000 - 2000 ₪</SelectItem>
                <SelectItem value="2000-">أكثر من 2000 ₪</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.capacity} onValueChange={(v) => updateFilter("capacity", v)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="سعة الأشخاص" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">أي سعة</SelectItem>
                <SelectItem value="2">حتى شخصين</SelectItem>
                <SelectItem value="4">حتى 4 أشخاص</SelectItem>
                <SelectItem value="6">حتى 6 أشخاص</SelectItem>
                <SelectItem value="8">8+ أشخاص</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-3 text-muted-foreground"
            >
              <X className="w-4 h-4 ml-1" />
              مسح الفلاتر
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
