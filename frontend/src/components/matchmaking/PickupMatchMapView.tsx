"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export interface PickupMarker {
  id: string;
  lat: number;
  lng: number;
  sportType: string;
  venueName: string;
  captainName: string;
  slotDate: string;
  slotStart: string;
  slotsFilled: number;
  slotsTotal: number;
}

const pickupIcon = L.divIcon({
  className: "",
  html:
    '<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:#10B981;border:2px solid #0F172A;box-shadow:0 0 0 2px #10B981;">' +
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#0F172A" stroke-width="2.5"><circle cx="12" cy="12" r="9"/></svg>' +
    "</div>",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

interface PickupMatchMapViewProps {
  markers: PickupMarker[];
  center: [number, number];
}

export default function PickupMatchMapView({ markers, center }: PickupMatchMapViewProps) {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer center={center} zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={pickupIcon}>
            <Popup>
              <div style={{ fontSize: "12px" }}>
                <strong>{marker.sportType}</strong> at {marker.venueName}
                <br />
                Captain: {marker.captainName}
                <br />
                {new Date(marker.slotDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                {marker.slotStart}
                <br />
                {marker.slotsFilled}/{marker.slotsTotal} slots filled
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
