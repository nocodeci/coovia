"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/auth-context"
import { Mail, Lock, Key, ArrowLeft, Loader2, CheckCircle } from "lucide-react"

// Schémas de validation
const emailSchema = z.object({
  email: z.string().email("Email invalide")
})

const passwordSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
})

const otpSchema = z.object({
  otp: z.string().length(6, "Le code OTP doit contenir 6 chiffres")
})

type EmailFormData = z.infer<typeof emailSchema>
type PasswordFormData = z.infer<typeof passwordSchema>
type OtpFormData = z.infer<typeof otpSchema>

export function MfaAuthForm() {
  const { 
    authStep, 
    email, 
    password, 
    otp, 
    isLoading, 
    submitEmail, 
    submitPassword, 
    submitOtp, 
    resetAuth 
  } = useAuth()

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: email }
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: password }
  })

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: otp }
  })

  const onEmailSubmit = async (data: EmailFormData) => {
    await submitEmail(data.email)
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    await submitPassword(data.password)
  }

  const onOtpSubmit = async (data: OtpFormData) => {
    await submitOtp(data.otp)
  }

  const handleBack = () => {
    if (authStep === 'password') {
      resetAuth()
    } else if (authStep === 'otp') {
      // Retourner à l'étape du mot de passe
      // On peut implémenter une logique pour revenir en arrière
    }
  }

  // Étape 1: Email
  if (authStep === 'email') {
    return (
      <div className="w-full max-w-xs">
        <div className="text-left mb-6">
          <div className="text-2xl font-bold text-neutral-900 mb-2">
            Se connecter
          </div>
          <div className="text-sm text-neutral-500">
            Entrez votre adresse email pour commencer
          </div>
        </div>

        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    Adresse email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Mail className="h-5 w-5 mr-2" />
              )}
              Continuer
            </Button>
          </form>
        </Form>
      </div>
    )
  }

  // Étape 2: Mot de passe
  if (authStep === 'password') {
    return (
      <div className="w-full max-w-xs">
        <div className="text-left mb-6">
          <div className="text-2xl font-bold text-neutral-900 mb-2">
            Mot de passe
          </div>
          <div className="text-sm text-neutral-500 mb-2">
            Entrez votre mot de passe pour {email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-0 h-auto text-sm text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Changer d'email
          </Button>
        </div>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Votre mot de passe"
                        className="pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Lock className="h-5 w-5 mr-2" />
              )}
              Continuer
            </Button>
          </form>
        </Form>
      </div>
    )
  }

  // Étape 3: OTP
  if (authStep === 'otp') {
    return (
      <div className="w-full max-w-xs">
        <div className="text-left mb-6">
          <div className="text-2xl font-bold text-neutral-900 mb-2">
            Code de vérification
          </div>
          <div className="text-sm text-neutral-500 mb-2">
            Nous avons envoyé un code à 6 chiffres à {email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-0 h-auto text-sm text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour au mot de passe
          </Button>
        </div>

        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">
                    Code OTP
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        className="pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-center text-lg font-mono"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-2" />
              )}
              Se connecter
            </Button>
          </form>
        </Form>

        <div className="text-center pt-4">
          <p className="text-xs text-neutral-400">
            Vous n'avez pas reçu le code ? Vérifiez vos spams ou
          </p>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-xs text-primary hover:text-primary/80"
            onClick={() => submitPassword(password)}
          >
            demander un nouveau code
          </Button>
        </div>
      </div>
    )
  }

  // Étape 4: Connexion réussie
  return (
    <div className="w-full max-w-xs text-center">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <div className="text-2xl font-bold text-neutral-900 mb-2">
          Connexion réussie !
        </div>
        <div className="text-sm text-neutral-500">
          Vous allez être redirigé dans quelques instants...
        </div>
      </div>
    </div>
  )
}
