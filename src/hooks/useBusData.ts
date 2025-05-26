import { useContext } from 'react';
import { BusDataContext } from '../contexts/BusDataContext';

export function useBusData() {
  const context = useContext(BusDataContext);
  
  if (context === undefined) {
    throw new Error('useBusData must be used within a BusDataProvider');
  }
  
  return context;
}