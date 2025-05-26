import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBusData } from '../hooks/useBusData';
import BusDetailPanel from '../components/BusDetails/BusDetailPanel';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const BusDetailsPage = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { buses, loading, selectedBus, selectBus } = useBusData();
  
  useEffect(() => {
    if (id) {
      selectBus(id);
    }
    
    return () => {
      // Clear selected bus when leaving
      selectBus('');
    };
  }, [id, selectBus]);
  
  useEffect(() => {
    if (selectedBus) {
      document.title = `Bus ${selectedBus.busNumber} - Tirunelveli Bus Tracker`;
    }
  }, [selectedBus]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  if (loading && !selectedBus) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!selectedBus) {
    return (
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={handleBack}
          className="flex items-center text-primary-600 mb-4 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Map</span>
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Bus Not Found</h2>
          <p className="text-gray-600">The bus you're looking for doesn't exist or is no longer active.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={handleBack}
        className="flex items-center text-primary-600 mb-4 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Map</span>
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BusDetailPanel 
          bus={selectedBus} 
          onClose={handleBack}
        />
      </motion.div>
    </div>
  );
};

export default BusDetailsPage;