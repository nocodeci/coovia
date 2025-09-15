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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useOptimizedIcons } from '@/hooks/use-optimized-icons'
import { SettingsToggle } from '@/components/ui/settings-toggle'
import { useGlobalSettings } from '@/hooks/useSettings'
import { toast } from 'sonner'
import { useEffect } from 'react'

const advancedSettingsSchema = z.object({
  // Application
  app_name: z.string().min(1, "Le nom de l'application est requis"),
  app_description: z.string().min(1, 'La description est requise'),
  app_logo: z.string().optional(),
  app_favicon: z.string().optional(),
  app_timezone: z.string().min(1, 'Le fuseau horaire est requis'),
  app_locale: z.string().min(1, 'La langue est requise'),
  app_currency: z.string().min(1, 'La devise est requise'),
  
  // Paiements
  payment_gateways: z.array(z.string()).min(1, 'Au moins une passerelle de paiement est requise'),
  payment_currency: z.string().min(1, 'La devise de paiement est requise'),
  payment_auto_capture: z.boolean(),
  
  // Communication
  email_from_name: z.string().min(1, "Le nom de l'expéditeur est requis"),
  email_from_address: z.string().email('Adresse email invalide'),
  sms_provider: z.string().min(1, 'Le fournisseur SMS est requis'),
  sms_from_number: z.string().min(1, 'Le numéro d\'envoi SMS est requis'),
  
  // Sécurité
  security_password_min_length: z.number().min(6, 'Minimum 6 caractères'),
  security_password_require_special: z.boolean(),
  security_session_lifetime: z.number().min(30, 'Minimum 30 minutes'),
  security_max_login_attempts: z.number().min(1, 'Minimum 1 tentative'),
  security_lockout_duration: z.number().min(1, 'Minimum 1 minute'),
  
  // Fichiers
  file_max_size: z.number().min(1024, 'Minimum 1KB'),
  file_allowed_types: z.array(z.string()).min(1, 'Au moins un type de fichier est requis'),
  file_storage_disk: z.string().min(1, 'Le disque de stockage est requis'),
  
  // Notifications
  notifications_email_enabled: z.boolean(),
  notifications_sms_enabled: z.boolean(),
  notifications_push_enabled: z.boolean(),
  
  // SEO
  seo_default_title: z.string().min(1, 'Le titre SEO est requis'),
  seo_default_description: z.string().min(1, 'La description SEO est requise'),
  seo_default_keywords: z.string().min(1, 'Les mots-clés SEO sont requis'),
})

type AdvancedSettingsValues = z.infer<typeof advancedSettingsSchema>

