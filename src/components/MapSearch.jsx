import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Locate } from "lucide-react";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        
        if (data && data.address) {
          onLocationSelect({
            lat,
            lng,
            address: data.address
          });
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    }
  });
  return null;
}

function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  
  return null;
}

export default function MapSearch({ onAddressSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default: San Francisco
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("Location access denied, using default location");
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lon);
        
        setMapCenter([lat, lng]);
        setMarkerPosition([lat, lng]);
        
        if (location.address) {
          handleLocationSelect({
            lat,
            lng,
            address: location.address
          });
        }
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleLocationSelect = (location) => {
    const address = location.address;
    
    // Parse the address data
    const number = address.house_number || "";
    const street = address.road || address.street || "";
    const city = address.city || address.town || address.village || "";
    const state = address.state || "";
    const zip = address.postcode || "";
    
    setMarkerPosition([location.lat, location.lng]);
    setSelectedAddress([number, street, city, state, zip].filter(Boolean).join(", "));
    
    onAddressSelect({
      number,
      street,
      city,
      state,
      zip
    });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter([lat, lng]);
          
          // Reverse geocode current location
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.address) {
              handleLocationSelect({
                lat,
                lng,
                address: data.address
              });
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
          }
        },
        (error) => {
          alert("Unable to access your location");
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for an address..."
          className="h-12 text-lg px-4 border-2 border-slate-200 rounded-xl"
        />
        <Button
          type="button"
          onClick={handleSearch}
          className="h-12 px-6 bg-blue-500 hover:bg-blue-600"
        >
          <Search className="w-5 h-5" />
        </Button>
        <Button
          type="button"
          onClick={handleUseMyLocation}
          variant="outline"
          className="h-12 px-6 border-2"
        >
          <Locate className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border-3 border-slate-200">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPosition && (
            <Marker position={markerPosition}>
              <Popup open>{selectedAddress}</Popup>
            </Marker>
          )}
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <MapUpdater center={mapCenter} />
        </MapContainer>
      </div>
      
      <p className="text-sm text-slate-500 italic">
        💡 Tip: Click anywhere on the map to select a location
      </p>
    </div>
  );
}