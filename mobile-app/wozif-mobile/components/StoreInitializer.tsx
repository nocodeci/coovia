import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Store } from '../services/api';

interface StoreInitializerProps {
  selectedStore: Store | null;
  children: React.ReactNode;
}

export const StoreInitializer: React.FC<StoreInitializerProps> = ({ selectedStore, children }) => {
  const { setStoreId } = useStore();

  useEffect(() => {
    if (selectedStore) {
      console.log('🏪 Initialisation du contexte Store avec:', selectedStore.id);
      setStoreId(selectedStore.id);
    } else {
      console.log('❌ Aucune boutique sélectionnée');
      setStoreId(null);
    }
  }, [selectedStore, setStoreId]);

  return <>{children}</>;
};
