import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/lib/constants";

const listing: Listing = {
  id: "listing-1",
  title: "شقة للاختبار",
  description: "وصف",
  area: "غزة",
  type: "rent",
  property_type: "apartment",
  price: 500,
  price_note: null,
  rooms: 2,
  capacity: 4,
  floor_area: null,
  contact_name: "Test",
  contact_phone: "000",
  whatsapp_enabled: false,
  status: "active",
  created_at: "2026-06-25T00:00:00.000Z",
  owner_id: "user-1",
  utilities: { water: true, electricity: true, internet: false },
  listing_images: [],
};

describe("ListingCard motion", () => {
  it("keeps the listing link inside an interactive motion surface", () => {
    render(
      <MemoryRouter>
        <ListingCard listing={listing} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /شقة للاختبار/ });
    expect(link).toHaveAttribute("href", "/listing/listing-1");
    expect(link.closest('[data-motion-role="surface"]')).toBeInTheDocument();
    expect(link.closest('[data-motion-role="item"]')).toBeInTheDocument();
  });
});
