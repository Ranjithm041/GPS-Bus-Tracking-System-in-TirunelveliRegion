import { motion } from 'framer-motion';
import { Bus, Users, Clock, ChevronRight, Navigation, MapPin } from 'lucide-react';
import { BusData } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

interface BusCardProps {
  bus: BusData;
  source?: string;
  destination?: string;
  onViewDetails: () => void;
}

const BusCard = ({ bus, source, destination, onViewDetails }: BusCardProps) => {
  const { subscribe, hasSubscription, unsubscribe } = useNotification();
  
  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate remaining time until arrival (simple mock)
  const getArrivalTime = () => {
    return bus.estimatedArrival;
  };

  const handleNotificationToggle = (stopName: string) => {
    if (hasSubscription(bus.id, stopName)) {
      unsubscribe(bus.id, stopName);
    } else {
      subscribe(bus.id, stopName);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-1">
              <Bus className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-semibold text-gray-800">{bus.busNumber}</h3>
            </div>
            <p className="text-sm text-gray-600">{bus.route}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`text-xs px-2 py-1 rounded-full ${getCrowdLevelColor(bus.occupancy.crowdLevel)}`}>
              {bus.occupancy.crowdLevel} Crowd
            </span>
            <span className="text-sm text-gray-600 mt-1">
              {bus.occupancy.availableSeats} seats available
            </span>
          </div>
        </div>
        
        {source && destination && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-2">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div className="w-0.5 h-10 bg-gray-300 mx-auto"></div>
                <div className="w-2 h-2 rounded-full bg-secondary-500"></div>
              </div>
              
              <div className="flex-1">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">{source}</p>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-gray-500 mr-1" />
                    <p className="text-xs text-gray-500">Departing: {bus.estimatedArrival}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">{destination}</p>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                    <p className="text-xs text-gray-500">
                      {bus.stops.indexOf(destination) - bus.stops.indexOf(source)} stops away
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <Navigation className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">Next: {bus.nextStop}</span>
          </div>
          
          <div className="flex space-x-2">
            {source && (
              <button
                onClick={() => handleNotificationToggle(source)}
                className={`text-xs px-2 py-1 rounded-md ${
                  hasSubscription(bus.id, source)
                    ? 'bg-secondary-100 text-secondary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {hasSubscription(bus.id, source) ? 'Notifying' : 'Notify Me'}
              </button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewDetails}
              className="flex items-center text-primary-600 text-sm hover:text-primary-700"
            >
              <span>Details</span>
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusCard;