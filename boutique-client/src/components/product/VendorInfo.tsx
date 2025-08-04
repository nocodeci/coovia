import React from 'react'
import { StarIcon, ExternalLinkIcon, MessageCircleIcon } from 'lucide-react'
import { Store } from '../../services/api';

interface VendorInfoProps {
  store: Store;
}

const VendorInfo: React.FC<VendorInfoProps> = ({ store }) => {
  // Générer les initiales du nom de la boutique
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Données simulées pour le vendor
  const vendor = {
    name: store.name,
    logo: store.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&background=6366f1&color=fff&size=64`,
    since: '2023',
    rating: 4.9,
    productCount: 12 // Valeur par défaut, peut être mise à jour via API
  };

  return (
    <div className="mt-10 border-t border-gray-100 pt-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Vendu par</h3>
      <div className="flex flex-col sm:flex-row sm:items-center bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h4 className="text-base font-bold text-gray-900">{vendor.name}</h4>
            <div className="mt-1 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(vendor.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }
                  />
                ))}
              </div>
              <span className="ml-1 text-xs font-medium text-gray-700">
                {vendor.rating}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Membre depuis {vendor.since} • {vendor.productCount} produits
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-auto flex space-x-3">
          <button className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-all shadow-sm">
            <MessageCircleIcon size={16} />
            <span>Contacter</span>
          </button>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 hover:bg-blue-100 transition-all">
            <ExternalLinkIcon size={16} />
            <span>Voir boutique</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default VendorInfo 