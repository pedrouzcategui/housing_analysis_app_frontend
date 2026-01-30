import type { Listing } from "../data/listings";
import { formatUsd } from "../lib/format";
import { Skeleton } from "./Skeleton";

function titleCase(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

function propertyLabel(type: Listing["propertyType"]): string {
  switch (type) {
    case "apartment":
      return "Apartment";
    case "house":
      return "House";
    case "terrain":
      return "Terrain";
    case "business":
      return "Business";
    default:
      return titleCase(type);
  }
}

export type ListingDetailsPanelProps = {
  isLoading: boolean;
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ListingDetailsPanel({
  isLoading,
  listing,
  isOpen,
  onClose,
}: ListingDetailsPanelProps) {
  return (
    <aside
      className={`zDetails ${isOpen ? "zDetails--open" : ""}`}
      aria-label="Listing details"
    >
      <div className="zDetails__header">
        <div className="zDetails__headerTitle">Home details</div>
        <button
          type="button"
          className="zDetails__close"
          onClick={onClose}
          aria-label="Close details"
        >
          ✕
        </button>
      </div>

      <div className="zDetails__scroll">
        {isLoading ? (
          <div className="zDetails__loading">
            <Skeleton className="skeleton--md" style={{ height: 220 }} />
            <div style={{ marginTop: 12 }}>
              <Skeleton style={{ height: 22, width: "55%" }} />
              <Skeleton style={{ height: 14, width: "80%", marginTop: 10 }} />
              <Skeleton style={{ height: 14, width: "65%", marginTop: 8 }} />
            </div>
          </div>
        ) : !listing ? (
          <div className="zDetails__empty">
            Click a listing card or a map pin to see details.
          </div>
        ) : (
          <div className="zDetails__content">
            <div className="zDetails__hero">
              <div className="zDetails__imgWrap">
                {listing.imageUrl ? (
                  <img
                    className="zDetails__img"
                    src={listing.imageUrl}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <div className="zDetails__imgPlaceholder" />
                )}

                <div className="zDetails__badges" aria-label="Listing badges">
                  <span className={`zBadge zBadge--${listing.operation}`}>
                    {listing.operation === "rent" ? "For rent" : "For sale"}
                  </span>
                  <span className={`zBadge zBadge--type zBadge--${listing.propertyType}`}>
                    {propertyLabel(listing.propertyType)}
                  </span>
                </div>
              </div>
            </div>

            <div className="zDetails__main">
              <div className="zDetails__priceRow">
                <div className="zDetails__price">{formatUsd(listing.priceUsd)}</div>
                <div className="zDetails__addr">
                  {listing.title}
                  <div className="zDetails__loc">
                    {listing.city}, {listing.state}
                  </div>
                </div>
              </div>

              <div className="zDetails__facts" aria-label="Facts">
                <div className="zStat">
                  <div className="zStat__value">
                    {listing.bedrooms > 0 ? listing.bedrooms : "—"}
                  </div>
                  <div className="zStat__label">beds</div>
                </div>
                <div className="zStat">
                  <div className="zStat__value">
                    {listing.bathrooms > 0 ? listing.bathrooms : "—"}
                  </div>
                  <div className="zStat__label">baths</div>
                </div>
                <div className="zStat">
                  <div className="zStat__value">{listing.areaM2}</div>
                  <div className="zStat__label">m²</div>
                </div>
              </div>

              <div className="zDetails__ctaRow">
                <button type="button" className="zSecondaryBtn">
                  Contact agent
                </button>
                <button type="button" className="zPrimaryBtn">
                  Request a tour
                </button>
              </div>

              <div className="zDetails__section">
                <div className="zDetails__sectionTitle">What’s special</div>
                <div className="zDetails__sectionBody">
                  A clean, Zillow-style details panel. Hook this up to real listing
                  descriptions, amenities, and gallery data when ready.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
