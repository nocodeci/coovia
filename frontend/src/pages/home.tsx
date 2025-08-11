"use client"

import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { MainNav } from '@/components/layout/main-nav'
import { 
  Sparkles, 
  ShoppingBag, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Rediriger vers le tableau de bord si déjà connecté
      window.location.href = '/dashboard'
    } else {
      // Rediriger vers la page de connexion MFA
      navigate({ to: "/sign-in" })
    }
  }

  const features = [
    {
      icon: ShoppingBag,
      title: "Gestion de Boutiques",
      description: "Créez et gérez plusieurs boutiques en ligne avec une interface intuitive et des outils puissants."
    },
    {
      icon: BarChart3,
      title: "Analytics Avancés",
      description: "Suivez vos performances avec des tableaux de bord détaillés et des rapports personnalisés."
    },
    {
      icon: Users,
      title: "Gestion des Clients",
      description: "Gérez votre base de clients, leurs commandes et leur historique d'achat."
    },
    {
      icon: Zap,
      title: "Performance Optimisée",
      description: "Profitez d'une plateforme rapide et fiable pour vos transactions en ligne."
    }
  ]

  const benefits = [
    "Interface utilisateur moderne et intuitive",
    "Sécurité de niveau entreprise avec authentification MFA",
    "Support multi-boutiques",
    "Intégration de paiement sécurisée",
    "Analytics et rapports détaillés",
    "Support client 24/7"
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Entrepreneuse",
      content: `Wozif a transformé ma façon de gérer mes boutiques en ligne. L'interface est intuitive et les fonctionnalités sont impressionnantes.`,
      rating: 5
    },
    {
      name: "Jean P.",
      role: "Commerçant",
      content: "Excellent service client et une plateforme qui répond parfaitement à mes besoins. Je recommande vivement !",
      rating: 5
    },
    {
      name: "Marie L.",
      role: "Créatrice de contenu",
      content: `Grâce à Wozif, j'ai pu lancer ma boutique en quelques heures. L'authentification MFA est un vrai plus pour la sécurité.`,
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Nouveau : Authentification sécurisée avec MFA
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              La plateforme e-commerce
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                nouvelle génération
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Créez, gérez et développez vos boutiques en ligne avec une suite d'outils puissants, 
              une sécurité de niveau entreprise et une expérience utilisateur exceptionnelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                {isAuthenticated ? 'Accéder au tableau de bord' : 'Commencer gratuitement'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              {!isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate({ to: "/sign-in" })}
                  className="px-8 py-4 text-lg"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Boutiques actives</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50M+</div>
              <div className="text-gray-600">Transactions sécurisées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Temps de disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une suite complète d'outils conçus pour les entrepreneurs modernes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Sécurité de niveau entreprise
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Votre sécurité est notre priorité
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Profitez d'une authentification sécurisée avec MFA, garantissant la protection de vos données. 
                Vos données et celles de vos clients sont protégées par les plus hauts standards de sécurité.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Authentification MFA</h3>
                  <p className="text-blue-100 mb-6">
                    Connexion sécurisée, gestion des rôles et protection des données
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    <span className="ml-2 text-sm">5.0/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez pourquoi des milliers d'entrepreneurs font confiance à Wozif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre business ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d'entrepreneurs qui ont déjà choisi Wozif pour leur succès en ligne
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100"
            >
              {isAuthenticated ? 'Accéder au tableau de bord' : 'Commencer maintenant'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate({ to: "/sign-in" })}
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Wozif</span>
              </div>
              <p className="text-gray-400">
                La plateforme e-commerce nouvelle génération pour entrepreneurs ambitieux.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Intégrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/status" className="hover:text-white transition-colors">Statut</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Carrières</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Coovia. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
