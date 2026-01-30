import { Link } from "react-router-dom";
import { MapPin, Users, BedDouble, Droplets, Zap, Wifi, Ruler } from "lucide-react";
import { Listing, LISTING_TYPES, PROPERTY_TYPES } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.listing_images?.[0]?.url || "/placeholder.svg";
  
  const formatPrice = () => {
    if (listing.price) {
      return `${listing.price.toLocaleString("ar-EG")} ₪`;
    }
    return listing.price_note || "تفاوض";
  };

  const getUtilityStatus = (value: boolean | string) => {
    if (value === true || value === "available") return "available";
    if (value === "limited") return "limited";
    return "unavailable";
  };

  return (
    <Link to={`/listing/${listing.id}`} className="listing-card block overflow-hidden animate-fade-in">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={listing.type === "rent" ? "badge-rent" : "badge-sale"}>
            {LISTING_TYPES[listing.type]}
          </span>
          {/* <span className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            {PROPERTY_TYPES[listing.property_type]}
          </span> */}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{listing.title}</h3>
        
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{listing.area}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {listing.property_type === "apartment" && listing.rooms != null ? (
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              <span>{listing.rooms} غرف</span>
            </div>
          ) : listing.property_type !== "apartment" ? (
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{listing.floor_area || "—"} م²</span>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{listing.capacity} أشخاص</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`utility-${getUtilityStatus(listing.utilities?.water)}`}>
            <Droplets className="w-3 h-3" />
            ماء
          </span>
          <span className={`utility-${getUtilityStatus(listing.utilities?.electricity)}`}>
            <Zap className="w-3 h-3" />
            كهرباء
          </span>
          <span className={`utility-${getUtilityStatus(listing.utilities?.internet)}`}>
            <Wifi className="w-3 h-3" />
            نت
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xl font-bold text-primary">{formatPrice()}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: ar })}
          </span>
        </div>
      </div>
    </Link>
  );
}
