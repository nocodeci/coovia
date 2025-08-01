"use client"

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, Mail, Lock, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function ModernAuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password })
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const testConnection = async () => {
    try {
      await login({ email: 'admin@example.com', password: 'password' });
    } catch (error) {
      console.error("Test connection error:", error);
    }
  }

  return (
    <div className="w-full max-w-xs">
      <div className="text-left">
        <div className="text-2xl font-bold text-neutral-900 mb-2">
          Se connecter
        </div>
        <div className="text-sm text-neutral-500 mb-6">
          <span className="mr-1">Pas encore de compte ?</span>
          <a 
            href="/sign-up" 
            className="text-sm font-medium text-primary hover:underline"
          >
            Créer un compte
          </a>
        </div>
      </div>



      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-900 mb-1 block">
                  Adresse email
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <Input
                      type="email"
                      placeholder="nom@exemple.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className="pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-900 mb-1 block">
                  Mot de passe
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="pl-10 pr-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </form>
      </Form>

      <div className="flex flex-col items-center justify-center mt-6">
        <div className="text-sm text-neutral-500">
          Avez-vous précédemment acheté sur Coovia ?
        </div>
        <div className="text-sm">
          <span className="text-neutral-500">Accéder à vos achats</span>
          <a 
            href="https://portal.coovia.com" 
            className="text-primary font-medium ml-1 hover:underline"
          >
            ici
          </a>
        </div>
      </div>
    </div>
  )
} 