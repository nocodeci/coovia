import React from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';

interface FooterProps {
  store: any;
}

function Footer({ store }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <a className="flex items-center" href="/">
              <div className="flex items-center mr-2">
                <div className="mr-2 w-8 h-8 flex items-center justify-center text-white bg-slate-900 rounded">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {store?.name || 'Boutique'}
                </div>
              </div>
            </a>
            
            {/* Language Picker */}
            <button className="cursor-pointer hover:bg-slate-50 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                🇫🇷<span className="text-sm">Français</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <span className="text-lg font-medium text-slate-700">Liens</span>
            <div className="flex flex-col gap-2">
              <a className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors" href="#">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm">Mes achats</span>
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <span className="text-lg font-medium text-slate-700">Légal</span>
            <div className="flex flex-col gap-2">
              <a className="text-sm text-slate-600 hover:text-slate-900 transition-colors" href="#">
                Politique de confidentialité
              </a>
              <a className="text-sm text-slate-600 hover:text-slate-900 transition-colors" href="#">
                Conditions d'utilisation
              </a>
              <a className="text-sm text-slate-600 hover:text-slate-900 transition-colors" href="#">
                Mentions légales
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Ce site n'est en aucun cas affilié à Facebook ou Meta. Nous utilisons la publicité pour promouvoir nos contenus et produits/services auprès d'un public plus large. Les informations fournies sur ce site sont uniquement à titre informatif et ne constituent pas un conseil professionnel ou financier.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-600 text-sm">
            <span>
              {store?.name || 'Boutique'} © 2025 Tous droits réservés.
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 text-white py-2 px-4 rounded-full">
            <span className="text-xs font-medium">Powered by</span>
            <a className="text-sm font-bold hover:text-green-400 transition-colors" href="#" target="_blank">
              Coovia
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 