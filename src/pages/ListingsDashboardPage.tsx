import "../App.css";

import { useEffect, useMemo, useState } from "react";
import { ListingDetailsPanel } from "../components/ListingDetailsPanel";
import { ListingsPanel } from "../components/ListingsPanel";
import { VenezuelaMap } from "../components/VenezuelaMap";
import { ZillowHeader } from "../components/ZillowHeader";
import { listings as allListings } from "../data/listings";
import { configureLeafletDefaultIcons } from "../lib/leafletIcons";
import { type FiltersState } from "../components/FiltersPanel";

export function ListingsDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>({
    query: "",
    city: "All",
    minPrice: 0,
    maxPrice: 400000,
    bedrooms: 0,
    bathrooms: 0,
  });

  useEffect(() => {
    configureLeafletDefaultIcons();
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    for (const l of allListings) set.add(l.city);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return allListings.filter((l) => {
      if (filters.city !== "All" && l.city !== filters.city) return false;
      if (l.priceUsd < filters.minPrice) return false;
      if (l.priceUsd > filters.maxPrice) return false;
      if (filters.bedrooms > 0 && l.bedrooms < filters.bedrooms) return false;
      if (filters.bathrooms > 0 && l.bathrooms < filters.bathrooms)
        return false;

      if (query.length > 0) {
        const haystack = `${l.title} ${l.city} ${l.state}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [filters]);

  const effectiveSelectedId = useMemo(() => {
    if (isLoading) return null;
    if (selectedId && filtered.some((l) => l.id === selectedId))
      return selectedId;
    return filtered[0]?.id ?? null;
  }, [filtered, isLoading, selectedId]);

  const effectiveDetailsId = useMemo(() => {
    if (isLoading) return null;
    if (detailsId && filtered.some((l) => l.id === detailsId)) return detailsId;
    return null;
  }, [detailsId, filtered, isLoading]);

  const detailsListing = useMemo(() => {
    if (!effectiveDetailsId) return null;
    return filtered.find((l) => l.id === effectiveDetailsId) ?? null;
  }, [effectiveDetailsId, filtered]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setDetailsId(id);
  };

  const handleCloseDetails = () => {
    setDetailsId(null);
  };

  return (
    <div className="zApp">
      <ZillowHeader
        isLoading={isLoading}
        cities={cities}
        value={filters}
        onChange={setFilters}
      />

      <main className="zContent">
        <div className="zSplit">
          <div className="zMapPane">
            <VenezuelaMap
              isLoading={isLoading}
              listings={filtered}
              selectedId={effectiveSelectedId}
              onSelect={handleSelect}
            />
          </div>

          <div className="zResultsPane">
            <ListingsPanel
              isLoading={isLoading}
              listings={filtered}
              selectedId={effectiveSelectedId}
              onSelect={handleSelect}
            />
          </div>

          <div
            className={`zDetailsPane ${effectiveDetailsId ? "zDetailsPane--open" : ""}`}
          >
            <ListingDetailsPanel
              isLoading={isLoading}
              listing={detailsListing}
              isOpen={Boolean(effectiveDetailsId)}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
