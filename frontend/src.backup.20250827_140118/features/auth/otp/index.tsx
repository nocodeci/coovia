"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useSanctumAuth } from "@/hooks/useSanctumAuth"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function OtpPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [otpToken, setOtpToken] = useState("")
  const navigate = useNavigate()
  const { loginWithOtp } = useSanctumAuth()

  // Récupérer les paramètres de l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get("email")
    const otpTokenParam = urlParams.get("otp_token")
    
    if (emailParam) setEmail(emailParam)
    if (otpTokenParam) setOtpToken(otpTokenParam)
    
    console.log("Paramètres URL récupérés:", { email: emailParam, otpToken: otpTokenParam })
  }, [])

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("OTP soumis:", { otp, email, otpToken })

    if (!otp || otp.length !== 6) {
      setError("Veuillez saisir le code à 6 chiffres")
      setIsLoading(false)
      return
    }

    if (!email || !otpToken) {
      setError("Informations de session manquantes")
      setIsLoading(false)
      return
    }

    try {
      const result = await loginWithOtp(otp, email, otpToken)
      console.log("Résultat loginWithOtp:", result)
      
      if (result.success) {
        // Redirection intelligente basée sur le type d'utilisateur
        if (result.isNewUser && result.redirectTo === 'create-store') {
          navigate({ to: '/create-store' })
        } else {
          // Naviguer vers la route racine authentifiée qui gère automatiquement la redirection
          navigate({ to: '/' })
        }
      } else {
        setError(result.message || "Code OTP incorrect")
      }
    } catch (err) {
      setError("Erreur lors de la vérification du code")
      console.error("Erreur OTP:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    // TODO: Implémenter le renvoi d'OTP
    console.log("Renvoi d'OTP")
  }

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
            Sécurisez votre connexion avec un code unique. Ce code a été envoyé à votre adresse email pour confirmer votre identité.
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🔐</span>
            </div>
            <div>
              <div className="text-neutral-900 text-lg font-bold">Sécurité Wozif</div>
              <div className="text-neutral-500 text-sm">Protection de votre compte</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite avec formulaire OTP */}
      <div className="flex flex-col items-center justify-center w-full flex-1 md:p-0 p-4 relative overflow-y-auto h-screen">
        <div className="flex flex-col items-start justify-start w-full mb-6 max-w-xs">
          <img 
            src="/assets/images/logo.svg" 
            alt="Wozif" 
            width="100" 
            height="16"
            className="h-8 w-auto"
          />
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-left mb-8">
              <div className="text-2xl font-bold text-neutral-900 mb-2">Vérification</div>
              <div className="text-sm text-neutral-500 mb-4">
                Nous avons envoyé un code à 6 chiffres à
              </div>
              <div className="text-sm font-medium text-neutral-900 mb-6">
                {email}
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {/* Input OTP */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-neutral-900 mb-2 block">
                  Code de vérification
                </label>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    disabled={isLoading}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Vérification..." : "Vérifier le code"}
              </button>

              {/* Renvoi d'OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  Renvoyer le code
                </button>
              </div>

              {/* Retour à la connexion */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/sign-in" })}
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  ← Retour à la connexion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
