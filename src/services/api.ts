import axios from 'axios';
import { useEffect, useState } from 'react';

// Interfaces
export interface BusData {
  id: string;
  route: string;
  busNumber: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  speed: number;
  direction: number;
  nextStop: string;
  departureTime: string;
  estimatedArrival: string;
  occupancy: {
    totalSeats: number;
    availableSeats: number;
    crowdLevel: 'Low' | 'Medium' | 'High';
    passengerCount: number;
  };
  stops: BusStop[];
}

export interface BusStop {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  estimatedArrival: string;
  departureTime: string;
}

export interface FeedbackData {
  id: string;
  busNumber: string;
  rating: number;
  review: string;
  timelyArrival: boolean;
  cleanliness: number;
  driverBehavior: number;
  createdAt: string;
}

// Bus Stops
export const busStops: BusStop[] = [
  { name: 'MGR New Bus Stand', location: { lat: 8.703608, lng: 77.727452 }, estimatedArrival: '10:00 AM', departureTime: '10:05 AM' },
  { name: 'NGO Colony Bus Stop', location: { lat: 8.696473, lng: 77.727235 }, estimatedArrival: '10:15 AM', departureTime: '10:17 AM' },
  { name: 'GCE Bus Stop', location: { lat: 8.685407, lng: 77.724927 }, estimatedArrival: '10:25 AM', departureTime: '10:27 AM' },
  { name: 'Tuckerammalpuram Bus Stop', location: { lat: 8.675301, lng: 77.720583 }, estimatedArrival: '10:35 AM', departureTime: '10:37 AM' },
  { name: 'Munnirpallam Jothipuram Bus Stop', location: { lat: 8.66584, lng: 77.716508 }, estimatedArrival: '10:45 AM', departureTime: '10:47 AM' }
];

// Mock Data
const mockBuses: BusData[] = [
  {
    id: 'Sunthara Travels',
    route: 'MGR Bus Stand - Munnirpallam',
    busNumber: 'TN72-M5267',
    currentLocation: { lat: 8.703608, lng: 77.727452 },
    speed: 0,
    direction: 0,
    nextStop: 'NGO Colony Bus Stop',
    departureTime: '10:00 AM',
    estimatedArrival: '10:45 AM',
    occupancy: {
      totalSeats: 40,
      availableSeats: 15,
      crowdLevel: 'Medium',
      passengerCount: 25
    },
    stops: busStops
  }
];

