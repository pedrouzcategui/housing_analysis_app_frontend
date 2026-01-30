import L from "leaflet";
import type { Listing } from "../data/listings";

// Fix default marker icons in bundlers like Vite.
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

export function configureLeafletDefaultIcons(): void {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2xUrl as unknown as string,
    iconUrl: markerIconUrl as unknown as string,
    shadowUrl: markerShadowUrl as unknown as string,
  });
}

const listingIconCache = new Map<string, L.DivIcon>();

function glyphForType(type: Listing["propertyType"]): string {
  switch (type) {
    case "apartment":
      return "A";
    case "house":
      return "H";
    case "terrain":
      return "T";
    case "business":
      return "B";
    default:
      return "•";
  }
}

export function getListingMarkerIcon(
  listing: Listing,
  opts?: { selected?: boolean },
): L.DivIcon {
  const selected = Boolean(opts?.selected);
  const key = `${listing.propertyType}|${listing.operation}|${selected ? "sel" : ""}`;
  const cached = listingIconCache.get(key);
  if (cached) return cached;

  const glyph = glyphForType(listing.propertyType);
  const opTag = listing.operation === "rent" ? "R" : "S";

  const icon = L.divIcon({
    className: "zPinIcon",
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
    tooltipAnchor: [0, -34],
    html: `
      <div class="zPin zPin--${listing.propertyType} zPin--${listing.operation} ${selected ? "isSelected" : ""}">
        <div class="zPin__bubble">
          <div class="zPin__glyph" aria-hidden="true">${glyph}</div>
          <div class="zPin__tag" aria-hidden="true">${opTag}</div>
        </div>
        <div class="zPin__stem" aria-hidden="true"></div>
      </div>
    `,
  });

  listingIconCache.set(key, icon);
  return icon;
}
