import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { fetchBusData, BusData } from '../services/api';

interface BusDataContextType {
  buses: BusData[];
  loading: boolean;
  error: string | null;
  selectedBus: BusData | null;
  selectBus: (busId: string) => void;
  refreshData: () => Promise<void>;
}

export const BusDataContext = createContext<BusDataContextType>({
  buses: [],
  loading: false,
  error: null,
  selectedBus: null,
  selectBus: () => {},
  refreshData: async () => {},
});

interface BusDataProviderProps {
  children: ReactNode;
}

export const BusDataProvider = ({ children }: BusDataProviderProps) => {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBusData();
      setBuses(data);

      // Update selected bus if it exists in new data
      if (selectedBusId) {
        const updatedBus = data.find(bus => bus.id === selectedBusId);
        if (!updatedBus) setSelectedBusId(null); // if bus no longer exists
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bus data');
    } finally {
      setLoading(false);
    }
  }, [selectedBusId]);

  const selectBus = (busId: string) => {
    setSelectedBusId(busId);
  };

  const selectedBus = selectedBusId
    ? buses.find(bus => bus.id === selectedBusId) || null
    : null;
    

  useEffect(() => {
   refreshData();
    // const interval = setInterval(refreshData, 5000);
    // return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <BusDataContext.Provider
      value={{
        buses,
        loading,
        error,
        selectedBus,
        selectBus,
        refreshData,
      }}
    >
      {children}
    </BusDataContext.Provider>
  );
};
