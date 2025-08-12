"use client"

import React, { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react"
import { Check, ArrowRight, RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface CustomOTPInputProps {
  onVerify: (otp: string) => Promise<{ success: boolean; message?: string }>
  onResend?: () => Promise<void>
  email?: string
  isLoading?: boolean
  error?: string
  onBack?: () => void
}

export default function CustomOTPInput({
  onVerify,
  onResend,
  email = "votre email",
  isLoading = false,
  error: externalError,
  onBack
}: CustomOTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [activeInput, setActiveInput] = useState<number>(0)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [canResend, setCanResend] = useState<boolean>(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true)
    }
  }, [timeLeft, canResend])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (externalError) {
      setError(externalError)
    }
  }, [externalError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (value.length > 1 || (value && !/^\d+$/.test(value))) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    if (value && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (!/^\d+$/.test(pastedData)) {
      setError("Veuillez coller uniquement des chiffres")
      return
    }

    const pastedOtp = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]
    pastedOtp.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit
    })
    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      setActiveInput(nextEmptyIndex)
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      setActiveInput(5)
      inputRefs.current[5]?.focus()
    }
  }

  const verifyOtp = async () => {
    if (otp.some((digit) => !digit)) {
      setError("Veuillez saisir tous les chiffres")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const result = await onVerify(otp.join(""))
      if (result.success) {
        setIsVerified(true)
      } else {
        setError(result.message || "Code de vérification invalide. Veuillez réessayer.")
      }
    } catch (err) {
      setError("Erreur lors de la vérification")
    } finally {
      setIsVerifying(false)
    }
  }

  const resendOtp = async () => {
    if (!onResend) return

    setOtp(Array(6).fill(""))
    setActiveInput(0)
    setError(null)
    setIsVerified(false)
    setCanResend(false)
    setTimeLeft(30)

    try {
      await onResend()
      setError("Un nouveau code de vérification a été envoyé")
      setTimeout(() => {
        setError(null)
      }, 3000)
    } catch (err) {
      setError("Erreur lors de l'envoi du code")
    }

    setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 100)
  }

  const maskedEmail = email ? email.replace(/(.{2}).*(@.*)/, "$1***$2") : "votre email"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />

        <CardHeader className="space-y-1 pb-6 pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">Code de vérification</CardTitle>
          <CardDescription className="text-center">
            Nous avons envoyé un code à 6 chiffres à {maskedEmail}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8 px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {isVerified ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-6 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="rounded-full bg-green-100 p-4"
                >
                  <Check className="h-10 w-10 text-green-600" />
                </motion.div>
                <div className="space-y-2 text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-semibold"
                  >
                    Vérification réussie
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground"
                  >
                    Votre identité a été vérifiée avec succès
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full pt-2"
                >
                  <Button className="w-full py-6 text-base">
                    Continuer <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex justify-center space-x-2 sm:space-x-4 my-6">
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="\d{1}"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={`h-12 w-10 sm:h-14 sm:w-12 md:h-16 md:w-14 text-center text-lg sm:text-xl font-semibold rounded-lg border-2 bg-white/80 backdrop-blur-sm transition-all duration-200 ${
                          error && !digit ? "border-red-400 bg-red-50/50" : "border-gray-200"
                        } ${digit ? "border-primary/50 bg-primary/5" : ""} ${
                          activeInput === index ? "border-primary ring-2 ring-primary/20" : ""
                        } focus:outline-none`}
                        aria-label={`Chiffre ${index + 1}`}
                      />
                      {index < 5 && (
                        <span className="hidden sm:block absolute top-1/2 -right-2 sm:-right-3 transform -translate-y-1/2 text-gray-300">
                          ·
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-sm text-center ${error.includes("envoyé") ? "text-green-600" : "text-red-500"}`}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  onClick={verifyOtp}
                  disabled={isVerifying || otp.some((digit) => !digit)}
                  className={`w-full py-6 text-base transition-all duration-200 ${
                    otp.every((digit) => digit) && !isVerifying ? "bg-primary hover:bg-primary/90" : ""
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Vérifier le code"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {!isVerified && (
          <CardFooter className="flex justify-center border-t px-4 sm:px-6 py-6 bg-gray-50/80">
            <div className="text-sm text-center">
              <span className="text-muted-foreground">Vous n'avez pas reçu le code ?</span>{" "}
              {canResend ? (
                <button
                  onClick={resendOtp}
                  className="text-primary font-medium hover:underline focus:outline-none transition-colors"
                >
                  Renvoyer le code
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Renvoyer dans <span className="font-medium text-primary">{timeLeft}s</span>
                </span>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

