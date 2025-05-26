import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { busStops } from '../../services/api'; // ✅ Adjust path based on your project structure
import { findBusesOnRoute, BusData } from '../../services/api';
import { useBusData } from '../../hooks/useBusData';
import BusCard from '../BusDetails/BusCard';

const RouteSearch = () => {
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<BusData[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState<boolean>(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState<boolean>(false);

  const { selectBus } = useBusData();

  const locationNames = busStops.map(stop => stop.name);

  const filteredSourceLocations = locationNames.filter(location =>
    location.toLowerCase().includes(source.toLowerCase()) && location !== destination
  );

  const filteredDestinationLocations = locationNames.filter(location =>
    location.toLowerCase().includes(destination.toLowerCase()) && location !== source
  );

  const handleSearch = async () => {
    if (!source || !destination) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const results = await findBusesOnRoute(source, destination);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for buses:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSource('');
    setDestination('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleSourceSelection = (location: string) => {
    setSource(location);
    setShowSourceDropdown(false);
    setHasSearched(false);
  };

  const handleDestinationSelection = (location: string) => {
    setDestination(location);
    setShowDestinationDropdown(false);
    setHasSearched(false);
  };

  const handleSourceFocus = () => setShowSourceDropdown(true);
  const handleDestinationFocus = () => setShowDestinationDropdown(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg shadow-md overflow-hidden border border-primary-100"
    >
      <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500">
        <h2 className="text-lg font-semibold text-white">Find Your Bus</h2>
        <p className="text-primary-100">Search for buses by source and destination</p>
      </div>

      <div className="p-4">
        {/* Source Input */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onFocus={handleSourceFocus}
              placeholder="Enter source location"
              className="w-full p-2 pl-10 border border-primary-200 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all bg-white"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={18} />
          </div>
          {showSourceDropdown && source && filteredSourceLocations.length > 0 && (
            <ul className="absolute z-10 w-full bg-white mt-1 border border-primary-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredSourceLocations.map((location) => (
                <li
                  key={location}
                  className="px-4 py-2 cursor-pointer hover:bg-primary-50 text-gray-700"
                  onClick={() => handleSourceSelection(location)}
                >
                  {location}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination Input */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={handleDestinationFocus}
              placeholder="Enter destination location"
              className="w-full p-2 pl-10 border border-secondary-200 rounded-md focus:ring-2 focus:ring-secondary-300 focus:border-secondary-500 outline-none transition-all bg-white"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
          </div>
          {showDestinationDropdown && destination && filteredDestinationLocations.length > 0 && (
            <ul className="absolute z-10 w-full bg-white mt-1 border border-secondary-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredDestinationLocations.map((location) => (
                <li
                  key={location}
                  className="px-4 py-2 cursor-pointer hover:bg-secondary-50 text-gray-700"
                  onClick={() => handleDestinationSelection(location)}
                >
                  {location}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSearch}
          disabled={!source || !destination || isSearching}
        >
          {isSearching ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search size={18} className="mr-2" />
              <span>Search Buses</span>
            </>
          )}
        </motion.button>

        {/* New Search Button */}
        {hasSearched && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full mt-2 bg-white text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-50 border border-gray-200"
            onClick={resetSearch}
          >
            <span>New Search</span>
          </motion.button>
        )}
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="border-t border-primary-100 p-4 bg-white">
          <h3 className="text-md font-medium text-gray-800 mb-3">
            {searchResults.length > 0
              ? `Found ${searchResults.length} buses from ${source} to ${destination}`
              : `No buses found for this route`}
          </h3>
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  source={source}
                  destination={destination}
                  onViewDetails={() => selectBus(bus.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No direct buses available for this route.</p>
              <p className="text-gray-500 text-sm mt-1">Try a different route or check back later.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default RouteSearch;
