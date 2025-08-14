'use client';

import React, { useState, useEffect } from 'react';
import { Store } from '@/types/store';
import { MapPin, Calendar, Star, Heart, MessageCircle, Share2, TrendingUp, Award, Shield } from 'lucide-react';

interface StoreBannerProps {
  store: Store;
}

export function StoreBanner({ store }: StoreBannerProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
    });
  };

  // Générer les initiales du nom de la boutique
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background - Hauteur réduite sur mobile */}
      <div className="relative h-80 sm:h-80 md:h-96 lg:h-[28rem] bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        {/* Floating Elements - Réduits sur mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-2 left-2 sm:top-10 sm:left-10 w-12 h-12 sm:w-32 sm:h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-4 right-2 sm:top-20 sm:right-20 w-10 h-10 sm:w-24 sm:h-24 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-4 left-1/4 w-16 h-16 sm:w-40 sm:h-40 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:24px_24px]"></div>
        </div>

        {/* Main Content - Layout corrigé pour desktop */}
        <div className="relative z-20 h-full flex items-end" style={{ transform: `translateY(${Math.min(scrollY * 0.1, 20)}px)` }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full pb-4 sm:pb-6 md:pb-8 lg:pb-12">
            <div className="flex flex-col items-center lg:flex-row lg:items-end gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              
              {/* Store Logo - À gauche sur desktop */}
              <div className="relative group lg:flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center border border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                    {store.logo ? (
                      <img 
                        src={store.logo} 
                        alt={`Logo de ${store.name}`}
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-lg sm:rounded-xl md:rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-white text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold">
                        {getInitials(store.name)}
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badge - Taille réduite mobile */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 transform transition-all duration-300 group-hover:scale-110">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-lg border-2 border-white">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="hidden sm:inline">{store.status === 'active' ? 'Active' : 'En attente'}</span>
                      <span className="sm:hidden">{store.status === 'active' ? 'A' : 'E'}</span>
                    </div>
                  </div>

                  {/* Verification Badge - Taille réduite mobile */}
                  <div className="absolute -bottom-0.5 -left-0.5 sm:-bottom-1 sm:-left-1 md:-bottom-2 md:-left-2 transform transition-all duration-300 group-hover:scale-110">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <Shield className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Info - À droite sur desktop */}
              <div className="flex-1 text-white text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 sm:mb-3 md:mb-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    {store.name}
                  </h1>
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-yellow-400 mt-1" />
                </div>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-3 sm:mb-4 md:mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {store.description || 'Boutique premium de produits digitaux d\'exception'}
                </p>

                {/* Quick Stats - Layout adapté mobile */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-blue-300" />
                    <span className="text-xs sm:text-sm font-medium">En ligne</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-purple-300" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Depuis {formatDate(store.created_at)}</span>
                    <span className="text-xs sm:text-sm font-medium sm:hidden">{formatDate(store.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">4.8</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-green-300" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Top vendeur</span>
                    <span className="text-xs sm:text-sm font-medium sm:hidden">Top</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - À droite sur desktop */}
              <div className="flex flex-row items-center justify-center lg:justify-end gap-2 sm:gap-3 w-full lg:w-auto lg:flex-shrink-0">
                <button
                  onClick={handleFollow}
                  className={`group px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base ${
                    isFollowing
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25'
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white shadow-lg hover:shadow-white/20'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Heart className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 transition-all duration-300 ${isFollowing ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                    <span className="hidden sm:inline">{isFollowing ? 'Suivi' : 'Suivre'}</span>
                    <span className="sm:hidden">{isFollowing ? '✓' : '+'}</span>
                  </div>
                </button>
                
                <button className="group px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-white text-slate-900 hover:bg-slate-50 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Contacter</span>
                    <span className="sm:hidden">Msg</span>
                  </div>
                </button>
                
                <button className="group p-2 sm:p-2.5 md:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/30 text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
