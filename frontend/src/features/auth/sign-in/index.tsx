"use client"

import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { SanctumLoginForm } from "@/components/auth/SanctumLoginForm"
import { useSanctumAuth } from "@/hooks/useSanctumAuth"

export default function SignIn() {
  const { isAuthenticated } = useSanctumAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" })
    }
  }, [isAuthenticated, navigate])

  return (
    <main className="bg-white h-screen w-full flex flex-row">
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
            La force de Wozif, c'est l'accompagnement personnalisé de chaque marchand. Que vous débutiez ou que vous soyez un vendeur expérimenté, nous sommes là pour vous aider à atteindre vos objectifs.
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
      <div className="flex flex-col items-center justify-center w-full flex-1 md:p-0 p-4 relative overflow-y-auto h-screen">
        <div className="flex flex-col items-start justify-start w-full mb-6 max-w-xs">
          <img 
            src="/assets/images/logo.svg" 
            alt="coovia" 
            width="100" 
            height="16"
            className="h-8 w-auto"
          />
          </div>

        <div className="w-full max-w-xs">
          <SanctumLoginForm />
        </div>
      </div>
    </main>
  )
}
