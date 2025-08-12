import React from 'react';
import { Store } from '../services/storeService';

interface StoreHeaderProps {
  store: Store;
  subdomain: string;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ store, subdomain }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {store.logo && (
              <img 
                src={store.logo} 
                alt={`Logo ${store.name}`}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{store.name}</h1>
              {store.description && (
                <p className="text-sm text-gray-500">{store.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {subdomain}.wozif.store
            </span>
            <a 
              href="https://wozif.store" 
              className="text-sm text-green-600 hover:text-green-700 underline"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
