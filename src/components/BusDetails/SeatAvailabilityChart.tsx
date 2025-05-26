import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SeatAvailabilityChart = () => {
  const [total, setTotal] = useState(0);
  const [available, setAvailable] = useState(0);
  const [occupied, setOccupied] = useState(0);
  const [animatedAvailable, setAnimatedAvailable] = useState(0);

  const percentage = total ? (available / total) * 100 : 0;

  const getColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Fetch data from ThingSpeak
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://api.thingspeak.com/channels/2941149/feeds.json?api_key=P1517I2UNFURBCBT&results=1'
        );
        const data = await res.json();
        const latest = data.feeds[0];

        const totalSeats = parseInt(latest.field1);
        const occupiedSeats = parseInt(latest.field2);
        const availableSeats = parseInt(latest.field3);

        setTotal(totalSeats);
        setOccupied(occupiedSeats);
        setAvailable(availableSeats);
        setAnimatedAvailable(0);

        const interval = setInterval(() => {
          setAnimatedAvailable((prev) => {
            if (prev >= availableSeats) {
              clearInterval(interval);
              return availableSeats;
            }
            return prev + 1;
          });
        }, 50);
      } catch (err) {
        console.error('Failed to fetch ThingSpeak data:', err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Update every 10 sec
    return () => clearInterval(intervalId);
  }, []);

  // Generate seat layout
  const seatRows = 4;
  const seats = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    isAvailable: i < available,
  }));

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-lg font-semibold">{animatedAvailable}</span>
          <span className="text-gray-600 text-sm"> / {total} seats available</span>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            percentage > 50
              ? 'bg-green-100 text-green-800'
              : percentage > 20
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {Math.round(percentage)}% Available
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <motion.div
          className={`h-2.5 rounded-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-2 rounded-md">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Seat Layout</h4>
          <div className="grid grid-cols-8 gap-1">
            {seats.map((seat) => (
              <motion.div
                key={seat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: seat.id * 0.01, ease: 'easeOut' }}
                className={`aspect-square rounded-sm ${
                  seat.isAvailable
                    ? 'bg-green-200 border border-green-300'
                    : 'bg-red-200 border border-red-300'
                }`}
              />
            ))}
          </div>
        </div>
{/* 
        <div className="bg-gray-50 p-2 rounded-md">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Camera Feed</h4>
          <div className="relative h-24 bg-gray-300 rounded overflow-hidden flex items-center justify-center">
            <div className="text-xs text-gray-600">Live feed from YOLOv5 detection</div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black bg-opacity-50 text-white text-xs">
              Detecting: {occupied} passengers
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SeatAvailabilityChart;
