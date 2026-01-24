import "./App.css";

import { useEffect, useMemo, useState } from "react";
import { type FiltersState } from "./components/FiltersPanel";
import { ListingsPanel } from "./components/ListingsPanel";
import { VenezuelaMap } from "./components/VenezuelaMap";
import { ZillowHeader } from "./components/ZillowHeader";
import { listings as allListings } from "./data/listings";
import { configureLeafletDefaultIcons } from "./lib/leafletIcons";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
              onSelect={setSelectedId}
            />
          </div>

          <div className="zResultsPane">
            <ListingsPanel
              isLoading={isLoading}
              listings={filtered}
              selectedId={effectiveSelectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
