"use client"

import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { storeService } from '@/services/storeService'

export default function CreateStore() {
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { user } = useSanctumAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!storeName.trim()) {
      setError('Le nom de la boutique est requis')
      setIsLoading(false)
      return
    }

    try {
      const response = await storeService.createStore({
        name: storeName,
        description,
        address,
        phone,
        website
      })

      if (response.success) {
        // Rediriger vers le dashboard après création de la boutique
        navigate({ to: '/dashboard' })
      } else {
        setError(response.message || 'Erreur lors de la création de la boutique')
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-white min-h-screen w-full flex flex-row">
      {/* Section gauche avec image de fond */}
      <div 
        className="w-2/5 bg-primary md:flex hidden flex-col items-center justify-center px-10 bg-no-repeat bg-bottom bg-contain"
        style={{ 
          backgroundImage: "url('/assets/images/3d-logo.svg')",
          backgroundSize: 'contain',
          backgroundPosition: 'bottom'
        }}
      >
        <div className="bg-white rounded-[12px] p-6 max-w-sm mx-auto shadow-xl">
          <div className="text-neutral-900 text-2xl font-semibold mb-8">
            Bienvenue sur Wozif ! Créez votre première boutique et commencez à vendre en ligne dès aujourd'hui.
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">YK</span>
            </div>
            <div>
              <div className="text-neutral-900 text-lg font-bold">Yohan Kouakou</div>
              <div className="text-neutral-500 text-sm">Lead Developer chez Wozif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite avec formulaire */}
      <div className="flex flex-col items-center justify-center w-full flex-1 md:p-0 p-4 relative overflow-y-auto min-h-screen">
        <div className="flex flex-col items-start justify-start w-full mb-6 max-w-xs">
          <img 
            src="/assets/images/logo.svg" 
            alt="Wozif" 
            width="100" 
            height="16"
            className="h-8 w-auto"
          />
        </div>

        <div className="w-full max-w-xs">
          <div className="text-left mb-6">
            <div className="text-2xl font-bold text-neutral-900 mb-2">
              Créer votre boutique
            </div>
            <div className="text-sm text-neutral-500">
              Bienvenue {user?.name || 'nouveau vendeur'} ! Créez votre première boutique pour commencer à vendre.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom de la boutique */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-neutral-900 mb-1 block">
                Nom de la boutique<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                </div>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                  placeholder="Ma Boutique"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-neutral-900 mb-1 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-24 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900 resize-none"
                placeholder="Décrivez votre boutique..."
                rows={3}
              />
            </div>

            {/* Adresse */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-neutral-900 mb-1 block">
                Adresse
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                  placeholder="123 Rue de la Paix, Paris"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-neutral-900 mb-1 block">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                  placeholder="+33123456789"
                />
              </div>
            </div>

            {/* Site web */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-neutral-900 mb-1 block">
                Site web
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                  placeholder="https://maboutique.com"
                />
              </div>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Bouton de création */}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-xs px-4 py-2 w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isLoading ? 'Création...' : 'Créer ma boutique'}
            </button>
          </form>

          {/* Lien pour passer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate({ to: '/dashboard' })}
              className="text-sm text-neutral-500 hover:text-neutral-700 underline"
            >
              Créer ma boutique plus tard
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
