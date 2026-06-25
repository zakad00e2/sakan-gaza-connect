import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchFilters, type Filters } from "./SearchFilters";

const filters: Filters = {
  search: "",
  area: "",
  type: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  rooms: "",
  capacity: "",
};

describe("SearchFilters motion", () => {
  it("exposes the advanced-filter open state accessibly", () => {
    render(<SearchFilters filters={filters} onFiltersChange={() => undefined} />);

    const toggle = screen.getByRole("button", { name: "عرض الفلاتر المتقدمة" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.querySelector("#advanced-search-filters")).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
