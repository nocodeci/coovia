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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useUserProfile } from '@/hooks/useSettings'
import { toast } from 'sonner'

const displayFormSchema = z.object({
  sidebar_position: z.enum(['left', 'right'], {
    required_error: 'Veuillez sélectionner une position.',
  }),
  sidebar_behavior: z.enum(['fixed', 'collapsible', 'auto'], {
    required_error: 'Veuillez sélectionner un comportement.',
  }),
  header_style: z.enum(['default', 'minimal', 'compact'], {
    required_error: 'Veuillez sélectionner un style.',
  }),
  content_layout: z.enum(['centered', 'full-width', 'sidebar'], {
    required_error: 'Veuillez sélectionner une mise en page.',
  }),
  show_breadcrumbs: z.boolean(),
  show_page_title: z.boolean(),
  show_search_bar: z.boolean(),
  show_notifications: z.boolean(),
  show_user_menu: z.boolean(),
  show_help_button: z.boolean(),
  show_footer: z.boolean(),
  show_sidebar_toggle: z.boolean(),
  show_quick_actions: z.boolean(),
  show_status_bar: z.boolean(),
  show_progress_bar: z.boolean(),
  show_tooltips: z.boolean(),
  show_shortcuts: z.boolean(),
  show_animations: z.boolean(),
  show_transitions: z.boolean(),
  show_loading_states: z.boolean(),
  show_error_messages: z.boolean(),
  show_success_messages: z.boolean(),
  show_warning_messages: z.boolean(),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

export default function DisplayForm() {
  const { profile, loading, updateProfile } = useUserProfile()

  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues: {
      sidebar_position: profile?.preferences?.display?.sidebar_position || 'left',
      sidebar_behavior: profile?.preferences?.display?.sidebar_behavior || 'fixed',
      header_style: profile?.preferences?.display?.header_style || 'default',
      content_layout: profile?.preferences?.display?.content_layout || 'centered',
      show_breadcrumbs: profile?.preferences?.display?.show_breadcrumbs ?? true,
      show_page_title: profile?.preferences?.display?.show_page_title ?? true,
      show_search_bar: profile?.preferences?.display?.show_search_bar ?? true,
      show_notifications: profile?.preferences?.display?.show_notifications ?? true,
      show_user_menu: profile?.preferences?.display?.show_user_menu ?? true,
      show_help_button: profile?.preferences?.display?.show_help_button ?? false,
      show_footer: profile?.preferences?.display?.show_footer ?? true,
      show_sidebar_toggle: profile?.preferences?.display?.show_sidebar_toggle ?? true,
      show_quick_actions: profile?.preferences?.display?.show_quick_actions ?? true,
      show_status_bar: profile?.preferences?.display?.show_status_bar ?? false,
      show_progress_bar: profile?.preferences?.display?.show_progress_bar ?? true,
      show_tooltips: profile?.preferences?.display?.show_tooltips ?? true,
      show_shortcuts: profile?.preferences?.display?.show_shortcuts ?? true,
      show_animations: profile?.preferences?.display?.show_animations ?? true,
      show_transitions: profile?.preferences?.display?.show_transitions ?? true,
      show_loading_states: profile?.preferences?.display?.show_loading_states ?? true,
      show_error_messages: profile?.preferences?.display?.show_error_messages ?? true,
      show_success_messages: profile?.preferences?.display?.show_success_messages ?? true,
      show_warning_messages: profile?.preferences?.display?.show_warning_messages ?? true,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: DisplayFormValues) => {
    try {
      const newPreferences = {
        ...profile?.preferences,
        display: data,
      }

      const result = await updateProfile({ preferences: newPreferences })
      if (result.success) {
        toast.success('Préférences d\'affichage mises à jour')
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
        {/* Mise en page générale */}
        <Card>
          <CardHeader>
            <CardTitle>Mise en Page Générale</CardTitle>
            <CardDescription>
              Configurez la disposition générale de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="sidebar_position"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Position de la barre latérale</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="left" id="left" />
                        <Label htmlFor="left" className="flex flex-col">
                          <span className="font-medium">Gauche</span>
                          <span className="text-sm text-muted-foreground">
                            Barre latérale à gauche (standard)
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="right" id="right" />
                        <Label htmlFor="right" className="flex flex-col">
                          <span className="font-medium">Droite</span>
                          <span className="text-sm text-muted-foreground">
                            Barre latérale à droite
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sidebar_behavior"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Comportement de la barre latérale</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed" className="flex flex-col">
                          <span className="font-medium">Fixée</span>
                          <span className="text-sm text-muted-foreground">
                            Toujours visible
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="collapsible" id="collapsible" />
                        <Label htmlFor="collapsible" className="flex flex-col">
                          <span className="font-medium">Rétractable</span>
                          <span className="text-sm text-muted-foreground">
                            Peut être masquée
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <Label htmlFor="auto" className="flex flex-col">
                          <span className="font-medium">Automatique</span>
                          <span className="text-sm text-muted-foreground">
                            Selon la taille d'écran
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content_layout"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Mise en page du contenu</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="centered" id="centered" />
                        <Label htmlFor="centered" className="flex flex-col">
                          <span className="font-medium">Centrée</span>
                          <span className="text-sm text-muted-foreground">
                            Contenu centré avec marges
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full-width" id="full-width" />
                        <Label htmlFor="full-width" className="flex flex-col">
                          <span className="font-medium">Pleine largeur</span>
                          <span className="text-sm text-muted-foreground">
                            Utilise toute la largeur
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sidebar" id="sidebar" />
                        <Label htmlFor="sidebar" className="flex flex-col">
                          <span className="font-medium">Avec sidebar</span>
                          <span className="text-sm text-muted-foreground">
                            Contenu + barre latérale
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Éléments d'interface */}
        <Card>
          <CardHeader>
            <CardTitle>Éléments d'Interface</CardTitle>
            <CardDescription>
              Choisissez quels éléments afficher dans l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_breadcrumbs"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Fil d'Ariane</FormLabel>
                      <FormDescription>
                        Afficher le fil de navigation
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
                name="show_page_title"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Titre de page</FormLabel>
                      <FormDescription>
                        Afficher le titre de la page
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_search_bar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Barre de recherche</FormLabel>
                      <FormDescription>
                        Afficher la barre de recherche
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
                name="show_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notifications</FormLabel>
                      <FormDescription>
                        Afficher les notifications
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_user_menu"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Menu utilisateur</FormLabel>
                      <FormDescription>
                        Afficher le menu utilisateur
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
                name="show_help_button"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Bouton d'aide</FormLabel>
                      <FormDescription>
                        Afficher le bouton d'aide
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_footer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Pied de page</FormLabel>
                      <FormDescription>
                        Afficher le pied de page
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
                name="show_sidebar_toggle"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Bouton sidebar</FormLabel>
                      <FormDescription>
                        Afficher le bouton de toggle sidebar
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

        {/* Fonctionnalités avancées */}
        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités Avancées</CardTitle>
            <CardDescription>
              Options avancées pour l'expérience utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_quick_actions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Actions rapides</FormLabel>
                      <FormDescription>
                        Afficher les actions rapides
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
                name="show_status_bar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Barre de statut</FormLabel>
                      <FormDescription>
                        Afficher la barre de statut
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_progress_bar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Barre de progression</FormLabel>
                      <FormDescription>
                        Afficher les barres de progression
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
                name="show_tooltips"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Infobulles</FormLabel>
                      <FormDescription>
                        Afficher les infobulles d'aide
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_shortcuts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Raccourcis clavier</FormLabel>
                      <FormDescription>
                        Afficher les raccourcis clavier
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
                name="show_loading_states"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">États de chargement</FormLabel>
                      <FormDescription>
                        Afficher les indicateurs de chargement
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

        {/* Animations et transitions */}
        <Card>
          <CardHeader>
            <CardTitle>Animations et Transitions</CardTitle>
            <CardDescription>
              Configurez les animations et transitions de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="show_animations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Animations</FormLabel>
                      <FormDescription>
                        Activer les animations d'interface
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
                name="show_transitions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Transitions</FormLabel>
                      <FormDescription>
                        Activer les transitions entre pages
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

        {/* Messages et notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Messages et Notifications</CardTitle>
            <CardDescription>
              Configurez l'affichage des messages système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="show_success_messages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Messages de succès</FormLabel>
                      <FormDescription>
                        Afficher les messages de succès
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
                name="show_error_messages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Messages d'erreur</FormLabel>
                      <FormDescription>
                        Afficher les messages d'erreur
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
                name="show_warning_messages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Messages d'avertissement</FormLabel>
                      <FormDescription>
                        Afficher les messages d'avertissement
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

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Sauvegarder les préférences
          </Button>
        </div>
      </form>
    </Form>
  )
}
