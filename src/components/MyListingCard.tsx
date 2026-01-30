import { Link } from "react-router-dom";
import { Listing, LISTING_TYPES, LISTING_STATUS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  BedDouble,
  Users,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface MyListingCardProps {
  listing: Listing;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export function MyListingCard({
  listing,
  onEdit,
  onDelete,
  onToggleStatus,
}: MyListingCardProps) {
  const formatPrice = () => {
    if (listing.price) {
      return `${listing.price.toLocaleString("ar-EG")} ₪`;
    }
    return listing.price_note || "تفاوض";
  };

  const getStatusBadge = () => {
    const statusConfig = {
      active: {
        label: LISTING_STATUS.active,
        className: "bg-success/10 text-success border-success/20",
      },
      pending: {
        label: LISTING_STATUS.pending,
        className: "bg-warning/10 text-warning border-warning/20",
      },
      hidden: {
        label: LISTING_STATUS.hidden,
        className: "bg-muted text-muted-foreground border-muted",
      },
    };

    const config = statusConfig[listing.status] || statusConfig.active;

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const firstImage = listing.listing_images?.[0]?.url;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* الصورة */}
      <div className="relative aspect-[16/10] bg-muted">
        {firstImage ? (
          <img
            src={firstImage}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <BedDouble className="w-12 h-12 opacity-50" />
          </div>
        )}

        {/* Badge النوع */}
        <span
          className={`absolute top-3 right-3 ${
            listing.type === "rent" ? "badge-rent" : "badge-sale"
          }`}
        >
          {LISTING_TYPES[listing.type]}
        </span>

        {/* Badge الحالة */}
        <div className="absolute top-3 left-3">{getStatusBadge()}</div>
      </div>

      {/* المحتوى */}
      <div className="p-4">
        <Link to={`/listing/${listing.id}`} className="hover:underline">
          <h3 className="font-bold text-lg mb-2 line-clamp-1">
            {listing.title}
          </h3>
        </Link>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {listing.area}
          </span>
          {listing.rooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              {listing.rooms} غرف
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {listing.capacity} أشخاص
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary">{formatPrice()}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(listing.created_at), {
              addSuffix: true,
              locale: ar,
            })}
          </span>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={() => onEdit(listing.id)}
          >
            <Edit className="w-4 h-4" />
            تعديل
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() =>
              onToggleStatus(
                listing.id,
                listing.status === "active" ? "hidden" : "active"
              )
            }
          >
            {listing.status === "active" ? (
              <>
                <EyeOff className="w-4 h-4" />
                إخفاء
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                إظهار
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(listing.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
