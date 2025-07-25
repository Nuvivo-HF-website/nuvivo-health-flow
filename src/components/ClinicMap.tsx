import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';

interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
  rating: number;
  distance: string;
  services: string[];
}

interface ClinicMapProps {
  clinics: Clinic[];
  onClinicSelect?: (clinic: Clinic) => void;
}

const ClinicMap: React.FC<ClinicMapProps> = ({ clinics, onClinicSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [postcode, setPostcode] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-2.2426, 53.4808], // Center of UK
      zoom: 6
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add clinic markers
    clinics.forEach((clinic) => {
      const marker = new mapboxgl.Marker({
        color: '#D86440'
      })
        .setLngLat([clinic.lng, clinic.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${clinic.name}</h3>
              <p class="text-sm text-gray-600">${clinic.address}</p>
              <p class="text-sm">★ ${clinic.rating} • ${clinic.phone}</p>
              <button 
                onclick="window.selectClinic(${clinic.id})" 
                class="mt-2 px-3 py-1 bg-primary text-white rounded text-sm"
              >
                Select Clinic
              </button>
            </div>
          `)
        )
        .addTo(map.current!);
    });

    // Make selectClinic available globally for popup buttons
    (window as any).selectClinic = (clinicId: number) => {
      const clinic = clinics.find(c => c.id === clinicId);
      if (clinic && onClinicSelect) {
        onClinicSelect(clinic);
      }
    };
  };

  const searchPostcode = async () => {
    if (!postcode.trim() || !mapboxToken || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(postcode)}.json?country=GB&access_token=${mapboxToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setUserLocation([lng, lat]);
        
        // Add user location marker
        new mapboxgl.Marker({ color: '#3B82F6' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML('<div class="p-2"><strong>Your Location</strong></div>'))
          .addTo(map.current!);

        // Fly to user location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error geocoding postcode:', error);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Map Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To display the interactive map, please enter your Mapbox public token. 
            You can get one free at <a href="https://mapbox.com" target="_blank" className="text-primary underline">mapbox.com</a>
          </p>
          <Input
            type="text"
            placeholder="Enter Mapbox public token..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button onClick={handleTokenSubmit} className="w-full">
            Load Map
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Postcode Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find Clinics Near You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your postcode (e.g., SW1A 1AA)"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchPostcode()}
            />
            <Button onClick={searchPostcode}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden border">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ClinicMap;