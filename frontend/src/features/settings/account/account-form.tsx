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
import { useUserProfile } from '@/hooks/useSettings'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useOptimizedIcons } from '@/hooks/use-optimized-icons'
import { SettingsToggle } from '@/components/ui/settings-toggle'

const accountFormSchema = z.object({
  // Informations personnelles
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  display_name: z.string().min(2, 'Le nom d\'affichage doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'La bio ne doit pas dépasser 500 caractères').optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  company: z.string().max(100, 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères').optional(),
  job_title: z.string().max(100, 'Le titre de poste ne doit pas dépasser 100 caractères').optional(),
  location: z.string().max(100, 'La localisation ne doit pas dépasser 100 caractères').optional(),
  timezone: z.string().min(1, 'Le fuseau horaire est requis'),
  language: z.string().min(1, 'La langue est requise'),
  currency: z.string().min(1, 'La devise est requise'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  nationality: z.string().max(50, 'La nationalité ne doit pas dépasser 50 caractères').optional(),
  
  // Liens sociaux
  social_linkedin: z.string().url('URL LinkedIn invalide').optional().or(z.literal('')),
  social_twitter: z.string().url('URL Twitter invalide').optional().or(z.literal('')),
  social_facebook: z.string().url('URL Facebook invalide').optional().or(z.literal('')),
  social_instagram: z.string().url('URL Instagram invalide').optional().or(z.literal('')),
  social_youtube: z.string().url('URL YouTube invalide').optional().or(z.literal('')),
  
  // Sécurité
  current_password: z.string().min(1, 'Le mot de passe actuel est requis'),
  new_password: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  confirm_password: z.string().min(1, 'Confirmez le nouveau mot de passe'),
  mfa_enabled: z.boolean(),
  session_timeout: z.number().min(15, 'Minimum 15 minutes'),
  max_login_attempts: z.number().min(3, 'Minimum 3 tentatives'),
  lockout_duration: z.number().min(5, 'Minimum 5 minutes'),
  
  // Notifications
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  push_notifications: z.boolean(),
  security_alerts: z.boolean(),
  login_notifications: z.boolean(),
  
  // Confidentialité
  profile_visible: z.boolean(),
  show_email: z.boolean(),
  show_phone: z.boolean(),
  device_management: z.boolean(),
  data_export: z.boolean(),
  account_deletion: z.boolean(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export default function AccountForm() {
  const { profile, updateProfile, loading } = useUserProfile()
  const { icons } = useOptimizedIcons()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      // Informations personnelles
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      display_name: profile?.display_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      website: profile?.website || '',
      company: profile?.company || '',
      job_title: profile?.job_title || '',
      location: profile?.location || '',
      timezone: profile?.timezone || 'Africa/Abidjan',
      language: profile?.language || 'fr',
      currency: profile?.currency || 'XOF',
      gender: profile?.gender,
      nationality: profile?.nationality || '',
      
      // Liens sociaux
      social_linkedin: profile?.social_links?.linkedin || '',
      social_twitter: profile?.social_links?.twitter || '',
      social_facebook: profile?.social_links?.facebook || '',
      social_instagram: profile?.social_links?.instagram || '',
      social_youtube: profile?.social_links?.youtube || '',
      
      // Sécurité
      current_password: '',
      new_password: '',
      confirm_password: '',
      mfa_enabled: profile?.preferences?.security?.mfa_enabled ?? false,
      session_timeout: profile?.preferences?.security?.session_timeout ?? 120,
      max_login_attempts: profile?.preferences?.security?.max_login_attempts ?? 5,
      lockout_duration: profile?.preferences?.security?.lockout_duration ?? 15,
      
      // Notifications
      email_notifications: profile?.preferences?.notifications?.email ?? true,
      sms_notifications: profile?.preferences?.notifications?.sms ?? false,
      push_notifications: profile?.preferences?.notifications?.push ?? true,
      security_alerts: true,
      login_notifications: true,
      
      // Confidentialité
      profile_visible: profile?.preferences?.privacy?.profile_visible ?? true,
      show_email: profile?.preferences?.privacy?.show_email ?? false,
      show_phone: profile?.preferences?.privacy?.show_phone ?? false,
      device_management: true,
      data_export: false,
      account_deletion: false,
    },
    mode: 'onChange',
  })

  // Mettre à jour le formulaire quand le profil change
  useEffect(() => {
    console.log('🔄 AccountForm useEffect:', { profile, loading })
    if (profile) {
      console.log('🔄 Mise à jour du formulaire avec les données du profil:', profile)
      form.reset({
        // Informations personnelles
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        display_name: profile.display_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        website: profile.website || '',
        company: profile.company || '',
        job_title: profile.job_title || '',
        location: profile.location || '',
        timezone: profile.timezone || 'Africa/Abidjan',
        language: profile.language || 'fr',
        currency: profile.currency || 'XOF',
        gender: profile.gender,
        nationality: profile.nationality || '',
        
        // Liens sociaux
        social_linkedin: profile.social_links?.linkedin || '',
        social_twitter: profile.social_links?.twitter || '',
        social_facebook: profile.social_links?.facebook || '',
        social_instagram: profile.social_links?.instagram || '',
        social_youtube: profile.social_links?.youtube || '',
        
        // Sécurité
        current_password: '',
        new_password: '',
        confirm_password: '',
        mfa_enabled: profile.preferences?.security?.mfa_enabled ?? false,
        session_timeout: profile.preferences?.security?.session_timeout ?? 120,
        max_login_attempts: profile.preferences?.security?.max_login_attempts ?? 5,
        lockout_duration: profile.preferences?.security?.lockout_duration ?? 15,
        
        // Notifications
        email_notifications: profile.preferences?.notifications?.email ?? true,
        sms_notifications: profile.preferences?.notifications?.sms ?? false,
        push_notifications: profile.preferences?.notifications?.push ?? true,
        security_alerts: true,
        login_notifications: true,
        
        // Confidentialité
        profile_visible: profile.preferences?.privacy?.profile_visible ?? true,
        show_email: profile.preferences?.privacy?.show_email ?? false,
        show_phone: profile.preferences?.privacy?.show_phone ?? false,
        device_management: true,
        data_export: false,
        account_deletion: false,
      })
    }
  }, [profile, form])

  const onSubmit = async (data: AccountFormValues) => {
    try {
      const profileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        display_name: data.display_name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        website: data.website,
        company: data.company,
        job_title: data.job_title,
        location: data.location,
        timezone: data.timezone,
        language: data.language,
        currency: data.currency,
        gender: data.gender,
        nationality: data.nationality,
        social_links: {
          linkedin: data.social_linkedin,
          twitter: data.social_twitter,
          facebook: data.social_facebook,
          instagram: data.social_instagram,
          youtube: data.social_youtube,
        },
        preferences: {
        ...profile?.preferences,
        security: {
          mfa_enabled: data.mfa_enabled,
          session_timeout: data.session_timeout,
          max_login_attempts: data.max_login_attempts,
          lockout_duration: data.lockout_duration,
        },
        notifications: {
          email: data.email_notifications,
          sms: data.sms_notifications,
            push: data.push_notifications,
          security_alerts: data.security_alerts,
          login_notifications: data.login_notifications,
        },
        privacy: {
            profile_visible: data.profile_visible,
            show_email: data.show_email,
            show_phone: data.show_phone,
          device_management: data.device_management,
          data_export: data.data_export,
          account_deletion: data.account_deletion,
          },
        },
      }

      const result = await updateProfile(profileData)
      if (result.success) {
        toast.success('Paramètres de compte mis à jour')
        // Réinitialiser les champs de mot de passe
        form.reset({
          ...form.getValues(),
          current_password: '',
          new_password: '',
          confirm_password: '',
        })
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres')
    }
  }

  // Afficher le formulaire même pendant le chargement
  // if (loading) {
  //   return (
  //     <div className="space-y-8">
  //       <div className="space-y-2">
  //         <h1 className="text-2xl font-semibold tracking-tight">Paramètres du compte</h1>
  //         <p className="text-muted-foreground">
  //           Préparation de votre profil...
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  // Gestion des données manquantes (comme dans les paramètres de la boutique)
  if (loading && !profile) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Paramètres du compte</h1>
          <p className="text-muted-foreground">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres du compte</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles, sécurité et préférences
        </p>
      </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations personnelles */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  {icons.user({ className: "h-4 w-4 text-primary" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Informations personnelles</CardTitle>
                  <CardDescription className="text-sm">
                    Vos informations de base et coordonnées
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'affichage</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom d'affichage" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ce nom sera visible publiquement sur votre profil
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre@email.com" {...field} />
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
                        <Input placeholder="+33 1 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Parlez-nous de vous..." 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Une brève description de vous-même
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poste</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre poste" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville, Pays" {...field} />
                      </FormControl>
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
              </div>
            </CardContent>
          </Card>

          {/* Liens sociaux */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                  {icons.globe({ className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Liens sociaux</CardTitle>
                  <CardDescription className="text-sm">
                    Vos profils sur les réseaux sociaux
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="social_linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/votre-profil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/votre-profil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="social_facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/votre-profil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="social_instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/votre-profil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="social_youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/@votre-chaine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                  {icons.shield({ className: "h-4 w-4 text-red-600 dark:text-red-400" })}
                </div>
                <div>
                  <CardTitle className="text-lg font-medium">Sécurité</CardTitle>
                  <CardDescription className="text-sm">
                    Paramètres de sécurité pour protéger votre compte
            </CardDescription>
                </div>
              </div>
          </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Changement de mot de passe</h4>
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Entrez votre mot de passe actuel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Entrez le nouveau mot de passe" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimum 8 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirmez le nouveau mot de passe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
                  </div>
              <Separator />
              <SettingsToggle
                label="Authentification à deux facteurs"
                description="Ajouter une couche de sécurité supplémentaire"
                checked={form.watch('mfa_enabled')}
                onCheckedChange={(checked) => form.setValue('mfa_enabled', checked)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="session_timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout de session (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="15" 
                        max="1440"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Durée avant déconnexion automatique
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_login_attempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tentatives max de connexion</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="3" 
                        max="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Avant verrouillage du compte
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lockout_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée de verrouillage (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="5" 
                        max="60"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Après échec de connexion
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
                    Configurez vos préférences de notification
            </CardDescription>
                  </div>
                  </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingsToggle
                  label="Notifications par email"
                  description="Recevoir les notifications par email"
                  checked={form.watch('email_notifications')}
                  onCheckedChange={(checked) => form.setValue('email_notifications', checked)}
                />
                <SettingsToggle
                  label="Notifications par SMS"
                  description="Recevoir les notifications par SMS"
                  checked={form.watch('sms_notifications')}
                  onCheckedChange={(checked) => form.setValue('sms_notifications', checked)}
                />
                <SettingsToggle
                  label="Notifications push"
                  description="Recevoir les notifications push dans l'application"
                  checked={form.watch('push_notifications')}
                  onCheckedChange={(checked) => form.setValue('push_notifications', checked)}
                />
                <SettingsToggle
                  label="Alertes de sécurité"
                  description="Être notifié des activités suspectes"
                  checked={form.watch('security_alerts')}
                  onCheckedChange={(checked) => form.setValue('security_alerts', checked)}
                />
                  </div>
          </CardContent>
        </Card>

          {/* Confidentialité */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/20">
                  {icons.settings({ className: "h-4 w-4 text-violet-600 dark:text-violet-400" })}
                  </div>
                <div>
                  <CardTitle className="text-lg font-medium">Confidentialité</CardTitle>
                  <CardDescription className="text-sm">
                    Gérez vos paramètres de confidentialité et de données
                  </CardDescription>
                </div>
              </div>
          </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingsToggle
                  label="Profil visible"
                  description="Rendre votre profil visible publiquement"
                  checked={form.watch('profile_visible')}
                  onCheckedChange={(checked) => form.setValue('profile_visible', checked)}
                />
                <SettingsToggle
                  label="Afficher l'email"
                  description="Afficher votre email sur votre profil public"
                  checked={form.watch('show_email')}
                  onCheckedChange={(checked) => form.setValue('show_email', checked)}
                />
                <SettingsToggle
                  label="Afficher le téléphone"
                  description="Afficher votre numéro de téléphone sur votre profil public"
                  checked={form.watch('show_phone')}
                  onCheckedChange={(checked) => form.setValue('show_phone', checked)}
                />
                <SettingsToggle
                  label="Gestion des appareils"
                  description="Permettre la gestion des appareils connectés"
                  checked={form.watch('device_management')}
                  onCheckedChange={(checked) => form.setValue('device_management', checked)}
                />
              </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Télécharger vos données</p>
                  <p className="text-sm text-muted-foreground">Obtenir une copie de vos données</p>
                </div>
                <Button variant="outline" size="sm">
                  Exporter
                </Button>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Zone de danger</p>
                  <p className="text-sm text-muted-foreground">Supprimer définitivement votre compte</p>
                </div>
                <Button variant="destructive" size="sm">
                  Supprimer le compte
                </Button>
              </div>
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
