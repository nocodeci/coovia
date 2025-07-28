"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { SignUpForm } from "./components/sign-up-form"
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
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Coovia
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Rejoignez des milliers de commerçants qui font confiance à notre plateforme pour développer leur
              activité."
            </p>
            <footer className="text-sm">Alex Johnson</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
            <p className="text-sm text-muted-foreground">Entrez vos informations ci-dessous pour créer votre compte</p>
          </div>

          <SignUpForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link to="/sign-in" className="underline underline-offset-4 hover:text-primary">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
