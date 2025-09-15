import React, { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useOptimizedIcons } from '@/hooks/use-optimized-icons'
import { SettingsToggle } from '@/components/ui/settings-toggle'
import { useStore } from '@/hooks/use-store'
import { Store } from '@/types/store'
import { toast } from 'sonner'

// Fonction utilitaire pour générer un slug à partir d'un nom
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/[\s_-]+/g, '-') // Remplacer espaces et underscores par des tirets
    .replace(/^-+|-+$/g, '') // Supprimer les tirets en début/fin
}

// Fonction utilitaire pour mapper les données de la boutique vers le formulaire
const mapStoreToFormData = (store: Store): StoreSettingsValues => {
  return {
    name: store.name || '',
    slug: store.slug || slugify(store.name || ''),
    description: store.description || '',
    logo: store.logo || '',
    // Valeurs par défaut pour les propriétés non disponibles dans l'interface Store basique
    banner: '',
    category: '',
    status: 'active' as const,
    email: '',
    phone: '',
    address: '',
    currency: 'XOF',
    language: 'fr',
    timezone: 'Africa/Abidjan',
    notifications_email: true,
    notifications_sms: false,
    notifications_push: true,
    features_inventory: true,
    features_analytics: true,
    features_multi_channel: false,
    features_custom_domain: false,
    plan: 'starter' as const,
  }
}

