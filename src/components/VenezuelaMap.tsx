import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Listing } from "../data/listings";
import { formatUsd } from "../lib/format";
import { Skeleton } from "./Skeleton";

const venezuelaCenter: [number, number] = [7.2, -66.3];
const venezuelaBounds: [[number, number], [number, number]] = [
  [0.7, -73.6],
  [12.6, -59.8],
];

function MapEffects({ selected }: { selected: Listing | undefined }) {
  const map = useMap();

  useEffect(() => {
    // Leaflet sometimes needs a resize pass when inside flex layouts.
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 8), {
      duration: 0.6,
    });
  }, [map, selected]);

  return null;
}

type VenezuelaMapProps = {
  isLoading: boolean;
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function VenezuelaMap({
  isLoading,
  listings,
  selectedId,
  onSelect,
}: VenezuelaMapProps) {
  const selected = useMemo(
    () => listings.find((l) => l.id === selectedId),
    [listings, selectedId],
  );

  return (
    <section className="zMap" aria-label="Map">
      <div className="zMap__wrap">
        <MapContainer
          className="zLeaflet"
          center={venezuelaCenter}
          zoom={6}
          minZoom={5}
          maxZoom={13}
          maxBounds={venezuelaBounds}
          maxBoundsViscosity={0.9}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {listings.map((l) => (
            <Marker
              key={l.id}
              position={[l.lat, l.lng]}
              eventHandlers={{
                click: () => onSelect(l.id),
              }}
            >
              <Popup>
                <div className="popup">
                  <div className="popup__title">{l.title}</div>
                  <div className="popup__meta">
                    {l.city}, {l.state}
                  </div>
                  <div className="popup__meta">{formatUsd(l.priceUsd)}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapEffects selected={selected} />
        </MapContainer>

        {isLoading ? (
          <div className="zMapOverlay" aria-label="Map loading">
            <div className="zMapOverlay__inner">
              <Skeleton style={{ height: 22, width: 170 }} />
              <Skeleton style={{ height: 14, width: 240, marginTop: 10 }} />
              <Skeleton style={{ height: 14, width: 210, marginTop: 8 }} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
