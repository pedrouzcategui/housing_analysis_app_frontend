import type { Listing } from "../data/listings";
import { formatUsd } from "../lib/format";
import { Skeleton } from "./Skeleton";

type ListingsPanelProps = {
  isLoading: boolean;
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ListingsPanel({
  isLoading,
  listings,
  selectedId,
  onSelect,
}: ListingsPanelProps) {
  return (
    <section className="zResults" aria-label="Listings">
      <div className="zResults__header">
        <div>
          <div className="zResults__title">
            Venezuela Real Estate & Homes For Sale
          </div>
          <div className="zResults__subtitle">
            {isLoading ? "Loading…" : `${listings.length} results`}
          </div>
        </div>

        <div className="zResults__sort">
          <span className="zResults__sortLabel">Sort:</span>
          <select className="zSelect" aria-label="Sort">
            <option>Homes for You</option>
            <option>Newest</option>
            <option>Price (Low to High)</option>
            <option>Price (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="zResults__scroll">
        {isLoading ? (
          <div className="zGrid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="zCard zCard--skeleton">
                <Skeleton className="zCard__imgSkel" style={{ height: 140 }} />
                <div className="zCard__body">
                  <Skeleton style={{ height: 18, width: "45%" }} />
                  <Skeleton
                    style={{ height: 14, width: "75%", marginTop: 10 }}
                  />
                  <Skeleton
                    style={{ height: 14, width: "65%", marginTop: 8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="zEmpty">No results for current filters.</div>
        ) : (
          <div className="zGrid">
            {listings.map((l) => {
              const isSelected = l.id === selectedId;
              return (
                <button
                  key={l.id}
                  type="button"
                  className={`zCard ${isSelected ? "zCard--selected" : ""}`}
                  onClick={() => onSelect(l.id)}
                >
                  <div className="zCard__imgWrap">
                    {l.imageUrl ? (
                      <img
                        className="zCard__img"
                        src={l.imageUrl}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <div className="zCard__imgPlaceholder" />
                    )}
                    <div className="zCard__heart" aria-hidden="true">
                      ♡
                    </div>
                  </div>

                  <div className="zCard__body">
                    <div className="zCard__price">{formatUsd(l.priceUsd)}</div>
                    <div className="zCard__facts">
                      {l.bedrooms} bds | {l.bathrooms} ba | {l.areaM2} m²
                    </div>
                    <div className="zCard__addr">{l.title}</div>
                    <div className="zCard__loc">
                      {l.city}, {l.state}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
