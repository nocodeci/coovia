"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, Eye, EyeOff, User, CheckCircle } from 'lucide-react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'

interface SanctumRegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export function SanctumRegisterForm({ onSuccess, onSwitchToLogin }: SanctumRegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  const { register, isLoading, error, clearError } = useSanctumAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Validation côté client
    if (password !== passwordConfirmation) {
      return
    }

    try {
      const response = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
      
      if (response.success) {
        onSuccess?.()
      }
    } catch (err) {
      console.error('Registration error:', err)
    }
  }

  const isFormValid = name.trim() && email.trim() && password.length >= 6 && password === passwordConfirmation

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-none">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-neutral-900">
          Créer un compte
        </CardTitle>
        <CardDescription className="text-neutral-600">
          Rejoignez Coovia et commencez votre aventure
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-neutral-700 font-medium">
              Nom complet
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom complet"
                required
                disabled={isLoading}
                className="h-11 pl-10 border-neutral-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-700 font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={isLoading}
                className="h-11 pl-10 border-neutral-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-700 font-medium">
              Mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                disabled={isLoading}
                className="h-11 pl-10 pr-10 border-neutral-300 focus:border-green-500 focus:ring-green-500"
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-400" />
                )}
              </Button>
            </div>
            {password.length > 0 && (
              <div className="text-xs text-neutral-500">
                {password.length >= 6 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mot de passe valide
                  </div>
                ) : (
                  <div className="text-red-500">
                    Le mot de passe doit contenir au moins 6 caractères
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-neutral-700 font-medium">
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="password_confirmation"
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                required
                disabled={isLoading}
                className="h-11 pl-10 pr-10 border-neutral-300 focus:border-green-500 focus:ring-green-500"
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                disabled={isLoading}
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-400" />
                )}
              </Button>
            </div>
            {passwordConfirmation.length > 0 && (
              <div className="text-xs">
                {password === passwordConfirmation ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Les mots de passe correspondent
                  </div>
                ) : (
                  <div className="text-red-500">
                    Les mots de passe ne correspondent pas
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
            disabled={isLoading || !isFormValid}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer le compte
          </Button>
        </form>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToLogin}
            disabled={isLoading}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Déjà un compte ? Se connecter
          </Button>
        </div>

        <div className="text-center text-xs text-neutral-500">
          En créant un compte, vous acceptez nos{' '}
          <a href="/terms" className="text-green-600 hover:underline">
            conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="/privacy" className="text-green-600 hover:underline">
            politique de confidentialité
          </a>
          .
        </div>
      </CardContent>
    </Card>
  )
}