// ETA Calculation
const calculateEstimatedTime = (currentLocation: { lat: number; lng: number }, targetLocation: { lat: number; lng: number }, speed: number): string => {
  const R = 6371;
  const dLat = (targetLocation.lat - currentLocation.lat) * Math.PI / 180;
  const dLon = (targetLocation.lng - currentLocation.lng) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(currentLocation.lat * Math.PI / 180) * Math.cos(targetLocation.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const timeInMinutes = speed > 0 ? (distance / speed) * 60 : 0;
  const now = new Date();
  now.setMinutes(now.getMinutes() + Math.floor(timeInMinutes));

  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Distance in meters
const getDistanceInMeters = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Geofence Detection
const GEOFENCE_RADIUS = 100;
const checkGeofenceTrigger = (bus: BusData): string[] => {
  const triggeredStops: string[] = [];

  for (const stop of bus.stops) {
    const distance = getDistanceInMeters(bus.currentLocation.lat, bus.currentLocation.lng, stop.location.lat, stop.location.lng);

    if (distance <= GEOFENCE_RADIUS) {
      triggeredStops.push(stop.name);
      console.log(`🟢 Bus "${bus.busNumber}" is near or reached "${stop.name}" (${distance.toFixed(1)} m)`);
    }
  }

  return triggeredStops;
};

// ThingSpeak Config
// const CHANNEL_ID = "2942972";
// const THINGSPEAK_READ_API = "PI7N9Q06LVQEAVLZ";
// const THINGSPEAK_API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${THINGSPEAK_READ_API}`;

// Fetch Bus Data


const GPS_CHANNEL_ID = "2942972";
const GPS_API_KEY = "PI7N9Q06LVQEAVLZ";

const SEAT_CHANNEL_ID = "2941149";
const SEAT_API_KEY = "P1517I2UNFURBCBT";

export const fetchBusData = async (): Promise<BusData[]> => {
  try {
    // 1. Fetch GPS Data
    const gpsResponse = await axios.get(`https://api.thingspeak.com/channels/${GPS_CHANNEL_ID}/feeds.json?api_key=${GPS_API_KEY}&results=1`);
    const gpsFeed = gpsResponse.data.feeds[0];
    const lat = parseFloat(gpsFeed.field1); // Latitude
    const lng = parseFloat(gpsFeed.field2); // Longitude
    const speed = parseFloat(gpsFeed.field3); // Speed

    console.log("✅ GPS Data:", lat, lng, speed);

    // 2. Fetch Seat Availability Data
    const seatResponse = await axios.get(`https://api.thingspeak.com/channels/${SEAT_CHANNEL_ID}/feeds.json?api_key=${SEAT_API_KEY}&results=1`);
    const seatFeed = seatResponse.data.feeds[0];
    const totalSeats = parseInt(seatFeed.field1, 10);      // Total seats
    // const totalSeats = 54;      // Total seats
    const occupiedSeats = parseInt(seatFeed.field2, 10);    // Occupied seats
    const availableSeats = parseInt(seatFeed.field3, 10);   // Available seats
    // const availableSeats = 54;   // Available seats

    console.log("✅ Seat Data:", totalSeats, occupiedSeats, availableSeats);

    // 3. Update each bus with this data
    return mockBuses.map(bus => {
      const nextStop = bus.stops.find(stop => stop.name === bus.nextStop) || bus.stops[bus.stops.length - 1];

      const updatedStops = bus.stops.map(stop => ({
        ...stop,
        estimatedArrival: calculateEstimatedTime({ lat, lng }, stop.location, speed)
      }));

      const updatedBus: BusData = {
        ...bus,
        currentLocation: { lat, lng },
        speed,
        estimatedArrival: calculateEstimatedTime({ lat, lng }, nextStop.location, speed),
        stops: updatedStops,
        occupancy: {
          totalSeats,
          availableSeats,
          passengerCount: occupiedSeats,
          crowdLevel:
            availableSeats < 10 ? 'High' :
            availableSeats < 20 ? 'Medium' : 'Low'
        }
      };

      checkGeofenceTrigger(updatedBus);
      return updatedBus;
    });

  } catch (error) {
    console.error("❌ Error fetching ThingSpeak data:", error);
    return mockBuses;
  }
};


// Main Tracker Component
export const BusTracker = () => {
  const [buses, setBuses] = useState<BusData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const updatedBuses = await fetchBusData();
      setBuses(updatedBuses);
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Every 5 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  // return (
  //   <div>
  //     <h2>🚍 Live Bus Data</h2>
  //     {buses.map(bus => (
  //       <div key={bus.id}>
  //         <h3>{bus.busNumber}</h3>
  //         <p>Current Location: {bus.currentLocation.lat.toFixed(5)}, {bus.currentLocation.lng.toFixed(5)}</p>
  //         <p>Speed: {bus.speed} km/h</p>
  //         <p>Next Stop: {bus.nextStop}</p>
  //         <p>Estimated Arrival: {bus.estimatedArrival}</p>
  //         <p>Crowd Level: {bus.occupancy.crowdLevel}</p>
  //       </div>
  //     ))}
  //   </div>
  // );
};

// Feedback submission
export const submitFeedback = async (feedback: Omit<FeedbackData, 'id' | 'createdAt'>): Promise<FeedbackData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newFeedback: FeedbackData = {
        ...feedback,
        id: `FB${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      resolve(newFeedback);
    }, 500);
  });
};

// Find Buses on Route
export const findBusesOnRoute = async (source: string, destination: string): Promise<BusData[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const buses = mockBuses.filter(bus => {
        const stopNames = bus.stops.map(stop => stop.name);
        const sourceIndex = stopNames.indexOf(source);
        const destIndex = stopNames.indexOf(destination);
        return sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex;
      });
      resolve(buses);
    }, 700);
  });
};

// Export Locations
export const locations = busStops.map(stop => stop.location);