export default function AdvancedSettings() {
  const { settings, getSetting, loading } = useGlobalSettings()
  const { icons } = useOptimizedIcons()

  const form = useForm<AdvancedSettingsValues>({
    resolver: zodResolver(advancedSettingsSchema),
    defaultValues: {
      app_name: getSetting('app_name', 'Coovia'),
      app_description: getSetting('app_description', ''),
      app_logo: getSetting('app_logo', ''),
      app_favicon: getSetting('app_favicon', ''),
      app_timezone: getSetting('app_timezone', 'Africa/Abidjan'),
      app_locale: getSetting('app_locale', 'fr'),
      app_currency: getSetting('app_currency', 'XOF'),
      payment_gateways: getSetting('payment_gateways', ['orange_money', 'moov_money', 'mtn_money']),
      payment_currency: getSetting('payment_currency', 'XOF'),
      payment_auto_capture: getSetting('payment_auto_capture', true),
      email_from_name: getSetting('email_from_name', 'Coovia'),
      email_from_address: getSetting('email_from_address', 'noreply@coovia.com'),
      sms_provider: getSetting('sms_provider', 'twilio'),
      sms_from_number: getSetting('sms_from_number', '+22500000000'),
      security_password_min_length: getSetting('security_password_min_length', 8),
      security_password_require_special: getSetting('security_password_require_special', true),
      security_session_lifetime: getSetting('security_session_lifetime', 120),
      security_max_login_attempts: getSetting('security_max_login_attempts', 5),
      security_lockout_duration: getSetting('security_lockout_duration', 15),
      file_max_size: getSetting('file_max_size', 10485760),
      file_allowed_types: getSetting('file_allowed_types', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']),
      file_storage_disk: getSetting('file_storage_disk', 'cloudflare'),
      notifications_email_enabled: getSetting('notifications_email_enabled', true),
      notifications_sms_enabled: getSetting('notifications_sms_enabled', false),
      notifications_push_enabled: getSetting('notifications_push_enabled', true),
      seo_default_title: getSetting('seo_default_title', 'Coovia - Vente de produits digitaux'),
      seo_default_description: getSetting('seo_default_description', ''),
      seo_default_keywords: getSetting('seo_default_keywords', ''),
    },
    mode: 'onChange',
  })

  // Mettre à jour le formulaire quand les paramètres changent
  useEffect(() => {
    if (settings && !loading) {
      console.log('🔄 Mise à jour du formulaire avec les paramètres globaux:', settings)
      form.reset({
        // Application
        app_name: getSetting('app_name', ''),
        app_description: getSetting('app_description', ''),
        app_logo: getSetting('app_logo', ''),
        app_favicon: getSetting('app_favicon', ''),
        app_timezone: getSetting('app_timezone', 'Africa/Abidjan'),
        app_locale: getSetting('app_locale', 'fr'),
        app_currency: getSetting('app_currency', 'XOF'),
        
        // Paiements
        payment_gateways: getSetting('payment_gateways', ['orange_money', 'moov_money', 'mtn_money']),
        payment_currency: getSetting('payment_currency', 'XOF'),
        payment_auto_capture: getSetting('payment_auto_capture', true),
        
        // Communication
        email_from_name: getSetting('email_from_name', 'Coovia'),
        email_from_address: getSetting('email_from_address', 'noreply@coovia.com'),
        sms_provider: getSetting('sms_provider', 'twilio'),
        sms_from_number: getSetting('sms_from_number', '+22500000000'),
        
        // Sécurité
        security_password_min_length: getSetting('security_password_min_length', 8),
        security_password_require_special: getSetting('security_password_require_special', true),
        security_session_lifetime: getSetting('security_session_lifetime', 120),
        security_max_login_attempts: getSetting('security_max_login_attempts', 5),
        security_lockout_duration: getSetting('security_lockout_duration', 15),
        
        // Fichiers
        file_max_size: getSetting('file_max_size', 10485760),
        file_allowed_types: getSetting('file_allowed_types', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf']),
        file_storage_disk: getSetting('file_storage_disk', 'cloudflare'),
        
        // Notifications
        notifications_email_enabled: getSetting('notifications_email_enabled', true),
        notifications_sms_enabled: getSetting('notifications_sms_enabled', false),
        notifications_push_enabled: getSetting('notifications_push_enabled', true),
        
        // SEO
        seo_default_title: getSetting('seo_default_title', 'Coovia - Vente de produits digitaux'),
        seo_default_description: getSetting('seo_default_description', ''),
        seo_default_keywords: getSetting('seo_default_keywords', ''),
      })
    }
  }, [settings, loading, form])

  const onSubmit = async (data: AdvancedSettingsValues) => {
    try {
      console.log('Paramètres avancés à sauvegarder:', data)
      toast.success('Paramètres avancés mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres')
    }
  }

  // Afficher le formulaire même pendant le chargement
  // if (loading) {
  //   return (
  //     <div className="space-y-8">
  //       <div className="space-y-2">
  //         <h1 className="text-2xl font-semibold tracking-tight">Paramètres avancés</h1>
  //         <p className="text-muted-foreground">
  //           Préparation des paramètres...
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  // Gestion des données manquantes (comme dans les paramètres de la boutique)
  if (loading && Object.keys(settings).length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Paramètres avancés</h1>
          <p className="text-muted-foreground">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres avancés</h1>
        <p className="text-muted-foreground">
          Configuration avancée de votre application et de votre boutique
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Application Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  {icons.building({ className: "h-4 w-4 text-primary" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Application</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration générale de l'application
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="app_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'application</FormLabel>
                      <FormControl>
                        <Input placeholder="Coovia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="app_timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuseau horaire</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un fuseau horaire" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Africa/Abidjan">Afrique/Abidjan</SelectItem>
                          <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="app_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description de votre application..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                  {icons['credit-card']({ className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Paiements</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration des passerelles de paiement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="payment_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise de paiement</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une devise" />
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
                <SettingsToggle
                  label="Capture automatique"
                  description="Capturer automatiquement les paiements"
                  checked={form.watch('payment_auto_capture')}
                  onCheckedChange={(checked) => form.setValue('payment_auto_capture', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email & SMS Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/20">
                  {icons.mail({ className: "h-4 w-4 text-violet-600 dark:text-violet-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Communication</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration des emails et SMS
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email_from_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'expéditeur</FormLabel>
                      <FormControl>
                        <Input placeholder="Coovia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_from_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl>
                        <Input placeholder="noreply@coovia.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                  {icons.shield({ className: "h-4 w-4 text-red-600 dark:text-red-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Sécurité</CardTitle>
                  <CardDescription className="text-sm">
                    Paramètres de sécurité et d'authentification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="security_password_min_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longueur minimale du mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="8" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="security_max_login_attempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tentatives de connexion max</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="5" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="security_session_lifetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée de session (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="120" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SettingsToggle
                label="Caractères spéciaux requis"
                description="Exiger des caractères spéciaux dans les mots de passe"
                checked={form.watch('security_password_require_special')}
                onCheckedChange={(checked) => form.setValue('security_password_require_special', checked)}
              />
            </CardContent>
          </Card>

          {/* File Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  {icons.file({ className: "h-4 w-4 text-amber-600 dark:text-amber-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Fichiers</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration du stockage et des types de fichiers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="file_max_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taille maximale (octets)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10485760" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Taille maximale en octets (10MB = 10485760)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file_storage_disk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disque de stockage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un disque" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cloudflare">Cloudflare R2</SelectItem>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="s3">Amazon S3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/20">
                  {icons.bell({ className: "h-4 w-4 text-cyan-600 dark:text-cyan-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Notifications</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration des canaux de notification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SettingsToggle
                  label="Emails"
                  description="Activer les notifications par email"
                  checked={form.watch('notifications_email_enabled')}
                  onCheckedChange={(checked) => form.setValue('notifications_email_enabled', checked)}
                />
                <SettingsToggle
                  label="SMS"
                  description="Activer les notifications par SMS"
                  checked={form.watch('notifications_sms_enabled')}
                  onCheckedChange={(checked) => form.setValue('notifications_sms_enabled', checked)}
                />
                <SettingsToggle
                  label="Push"
                  description="Activer les notifications push"
                  checked={form.watch('notifications_push_enabled')}
                  onCheckedChange={(checked) => form.setValue('notifications_push_enabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                  {icons.search({ className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">SEO</CardTitle>
                  <CardDescription className="text-sm">
                    Configuration du référencement naturel
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="seo_default_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre par défaut</FormLabel>
                    <FormControl>
                      <Input placeholder="Coovia - Vente de produits digitaux" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seo_default_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description par défaut</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description SEO par défaut..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seo_default_keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mots-clés par défaut</FormLabel>
                    <FormControl>
                      <Input placeholder="coovia, vente, produits, digitaux" {...field} />
                    </FormControl>
                    <FormDescription>
                      Séparez les mots-clés par des virgules
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Zone de danger */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  {icons['alert-triangle']({ className: "h-5 w-5 text-red-600 dark:text-red-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg text-red-600 dark:text-red-400">Zone de danger</CardTitle>
                  <CardDescription>
                    Actions irréversibles et potentiellement dangereuses
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Supprimer toutes les données</p>
                  <p className="text-sm text-muted-foreground">
                    Supprimer définitivement toutes les données de la boutique
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Supprimer
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Réinitialiser les paramètres</p>
                  <p className="text-sm text-muted-foreground">
                    Remettre tous les paramètres à leurs valeurs par défaut
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" className="min-w-[140px]">
              Sauvegarder
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}