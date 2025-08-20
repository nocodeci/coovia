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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useGlobalSettings } from '@/hooks/useSettings'
import { toast } from 'sonner'
import { IconBuilding, IconCreditCard, IconMail, IconMessage, IconShield, IconFile, IconBell, IconSearch } from '@tabler/icons-react'

const parametersFormSchema = z.object({
  app_name: z.string().min(1, "Le nom de l'application est requis"),
  app_description: z.string().min(1, 'La description est requise'),
  app_logo: z.string().optional(),
  app_favicon: z.string().optional(),
  app_timezone: z.string().min(1, 'Le fuseau horaire est requis'),
  app_locale: z.string().min(1, 'La langue est requise'),
  app_currency: z.string().min(1, 'La devise est requise'),
  payment_gateways: z.array(z.string()).min(1, 'Au moins une passerelle de paiement est requise'),
  payment_currency: z.string().min(1, 'La devise de paiement est requise'),
  payment_auto_capture: z.boolean(),
  email_from_name: z.string().min(1, "Le nom de l'expéditeur est requis"),
  email_from_address: z.string().email('Adresse email invalide'),
  sms_provider: z.string().min(1, 'Le fournisseur SMS est requis'),
  sms_from_number: z.string().min(1, 'Le numéro d\'envoi SMS est requis'),
  security_password_min_length: z.number().min(6, 'Minimum 6 caractères'),
  security_password_require_special: z.boolean(),
  security_session_lifetime: z.number().min(30, 'Minimum 30 minutes'),
  security_max_login_attempts: z.number().min(1, 'Minimum 1 tentative'),
  security_lockout_duration: z.number().min(1, 'Minimum 1 minute'),
  file_max_size: z.number().min(1024, 'Minimum 1KB'),
  file_allowed_types: z.array(z.string()).min(1, 'Au moins un type de fichier est requis'),
  file_storage_disk: z.string().min(1, 'Le disque de stockage est requis'),
  notifications_email_enabled: z.boolean(),
  notifications_sms_enabled: z.boolean(),
  notifications_push_enabled: z.boolean(),
  seo_default_title: z.string().min(1, 'Le titre SEO est requis'),
  seo_default_description: z.string().min(1, 'La description SEO est requise'),
  seo_default_keywords: z.string().min(1, 'Les mots-clés SEO sont requis'),
})

type ParametersFormValues = z.infer<typeof parametersFormSchema>

export default function ParametersForm() {
  const { settings, loading, getSetting } = useGlobalSettings()

  const form = useForm<ParametersFormValues>({
    resolver: zodResolver(parametersFormSchema),
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

  const onSubmit = async (data: ParametersFormValues) => {
    try {
      // Ici vous pouvez ajouter la logique pour sauvegarder les paramètres
      console.log('Paramètres à sauvegarder:', data)
      toast.success('Paramètres mis à jour avec succès')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Application Settings */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <IconBuilding className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Application</CardTitle>
                <CardDescription>
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
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <IconCreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Paiements</CardTitle>
                <CardDescription>
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
              <FormField
                control={form.control}
                name="payment_auto_capture"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Capture automatique</FormLabel>
                      <FormDescription>
                        Capturer automatiquement les paiements
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email & SMS Settings */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <IconMail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Communication</CardTitle>
                <CardDescription>
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
        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <IconShield className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Sécurité</CardTitle>
                <CardDescription>
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
            <FormField
              control={form.control}
              name="security_password_require_special"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Caractères spéciaux requis</FormLabel>
                    <FormDescription>
                      Exiger des caractères spéciaux dans les mots de passe
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* File Settings */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <IconFile className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Fichiers</CardTitle>
                <CardDescription>
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
        <Card className="border-0 shadow-sm bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <IconBell className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  Configuration des canaux de notification
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="notifications_email_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Emails</FormLabel>
                      <FormDescription>
                        Activer les notifications par email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notifications_sms_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS</FormLabel>
                      <FormDescription>
                        Activer les notifications par SMS
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notifications_push_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Push</FormLabel>
                      <FormDescription>
                        Activer les notifications push
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <IconSearch className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg">SEO</CardTitle>
                <CardDescription>
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

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit" className="min-w-[120px]">
            Sauvegarder
          </Button>
        </div>
      </form>
    </Form>
  )
}
