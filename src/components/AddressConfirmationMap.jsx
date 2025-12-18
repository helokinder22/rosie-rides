import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AddressConfirmationMap({ address }) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || address.trim().length < 10) {
      setCoordinates(null);
      return;
    }

    const geocodeAddress = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
          {
            headers: {
              'User-Agent': 'RosiesRides/1.0'
            }
          }
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        } else {
          setCoordinates(null);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
        setCoordinates(null);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(geocodeAddress, 1000);
    return () => clearTimeout(timeoutId);
  }, [address]);

  if (!address || address.trim().length < 10) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-64 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-slate-200">
        <div className="text-slate-500">Finding location...</div>
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className="w-full h-64 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-slate-200">
        <div className="text-slate-500">📍 Enter a complete address to see location</div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border-3 border-slate-200 shadow-lg">
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        key={`${coordinates.lat}-${coordinates.lng}`}
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