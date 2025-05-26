import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = 'Page Not Found - Tirunelveli Bus Tracker';
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6 text-center">
          <div className="mb-6">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0] 
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block"
            >
              <MapPin className="h-16 w-16 text-primary-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mt-4">404</h1>
            <p className="text-xl text-gray-600 mt-2">Bus Route Not Found</p>
          </div>
          
          <p className="text-gray-600 mb-6">
            Looks like this bus route doesn't exist or has been discontinued.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Return to Map</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;