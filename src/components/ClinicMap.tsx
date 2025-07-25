import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const map = useRef<any>(null);
  const [postcode, setPostcode] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapboxgl, setMapboxgl] = useState<any>(null);

  // Dynamically import mapbox-gl to avoid SSR issues
  useEffect(() => {
    const loadMapbox = async () => {
      try {
        const mapboxModule = await import('mapbox-gl');
        await import('mapbox-gl/dist/mapbox-gl.css');
        setMapboxgl(mapboxModule.default);
      } catch (err) {
        setError('Failed to load map library. Please refresh the page.');
      }
    };
    loadMapbox();
  }, []);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      setError('');
      initializeMap();
    } else {
      setError('Please enter a valid Mapbox token');
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || !mapboxgl) return;

    try {
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
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="font-weight: 600; margin-bottom: 4px;">${clinic.name}</h3>
                <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${clinic.address}</p>
                <p style="font-size: 12px; margin-bottom: 8px;">★ ${clinic.rating} • ${clinic.phone}</p>
                <button 
                  onclick="window.selectClinic && window.selectClinic(${clinic.id})" 
                  style="padding: 4px 8px; background: #D86440; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;"
                >
                  Select Clinic
                </button>
              </div>
            `)
          )
          .addTo(map.current);
      });

      // Make selectClinic available globally for popup buttons
      (window as any).selectClinic = (clinicId: number) => {
        const clinic = clinics.find(c => c.id === clinicId);
        if (clinic && onClinicSelect) {
          onClinicSelect(clinic);
        }
      };

      setError('');
    } catch (err) {
      setError('Failed to initialize map. Please check your Mapbox token.');
    }
  };

  const searchPostcode = async () => {
    if (!postcode.trim() || !mapboxToken || !map.current) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(postcode)}.json?country=GB&access_token=${mapboxToken}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search postcode');
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Add user location marker
        new mapboxgl.Marker({ color: '#3B82F6' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML('<div style="padding: 8px;"><strong>Your Location</strong></div>'))
          .addTo(map.current);

        // Fly to user location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          duration: 2000
        });
      } else {
        setError('Postcode not found. Please check and try again.');
      }
    } catch (err) {
      setError('Error searching postcode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
      // Clean up global function
      if ((window as any).selectClinic) {
        delete (window as any).selectClinic;
      }
    };
  }, []);

  if (showTokenInput) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Map Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To display the interactive map, please enter your Mapbox public token. 
            You can get one free at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            type="text"
            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
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
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your postcode (e.g., SW1A 1AA)"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchPostcode()}
              disabled={isLoading}
            />
            <Button onClick={searchPostcode} disabled={isLoading || !postcode.trim()}>
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden border bg-gray-100">
        {!mapboxgl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ClinicMap;