import { z } from "zod"

export const produitSchema = z.object({
  id: z.string(),
  nom: z.string(),
  type: z.string(),
  categorie: z.string(),
  prix: z.number(),
  statut: z.string(),
  dateCreation: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  fichier: z.string().optional(),
  taille: z.string().optional(),
  version: z.string().optional(),
  telechargements: z.number().optional(),
  vues: z.number().optional(),
  ventes: z.number().optional(),
  dateMiseAJour: z.string().optional(),
})

export type Produit = z.infer<typeof produitSchema>
