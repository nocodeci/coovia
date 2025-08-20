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
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useUserProfile } from '@/hooks/useSettings'
import { toast } from 'sonner'

const accountFormSchema = z.object({
  current_password: z.string().min(1, 'Le mot de passe actuel est requis'),
  new_password: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  confirm_password: z.string().min(1, 'Confirmez le nouveau mot de passe'),
  mfa_enabled: z.boolean(),
  session_timeout: z.number().min(15, 'Minimum 15 minutes'),
  max_login_attempts: z.number().min(3, 'Minimum 3 tentatives'),
  lockout_duration: z.number().min(5, 'Minimum 5 minutes'),
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  security_alerts: z.boolean(),
  login_notifications: z.boolean(),
  device_management: z.boolean(),
  data_export: z.boolean(),
  account_deletion: z.boolean(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export default function AccountForm() {
  const { profile, loading, updateProfile } = useUserProfile()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
      mfa_enabled: profile?.preferences?.security?.mfa_enabled ?? false,
      session_timeout: profile?.preferences?.security?.session_timeout ?? 120,
      max_login_attempts: profile?.preferences?.security?.max_login_attempts ?? 5,
      lockout_duration: profile?.preferences?.security?.lockout_duration ?? 15,
      email_notifications: profile?.preferences?.notifications?.email ?? true,
      sms_notifications: profile?.preferences?.notifications?.sms ?? false,
      security_alerts: true,
      login_notifications: true,
      device_management: true,
      data_export: false,
      account_deletion: false,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: AccountFormValues) => {
    try {
      const newPreferences = {
        ...profile?.preferences,
        security: {
          mfa_enabled: data.mfa_enabled,
          session_timeout: data.session_timeout,
          max_login_attempts: data.max_login_attempts,
          lockout_duration: data.lockout_duration,
        },
        notifications: {
          ...profile?.preferences?.notifications,
          email: data.email_notifications,
          sms: data.sms_notifications,
          security_alerts: data.security_alerts,
          login_notifications: data.login_notifications,
        },
        privacy: {
          device_management: data.device_management,
          data_export: data.data_export,
          account_deletion: data.account_deletion,
        },
      }

      const result = await updateProfile({ preferences: newPreferences })
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle>Changement de mot de passe</CardTitle>
            <CardDescription>
              Mettez à jour votre mot de passe pour sécuriser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>
              Paramètres de sécurité pour protéger votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="mfa_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Authentification à deux facteurs</FormLabel>
                    <FormDescription>
                      Ajouter une couche de sécurité supplémentaire
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Notifications de sécurité */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications de Sécurité</CardTitle>
            <CardDescription>
              Choisissez quelles notifications de sécurité recevoir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="security_alerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Alertes de sécurité</FormLabel>
                    <FormDescription>
                      Être notifié des activités suspectes
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
              name="login_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notifications de connexion</FormLabel>
                    <FormDescription>
                      Être notifié des nouvelles connexions
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
              name="email_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notifications par email</FormLabel>
                    <FormDescription>
                      Recevoir les alertes par email
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
              name="sms_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notifications par SMS</FormLabel>
                    <FormDescription>
                      Recevoir les alertes par SMS
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

        {/* Gestion des appareils */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Appareils</CardTitle>
            <CardDescription>
              Gérez les appareils connectés à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="device_management"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Gestion des appareils</FormLabel>
                    <FormDescription>
                      Permettre la gestion des appareils connectés
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
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appareils actuellement connectés</p>
                  <p className="text-sm text-muted-foreground">Aucun appareil connecté</p>
                </div>
                <Button variant="outline" size="sm">
                  Voir tous les appareils
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Données et confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle>Données et Confidentialité</CardTitle>
            <CardDescription>
              Gérez vos données et paramètres de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="data_export"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Export de données</FormLabel>
                    <FormDescription>
                      Permettre l'export de vos données personnelles
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
            <FormField
              control={form.control}
              name="account_deletion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Suppression de compte</FormLabel>
                    <FormDescription>
                      Permettre la suppression définitive du compte
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

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Sauvegarder les paramètres
          </Button>
        </div>
      </form>
    </Form>
  )
}
