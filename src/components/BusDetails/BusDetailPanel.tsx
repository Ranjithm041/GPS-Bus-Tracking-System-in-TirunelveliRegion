import { motion } from 'framer-motion';
import { X, Bus, MapPin, Navigation, Users, Clock, AlarmCheck } from 'lucide-react';
import { BusData } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import SeatAvailabilityChart from './SeatAvailabilityChart';
import FeedbackForm from '../Feedback/FeedbackForm';

interface BusDetailPanelProps {
  bus: BusData;
  onClose: () => void;
}

const BusDetailPanel = ({ bus, onClose }: BusDetailPanelProps) => {
  const { subscribe, hasSubscription, unsubscribe, notificationsEnabled } = useNotification();

  const getNextStopName = () => {
    return typeof bus.nextStop === 'string' ? bus.nextStop : bus.nextStop.name;
  };

  const calculateRoute = () => {
    return bus.stops.map((stopObj, index) => {
      const hour = 10 + Math.floor(index / 2);
      const minute = (index % 2) * 30;
      const time = `${hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;

      const nextStopName = getNextStopName();
      const stopName = stopObj.name;

      return {
        name: stopName,
        time: time,
        status:
          index === 0
            ? 'departed'
            : nextStopName === stopName
            ? 'next'
            : index < bus.stops.findIndex((s) => s.name === nextStopName)
            ? 'passed'
            : 'upcoming',
      };
    });
  };

  const routeStops = calculateRoute();

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
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-primary-500 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bus className="h-6 w-6 mr-2" />
          <div>
            <h2 className="font-semibold text-lg">{bus.busNumber}</h2>
            <p className="text-sm text-primary-100">{bus.route}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-primary-600 rounded-full transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-primary-50 p-3 rounded-lg">
            <div className="flex items-center mb-1 text-primary-700">
              <Navigation className="h-4 w-4 mr-1" />
              <h3 className="font-medium">Current Status</h3>
            </div>
            <p className="text-sm text-gray-700">
              Currently near <span className="font-medium">{getNextStopName()}</span>
            </p>
            <p className="text-sm text-gray-700">
              Speed: <span className="font-medium">{bus.speed} km/h</span>
            </p>
            <p className="text-sm text-gray-700">
              Next arrival: <span className="font-medium">{bus.estimatedArrival}</span>
            </p>
          </div>

          <div className="bg-secondary-50 p-3 rounded-lg">
            <div className="flex items-center mb-1 text-secondary-700">
              <Users className="h-4 w-4 mr-1" />
              <h3 className="font-medium">Seat Availability</h3>
            </div>
            <p className="text-sm text-gray-700">
              Available: <span className="font-medium">{bus.occupancy.availableSeats} seats</span>
            </p>
            <p className="text-sm text-gray-700">
              Total capacity: <span className="font-medium">{bus.occupancy.totalSeats} seats</span>
            </p>
            <p className="text-sm text-gray-700">
              Crowd level:{' '}
              <span
                className={`font-medium ${
                  bus.occupancy.crowdLevel === 'High'
                    ? 'text-red-600'
                    : bus.occupancy.crowdLevel === 'Medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {bus.occupancy.crowdLevel}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Seat Availability Visualization</h3>
          <SeatAvailabilityChart total={bus.occupancy.totalSeats} available={bus.occupancy.availableSeats} />
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-3">Bus Route & Schedule</h3>
          <div className="space-y-6">
            {routeStops.map((stop, index) => (
              <div key={`${stop.name}-${index}`} className="flex">
                <div className="flex flex-col items-center mr-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      stop.status === 'departed'
                        ? 'bg-primary-500'
                        : stop.status === 'next'
                        ? 'bg-accent-500 animate-pulse'
                        : stop.status === 'passed'
                        ? 'bg-gray-400'
                        : 'bg-gray-300'
                    }`}
                  ></div>
                  {index < routeStops.length - 1 && (
                    <div
                      className={`w-0.5 h-16 ${
                        stop.status === 'departed' || stop.status === 'passed'
                          ? 'bg-gray-400'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`font-medium ${
                        stop.status === 'next'
                          ? 'text-accent-700'
                          : stop.status === 'departed' || stop.status === 'passed'
                          ? 'text-gray-600'
                          : 'text-gray-800'
                      }`}
                    >
                      {stop.name}
                    </p>
                    <p className="text-sm text-gray-500">{stop.time}</p>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <p
                      className={`text-xs ${
                        stop.status === 'departed'
                          ? 'text-primary-600'
                          : stop.status === 'next'
                          ? 'text-accent-600 font-medium'
                          : stop.status === 'passed'
                          ? 'text-gray-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {stop.status === 'departed'
                        ? 'Departed'
                        : stop.status === 'next'
                        ? 'Arriving Next'
                        : stop.status === 'passed'
                        ? 'Passed'
                        : 'Upcoming'}
                    </p>

                    {stop.status !== 'departed' && stop.status !== 'passed' && (
                      <button
                        onClick={() => handleNotificationToggle(stop.name)}
                        className={`text-xs px-2 py-1 rounded-md flex items-center ${
                          hasSubscription(bus.id, stop.name)
                            ? 'bg-secondary-100 text-secondary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                        disabled={!notificationsEnabled}
                      >
                        <AlarmCheck className="h-3 w-3 mr-1" />
                        {hasSubscription(bus.id, stop.name) ? 'Notifying' : 'Notify Me'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Leave Your Feedback</h3>
          <FeedbackForm busNumber={bus.busNumber} onSubmit={onClose} />
        </div>
      </div>
    </motion.div>
  );
};

export default BusDetailPanel;
