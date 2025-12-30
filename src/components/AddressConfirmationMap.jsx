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
        // Normalize the address for better geocoding
        const normalizedAddress = address
          .replace(/Av\./gi, 'Avenida')
          .replace(/Nte\./gi, 'Norte')
          .replace(/Sur\./gi, 'South')
          .replace(/Ote\./gi, 'Oriente')
          .replace(/Pte\./gi, 'Poniente')
          .replace(/St\./gi, 'Street')
          .replace(/Dr\./gi, 'Drive');

        console.log('Geocoding address:', normalizedAddress);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(normalizedAddress)}&limit=1&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'RosieRides/1.0'
            }
          }
        );
        const data = await response.json();
        console.log('Geocoding result:', data);

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
          });
        } else {
          console.warn('No geocoding results found for:', normalizedAddress);
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
      <div className="w-full h-64 rounded-2xl bg-red-50 flex items-center justify-center border-2 border-red-200">
        <div className="text-red-600 text-center px-4">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="font-bold">Address Not Found</div>
          <div className="text-sm mt-1">Please verify the address is correct</div>
        </div>
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