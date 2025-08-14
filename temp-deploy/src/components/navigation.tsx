'use client';

import { ShoppingBag, ChevronDown, Menu } from 'lucide-react';
import { Store } from '@/types/store';

interface NavigationProps {
  store?: Store | null;
}

export function Navigation({ store }: NavigationProps) {
  const storeName = store?.name || "Boutique";
  
  return (
    <header className="fixed top-1 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom de la boutique */}
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{storeName}</h1>
              <div className="text-xs text-slate-500 font-medium">Digital Store</div>
            </div>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 transition-colors duration-200 font-medium">
              <ShoppingBag className="w-4 h-4" />
              <span>Mes achats</span>
            </a>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all duration-200 group">
              <img 
                className="w-5 h-5 rounded-full shadow-sm" 
                src="https://cdn.axazara.com/flags/svg/CI.svg" 
                alt="Côte d'Ivoire"
              />
              <span className="text-sm font-medium text-slate-700">Côte d'Ivoire (F CFA)</span>
              <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
            </button>
          </nav>

          {/* Navigation mobile */}
          <div className="md:hidden flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <img 
                className="w-4 h-4 rounded-full" 
                src="https://cdn.axazara.com/flags/svg/CI.svg" 
                alt="CI"
              />
              <span className="text-xs font-medium text-slate-700">(F CFA)</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
