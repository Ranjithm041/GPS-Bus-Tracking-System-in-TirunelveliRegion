import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow, Polyline } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useBusData } from '../../hooks/useBusData';
import { BusData, busStops ,fetchBusData} from '../../services/api';
import { Navigation, AlertTriangle } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = { lat: 8.7139, lng: 77.7567 };

const mapOptions = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

const routePath = busStops.map(stop => ({
  lat: stop.location.lat,
  lng: stop.location.lng
}));

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const BusMap = () => {
  const { buses, loading, selectedBus, selectBus } = useBusData();
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const stopMarkersRef = useRef([]);
  const [mapError, setMapError] = useState(null);
  const notifiedRef = useRef(new Set());

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const routeOptions = useMemo(() => {
    if (!isLoaded || typeof google === 'undefined') return null;
    return {
      strokeColor: '#1a73e8',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: '#1a73e8',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
          },
          offset: '0',
          repeat: '60px',
        },
      ],
    };
  }, [isLoaded]);

  const showArrivalAlert = (busNumber, stopName) => {
    const key = `${busNumber}-${stopName}`;
    if (notifiedRef.current.has(key)) return;
    notifiedRef.current.add(key);

    alert(`🚍 Bus ${busNumber} is arriving at ${stopName}`);

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`Bus ${busNumber} is arriving at ${stopName}`);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(`Bus ${busNumber} is arriving at ${stopName}`);
          }
        });
      }
    }
  };

  const onLoad = useCallback(map => {
    mapRef.current = map;
    setMapError(null);

    busStops.forEach((stop) => {
      const marker = new google.maps.Marker({
        position: stop.location,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#34A853',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
        },
        title: stop.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${stop.name}</h3>
            <p class="text-sm">Next arrival: ${stop.estimatedArrival}</p>
          </div>
        `
      });

      marker.addListener('click', () => infoWindow.open(map, marker));

      stopMarkersRef.current.push(marker);
    });
  }, []);

  const onUnmount = useCallback(() => {
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    stopMarkersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = {};
    stopMarkersRef.current = [];
    mapRef.current = null;
  }, []);

  const updateMarkers = useCallback((map, currentBuses) => {
    try {
      currentBuses.forEach((bus) => {
        const position = { lat: bus.currentLocation.lat, lng: bus.currentLocation.lng };

        if (markersRef.current[bus.id]) {
          markersRef.current[bus.id].setPosition(position);
        } else {
          const marker = new google.maps.Marker({
            position,
            map,
            icon: {
              path: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
              fillColor: bus.occupancy.crowdLevel === 'High' ? '#EA4335' :
                        bus.occupancy.crowdLevel === 'Medium' ? '#FBBC04' : '#34A853',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#FFFFFF',
              scale: 1.5,
              anchor: isLoaded && google ? new google.maps.Point(10, 10) : undefined,
            },
            title: bus.busNumber,
            optimized: false,
          });

          marker.addListener('click', () => selectBus(bus.id));
          markersRef.current[bus.id] = marker;
        }
      });

      Object.keys(markersRef.current).forEach(id => {
        if (!currentBuses.find(bus => bus.id === id)) {
          markersRef.current[id].setMap(null);
          delete markersRef.current[id];
        }
      });
    } catch (error) {
      console.error('Error updating markers:', error);
      setMapError('Failed to update bus locations on map');
    }
  }, [selectBus, isLoaded]);
useEffect(() => {
  if (!mapRef.current) return;

  const intervalId = setInterval(async () => {
    try {
      // 1. Fetch updated bus data
      const updatedBuses = await fetchBusData();
      setBuses(updatedBuses);

      // 2. Update bus markers on the map
      updateMarkers(mapRef.current, updatedBuses);

      // 3. Check distance to bus stops and show alerts
      updatedBuses.forEach((bus) => {
        busStops.forEach((stop) => {
          const distance = getDistanceInMeters(
            bus.currentLocation.lat,
            bus.currentLocation.lng,
            stop.location.lat,
            stop.location.lng
          );

          if (distance < 150) {
            showArrivalAlert(bus.busNumber, stop.name);
          }
        });
      });

      // 4. Pan map to selected bus (if any)
      if (selectedBus) {
        const matchingBus = updatedBuses.find(b => b.id === selectedBus.id);
        if (matchingBus) {
          mapRef.current.panTo(
            new google.maps.LatLng(
              matchingBus.currentLocation.lat,
              matchingBus.currentLocation.lng
            )
          );
        }
      }
    } catch (err) {
      console.error("❌ Error during map update:", err);
    }
  }, 5000);

  return () => clearInterval(intervalId);
}, [updateMarkers, selectedBus]);


  const infoWindowContent = useMemo(() => {
    if (!selectedBus) return null;
    return (
      <div className="p-2">
        <h3 className="font-semibold text-primary-700">{selectedBus.busNumber}</h3>
        <p className="text-sm">{selectedBus.route}</p>
        <div className="flex items-center mt-1 text-xs text-gray-600">
          <Navigation size={12} className="mr-1" />
          <span>Next stop: {selectedBus.nextStop}</span>
        </div>
        <div className="mt-1 text-xs">
          <span className={`font-medium ${
            selectedBus.occupancy.crowdLevel === 'High' ? 'text-red-600' :
            selectedBus.occupancy.crowdLevel === 'Medium' ? 'text-orange-500' :
            'text-green-600'
          }`}>
            {selectedBus.occupancy.availableSeats} seats available
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-600">
          Speed: {Math.round(selectedBus.speed)} km/h
        </div>
      </div>
    );
  }, [selectedBus]);

  if (loadError) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600">Map Failed to Load</h3>
          <p className="mt-2 text-gray-600">Please check your Google Maps API configuration and billing status.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || (loading && buses.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden shadow-md relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {mapError && (
        <div className="absolute top-4 left-4 bg-red-50 border border-red-200 rounded-md p-3 z-10 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-600">{mapError}</p>
          </div>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {routeOptions && <Polyline path={routePath} options={routeOptions} />}

        {selectedBus && (
          <InfoWindow
            position={{
              lat: selectedBus.currentLocation.lat,
              lng: selectedBus.currentLocation.lng,
            }}
            onCloseClick={() => selectBus('')}
          >
            {infoWindowContent}
          </InfoWindow>
        )}
      </GoogleMap>
    </motion.div>
  );
};

export default BusMap;
