"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { SignUpForm } from "./components/sign-up-form"
import { ModernSignUpForm } from "./components/modern-sign-up-form"
import { useAuth } from "@/hooks/useAuth"

export default function SignUp() {
  const { isAuthenticated } = useAuth()
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
            Rejoignez des milliers de commerçants qui font confiance à notre plateforme pour développer leur activité. Commencez votre voyage entrepreneurial dès aujourd'hui.
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AJ</span>
            </div>
            <div>
              <div className="text-neutral-900 text-lg font-bold">Alex Johnson</div>
              <div className="text-neutral-500 text-sm">CEO chez Coovia</div>
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
          <ModernSignUpForm />
        </div>
      </div>
    </main>
  )
}