const storeSettingsSchema = z.object({
  // Informations de base
  name: z.string().min(1, "Le nom de la boutique est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  
  // Contact
  email: z.string().email('Email invalide').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  
  // Paramètres de vente
  currency: z.string().min(1, 'La devise est requise'),
  language: z.string().min(1, 'La langue est requise'),
  timezone: z.string().min(1, 'Le fuseau horaire est requis'),
  
  // Notifications
  notifications_email: z.boolean(),
  notifications_sms: z.boolean(),
  notifications_push: z.boolean(),
  
  // Fonctionnalités
  features_inventory: z.boolean(),
  features_analytics: z.boolean(),
  features_multi_channel: z.boolean(),
  features_custom_domain: z.boolean(),
  
  // Plan
  plan: z.enum(['starter', 'professional', 'enterprise']),
})

type StoreSettingsValues = z.infer<typeof storeSettingsSchema>

export default function StoreSettings() {
  const { currentStore, isLoading: storesLoading, stores, setCurrentStore } = useStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { icons } = useOptimizedIcons()

  // Initialiser le formulaire au début
  const form = useForm<StoreSettingsValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      logo: '',
      banner: '',
      category: '',
      status: 'active',
      email: '',
      phone: '',
      address: '',
      currency: 'XOF',
      language: 'fr',
      timezone: 'Africa/Abidjan',
      notifications_email: true,
      notifications_sms: false,
      notifications_push: true,
      features_inventory: true,
      features_analytics: true,
      features_multi_channel: false,
      features_custom_domain: false,
      plan: 'starter',
    },
    mode: 'onChange',
  })

  // Watch des champs pour l'aperçu en temps réel (optimisé)
  const watchedName = form.watch('name')
  const watchedDescription = form.watch('description')
  const watchedLogo = form.watch('logo')
  const watchedSlug = form.watch('slug')

  // Sélectionner automatiquement la première boutique si aucune n'est sélectionnée
  React.useEffect(() => {
    if (!currentStore && stores && stores.length > 0) {
      setCurrentStore(stores[0])
    }
  }, [currentStore, stores, setCurrentStore])

  // Mettre à jour le formulaire quand la boutique change
  useEffect(() => {
    if (currentStore) {
      const storeData = mapStoreToFormData(currentStore)
      form.reset(storeData)
    }
  }, [currentStore, form])

  const onSubmit = async (data: StoreSettingsValues) => {
    setIsSubmitting(true)
    try {
      // Auto-générer le slug si vide
      if (!data.slug && data.name) {
        data.slug = slugify(data.name)
      }

      // Appel API réel pour mettre à jour la boutique
      const response = await fetch(`/api/stores/${currentStore?.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assumant que le token est stocké
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success('Paramètres de boutique mis à jour avec succès')
        // Optionnel: recharger les données de la boutique
        // setCurrentStore(result.data)
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour des paramètres')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Afficher le formulaire même pendant le chargement si on a des données
  // if (storesLoading) {
  //   return (
  //     <div className="space-y-8">
  //       <div className="space-y-2">
  //         <h1 className="text-2xl font-semibold tracking-tight">Paramètres de la boutique</h1>
  //         <p className="text-muted-foreground">Préparation des paramètres...</p>
  //       </div>
  //     </div>
  //   )
  // }

  // Attendre que currentStore soit défini avant d'afficher le formulaire
  if (!currentStore) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Paramètres de la boutique</h1>
          <p className="text-muted-foreground">Aucune boutique sélectionnée</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Vous avez {stores.length} boutique(s) disponible(s). Veuillez sélectionner une boutique pour configurer ses paramètres.
            </p>
            {stores.length > 0 && (
              <button
                onClick={() => {
                  setCurrentStore(stores[0])
                }}
                className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sélectionner automatiquement la première boutique
              </button>
            )}
            <div className="space-y-2">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => {
                    setCurrentStore(store)
                  }}
                  className="w-full p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 text-left hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: '#7126FF' }}
                    >
                      {store.name?.substring(0, 2).toUpperCase() || 'MS'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors">{store.name}</p>
                      <p className="text-sm text-muted-foreground">{store.description || 'Aucune description'}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {store.id}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {icons.settings({ className: "h-4 w-4 text-primary" })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres de la boutique</h1>
        <p className="text-muted-foreground">
          Gérez les informations et paramètres de votre boutique
        </p>
        
        {/* Aperçu de la boutique en temps réel */}
        {(currentStore || watchedName) && (
          <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-4">
              <div
                className="polaris-avatar"
                style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: "#7126FF",
                  fontSize: "var(--p-font-size-275)",
                }}
              >
                <span style={{ color: "white" }}>
                  {(watchedName || currentStore?.name)?.substring(0, 2).toUpperCase() || "MS"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary">
                  {watchedName || currentStore?.name || "Ma Boutique"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {watchedDescription || currentStore?.description || "Aucune description"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {watchedSlug || currentStore?.slug || "slug-non-defini"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ID: {currentStore?.id || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations de base */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  {icons.building({ className: "h-4 w-4 text-primary" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Informations de base</CardTitle>
                  <CardDescription className="text-sm">
                    Configurez les informations principales de votre boutique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la boutique</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ma Boutique" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            // Auto-générer le slug quand le nom change
                            const newSlug = slugify(e.target.value)
                            form.setValue('slug', newSlug)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug de la boutique</FormLabel>
                      <FormControl>
                        <Input placeholder="ma-boutique (auto-généré)" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL de votre boutique (ex: coovia.com/ma-boutique)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre boutique..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemple.com/logo.png" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL de votre logo (format PNG, JPG recommandé)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bannière</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemple.com/banner.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL de votre bannière (format JPG, PNG recommandé)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="electronics">Électronique</SelectItem>
                          <SelectItem value="fashion">Mode</SelectItem>
                          <SelectItem value="home">Maison</SelectItem>
                          <SelectItem value="beauty">Beauté</SelectItem>
                          <SelectItem value="sports">Sport</SelectItem>
                          <SelectItem value="books">Livres</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspendue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                  {icons.mail({ className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Informations de contact</CardTitle>
                  <CardDescription className="text-sm">
                    Coordonnées de contact de votre boutique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@maboutique.com (ex: contact@monmagasin.com)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+225 07 12 34 56 78 (format international)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="123 Rue de la Paix, 75001 Paris, France"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Paramètres de vente */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/20">
                  {icons.globe({ className: "h-4 w-4 text-violet-600 dark:text-violet-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Paramètres de vente</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration des ventes et de la boutique en ligne
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="USD">Dollar US (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Langue</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuseau horaire</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Africa/Abidjan">Afrique/Abidjan</SelectItem>
                          <SelectItem value="Africa/Lagos">Afrique/Lagos</SelectItem>
                          <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Plan d'abonnement de votre boutique
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/20">
                  {icons.bell({ className: "h-4 w-4 text-cyan-600 dark:text-cyan-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Notifications</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration des notifications de boutique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  name="notifications_email"
                  control={form.control}
                  render={({ field }) => (
                    <SettingsToggle
                      label="Emails"
                      description="Notifications par email"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="notifications_sms"
                  control={form.control}
                  render={({ field }) => (
                    <SettingsToggle
                      label="SMS"
                      description="Notifications par SMS"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="notifications_push"
                  control={form.control}
                  render={({ field }) => (
                    <SettingsToggle
                      label="Push"
                      description="Notifications push"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fonctionnalités */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  {icons.settings({ className: "h-4 w-4 text-amber-600 dark:text-amber-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Fonctionnalités</CardTitle>
                  <CardDescription className="text-sm">
                    Activez les fonctionnalités disponibles pour votre boutique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="features_inventory"
                  control={form.control}
                  render={({ field }) => (
                    <SettingsToggle
                      label="Gestion d'inventaire"
                      description="Suivi des stocks et inventaire"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="features_analytics"
                  control={form.control}
                  render={({ field }) => (
                    <SettingsToggle
                      label="Analytics"
                      description="Statistiques et analyses de vente"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="features_multi_channel"
                  control={form.control}
                  render={({ field }) => (
                    <SettingsToggle
                      label="Multi-canal"
                      description="Vente sur plusieurs plateformes"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="features_custom_domain"
                  control={form.control}
                  render={({ field }) => (
                    <SettingsToggle
                      label="Domaine personnalisé"
                      description="Utiliser votre propre domaine"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" className="min-w-[140px]" disabled={isSubmitting}>
              Sauvegarder
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
