import L from "leaflet";

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
