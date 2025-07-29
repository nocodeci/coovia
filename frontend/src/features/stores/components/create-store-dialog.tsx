"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Store } from "@/types/store"

const createStoreSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  plan: z.enum(["starter", "professional", "enterprise"]),
  currency: z.string().default("XOF"),
  language: z.string().default("fr"),
  timezone: z.string().default("Africa/Abidjan"),
})

type CreateStoreFormData = z.infer<typeof createStoreSchema>

interface CreateStoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStoreCreated: (store: Store) => void
}

export function CreateStoreDialog({ open, onOpenChange, onStoreCreated }: CreateStoreDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      description: "",
      plan: "starter",
      currency: "XOF",
      language: "fr",
      timezone: "Africa/Abidjan",
    },
  })

  const onSubmit = async (data: CreateStoreFormData) => {
    setIsLoading(true)

    try {
      // Simuler la création d'une boutique
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newStore: Store = {
        id: `store_${Date.now()}`,
        name: data.name,
        description: data.description,
        status: "active",
        plan: data.plan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          currency: data.currency,
          language: data.language,
          timezone: data.timezone,
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
          features: {
            inventory: data.plan !== "starter",
            analytics: data.plan === "enterprise",
            multiChannel: data.plan === "enterprise",
            customDomain: data.plan !== "starter",
          },
        },
        stats: {
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          conversionRate: 0,
          averageOrderValue: 0,
        },
        contact: {
          email: "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            country: "Côte d'Ivoire",
            postalCode: "",
          },
        },
      }

      toast.success("Boutique créée avec succès!")
      onStoreCreated(newStore)
      form.reset()
    } catch (error) {
      toast.error("Erreur lors de la création de la boutique")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle boutique</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer votre nouvelle boutique.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la boutique</FormLabel>
                  <FormControl>
                    <Input placeholder="Ma Super Boutique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Décrivez votre boutique..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="starter">Starter - Gratuit</SelectItem>
                      <SelectItem value="professional">Professional - 29€/mois</SelectItem>
                      <SelectItem value="enterprise">Enterprise - 99€/mois</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Vous pourrez changer de plan plus tard dans les paramètres.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer la boutique"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
