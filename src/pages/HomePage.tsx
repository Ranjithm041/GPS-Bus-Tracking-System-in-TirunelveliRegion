import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BusMap from '../components/Map/BusMap';
import RouteSearch from '../components/RouteSearch/RouteSearch';
import BusDetailPanel from '../components/BusDetails/BusDetailPanel';
import { useBusData } from '../hooks/useBusData';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import EntranceAnimation from '../components/UI/EntranceAnimation';
import newbusstand from '../assets/newbusstand.png';

const HomePage = () => {
  const { buses, loading, selectedBus, selectBus } = useBusData();
  const [showEntrance, setShowEntrance] = useState(true);
  
  useEffect(() => {
    document.title = 'Tirunelveli Bus Tracker - GPS Real-time Tracking';
    const timer = setTimeout(() => {
      setShowEntrance(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseBusDetails = () => {
    selectBus('');
  };

  if (showEntrance) {
    return <EntranceAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-x-hidden">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section with Tirunelveli Image */}
        <div className="relative h-[30vh] md:h-[40vh] mb-8 rounded-xl overflow-hidden">
          <img
            // src="https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg"
            src={newbusstand}
            alt="Tirunelveli Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Tirunelveli Bus Tracker</h1>
              <p className="text-lg md:text-xl">Real-time GPS tracking for your journey</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Route Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RouteSearch />
          </motion.div>

          {/* Map Section */}
          {!loading && buses.length > 0 && (
            <div
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-full h-[60vh] md:h-[80vh]"
              style={{ overflow: 'hidden' }} // Ensuring no horizontal scroll
            >
              <BusMap />
            </div>
          )}

          {/* Loading Indicator */}
          {loading && !buses.length && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}

          {/* Bus Details Panel */}
          <AnimatePresence>
          {selectedBus && buses.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
    <BusDetailPanel 
      bus={selectedBus} 
      onClose={handleCloseBusDetails}
    />
  </motion.div>
)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
