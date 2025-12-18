import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AddressMap({ address }) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    const geocodeAddress = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        } else {
          setError("Location not found");
        }
      } catch (err) {
        setError("Failed to load map");
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  if (!address) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-slate-500">Loading map...</div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-2xl flex items-center justify-center">
        <div className="text-slate-500">{error || "Unable to show map"}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg border-3 border-slate-200">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}