import { Link } from "react-router-dom";
import { MapPin, Users, BedDouble, Droplets, Zap, Wifi, Ruler } from "lucide-react";
import { Listing, LISTING_TYPES, PROPERTY_TYPES } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "motion/react";
import { MotionItem, MotionSurface } from "@/components/motion/MotionPrimitives";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.listing_images?.[0]?.url || "/placeholder.svg";
  
  const formatPrice = () => {
    if (listing.price) {
      return (
        <>
          {listing.price.toLocaleString("ar-EG")} ₪
          {listing.type === 'rent' && <span className="text-xs font-medium"> / شهريا</span>}
        </>
      );
    }
    return listing.price_note || "تفاوض";
  };

  const getUtilityStatus = (value: boolean | string) => {
    if (
      value === true ||
      value === "available" ||
      value === "generator" ||
      value === "street_network" ||
      value === "municipal_line"
    ) return "available";
    if (
      value === "limited" ||
      value === "solar" ||
      value === "telecom" ||
      value === "nearby_well"
    ) return "limited";
    return "unavailable";
  };

  const getElectricityLabel = (value: boolean | string) => {
    if (value === "generator") return "مولد";
    if (value === "solar") return "طاقة شمسية";
    if (value === false || value === "unavailable") return "غير متوفر";
    return "كهرباء";
  };

  const getWaterLabel = (value: boolean | string) => {
    if (value === "nearby_well") return "بئر قريب";
    if (value === "municipal_line") return "خط بلدية";
    if (value === false || value === "unavailable") return "غير متوفر";
    return "ماء";
  };

  const getInternetLabel = (value: boolean | string) => {
    if (value === "street_network") return "شبكة شارع";
    if (value === "telecom") return "اتصالات";
    if (value === false || value === "unavailable") return "غير متوفر";
    return "نت";
  };

  return (
    <MotionItem className="h-full">
      <MotionSurface className="h-full">
        <Link to={`/listing/${listing.id}`} className="listing-card block h-full overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <motion.img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.045 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
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
        <h3 className="font-arabic font-medium text-lg mb-2 line-clamp-1">{listing.title}</h3>
        
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
            {getWaterLabel(listing.utilities?.water)}
          </span>
          <span className={`utility-${getUtilityStatus(listing.utilities?.electricity)}`}>
            <Zap className="w-3 h-3" />
            {getElectricityLabel(listing.utilities?.electricity)}
          </span>
          <span className={`utility-${getUtilityStatus(listing.utilities?.internet)}`}>
            <Wifi className="w-3 h-3" />
            {getInternetLabel(listing.utilities?.internet)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xl font-medium text-primary">{formatPrice()}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true, locale: ar })}
          </span>
        </div>
      </div>
        </Link>
      </MotionSurface>
    </MotionItem>
  );
}
