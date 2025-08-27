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
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useUserProfile } from '@/hooks/useSettings'
import { toast } from 'sonner'

const notificationsFormSchema = z.object({
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  push_notifications: z.boolean(),
  new_orders: z.boolean(),
  payment_received: z.boolean(),
  product_updates: z.boolean(),
  marketing_emails: z.boolean(),
  security_alerts: z.boolean(),
  system_maintenance: z.boolean(),
  weekly_reports: z.boolean(),
  monthly_reports: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

export default function NotificationsForm() {
  const { profile, loading, updateProfile } = useUserProfile()

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      email_notifications: profile?.preferences?.notifications?.email ?? true,
      sms_notifications: profile?.preferences?.notifications?.sms ?? false,
      push_notifications: profile?.preferences?.notifications?.push ?? true,
      new_orders: true,
      payment_received: true,
      product_updates: true,
      marketing_emails: false,
      security_alerts: true,
      system_maintenance: true,
      weekly_reports: false,
      monthly_reports: true,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: NotificationsFormValues) => {
    try {
      const newPreferences = {
        ...profile?.preferences,
        notifications: {
          email: data.email_notifications,
          sms: data.sms_notifications,
          push: data.push_notifications,
        },
        notification_types: {
          new_orders: data.new_orders,
          payment_received: data.payment_received,
          product_updates: data.product_updates,
          marketing_emails: data.marketing_emails,
          security_alerts: data.security_alerts,
          system_maintenance: data.system_maintenance,
          weekly_reports: data.weekly_reports,
          monthly_reports: data.monthly_reports,
        },
      }

      const result = await updateProfile({ preferences: newPreferences })
      if (result.success) {
        toast.success('Préférences de notification mises à jour')
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des préférences')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des préférences...</p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Canaux de notification */}
        <Card>
          <CardHeader>
            <CardTitle>Canaux de Notification</CardTitle>
            <CardDescription>
              Choisissez comment vous souhaitez recevoir vos notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notifications par email</FormLabel>
                    <FormDescription>
                      Recevoir les notifications par email
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
                      Recevoir les notifications par SMS
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
              name="push_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notifications push</FormLabel>
                    <FormDescription>
                      Recevoir les notifications push dans l'application
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

        {/* Types de notification */}
        <Card>
          <CardHeader>
            <CardTitle>Types de Notification</CardTitle>
            <CardDescription>
              Choisissez quels types de notifications vous souhaitez recevoir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="new_orders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Nouvelles commandes</FormLabel>
                    <FormDescription>
                      Être notifié quand vous recevez une nouvelle commande
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
              name="payment_received"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Paiements reçus</FormLabel>
                    <FormDescription>
                      Être notifié quand un paiement est reçu
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
              name="product_updates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mises à jour de produits</FormLabel>
                    <FormDescription>
                      Être notifié des nouvelles fonctionnalités et améliorations
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
              name="security_alerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Alertes de sécurité</FormLabel>
                    <FormDescription>
                      Être notifié des activités suspectes sur votre compte
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
              name="system_maintenance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Maintenance système</FormLabel>
                    <FormDescription>
                      Être notifié des maintenances planifiées
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

        {/* Rapports et analyses */}
        <Card>
          <CardHeader>
            <CardTitle>Rapports et Analyses</CardTitle>
            <CardDescription>
              Configurez la fréquence des rapports automatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="weekly_reports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Rapports hebdomadaires</FormLabel>
                    <FormDescription>
                      Recevoir un résumé hebdomadaire de vos activités
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
              name="monthly_reports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Rapports mensuels</FormLabel>
                    <FormDescription>
                      Recevoir un rapport mensuel détaillé de vos performances
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

        {/* Marketing */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing et Promotions</CardTitle>
            <CardDescription>
              Gérer les communications marketing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Emails marketing</FormLabel>
                    <FormDescription>
                      Recevoir des offres spéciales et des promotions
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

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Sauvegarder les préférences
          </Button>
        </div>
      </form>
    </Form>
  )
}
