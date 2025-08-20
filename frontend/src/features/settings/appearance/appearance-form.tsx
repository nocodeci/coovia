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

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto'], {
    required_error: 'Veuillez sélectionner un thème.',
  }),
  compact_mode: z.boolean(),
  show_animations: z.boolean(),
  high_contrast: z.boolean(),
  reduced_motion: z.boolean(),
  font_size: z.enum(['small', 'medium', 'large'], {
    required_error: 'Veuillez sélectionner une taille de police.',
  }),
  sidebar_collapsed: z.boolean(),
  show_breadcrumbs: z.boolean(),
  show_tooltips: z.boolean(),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export default function AppearanceForm() {
  const { profile, loading, updateProfile } = useUserProfile()

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: profile?.preferences?.theme || 'light',
      compact_mode: false,
      show_animations: true,
      high_contrast: false,
      reduced_motion: false,
      font_size: 'medium',
      sidebar_collapsed: false,
      show_breadcrumbs: true,
      show_tooltips: true,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: AppearanceFormValues) => {
    try {
      const newPreferences = {
        ...profile?.preferences,
        theme: data.theme,
        appearance: {
          compact_mode: data.compact_mode,
          show_animations: data.show_animations,
          high_contrast: data.high_contrast,
          reduced_motion: data.reduced_motion,
          font_size: data.font_size,
          sidebar_collapsed: data.sidebar_collapsed,
          show_breadcrumbs: data.show_breadcrumbs,
          show_tooltips: data.show_tooltips,
        },
      }

      const result = await updateProfile({ preferences: newPreferences })
      if (result.success) {
        toast.success('Préférences d\'apparence mises à jour')
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
        {/* Thème */}
        <Card>
          <CardHeader>
            <CardTitle>Thème</CardTitle>
            <CardDescription>
              Choisissez le thème de votre interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Mode d'affichage</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex flex-col">
                          <span className="font-medium">Clair</span>
                          <span className="text-sm text-muted-foreground">
                            Interface claire et lumineuse
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex flex-col">
                          <span className="font-medium">Sombre</span>
                          <span className="text-sm text-muted-foreground">
                            Interface sombre et élégante
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <Label htmlFor="auto" className="flex flex-col">
                          <span className="font-medium">Automatique</span>
                          <span className="text-sm text-muted-foreground">
                            Suit les préférences système
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

        {/* Accessibilité */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibilité</CardTitle>
            <CardDescription>
              Options pour améliorer l'accessibilité de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="high_contrast"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Contraste élevé</FormLabel>
                    <FormDescription>
                      Améliore la lisibilité avec un contraste plus élevé
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
              name="reduced_motion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mouvement réduit</FormLabel>
                    <FormDescription>
                      Réduit les animations pour les utilisateurs sensibles
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
              name="show_animations"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Animations</FormLabel>
                    <FormDescription>
                      Afficher les animations et transitions
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

        {/* Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="font_size"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Taille de police</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small" className="flex flex-col">
                          <span className="font-medium text-sm">Petite</span>
                          <span className="text-xs text-muted-foreground">
                            Plus d'informations à l'écran
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="flex flex-col">
                          <span className="font-medium">Moyenne</span>
                          <span className="text-sm text-muted-foreground">
                            Taille standard
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="large" id="large" />
                        <Label htmlFor="large" className="flex flex-col">
                          <span className="font-medium text-lg">Grande</span>
                          <span className="text-sm text-muted-foreground">
                            Plus facile à lire
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="compact_mode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mode compact</FormLabel>
                    <FormDescription>
                      Réduire l'espacement pour afficher plus de contenu
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
              name="sidebar_collapsed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Barre latérale réduite</FormLabel>
                    <FormDescription>
                      Réduire automatiquement la barre latérale
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
              name="show_breadcrumbs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Fil d'Ariane</FormLabel>
                    <FormDescription>
                      Afficher le fil d'Ariane pour la navigation
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
                      Afficher les infobulles d'aide au survol
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
