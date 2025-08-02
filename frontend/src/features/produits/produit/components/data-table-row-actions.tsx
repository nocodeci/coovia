"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { statuses } from "../data/data"
import { produitSchema } from "../data/schema"
import { useStore } from "@/context/store-context"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import apiService from "@/lib/api"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onAction?: (action: string, product: any) => void
}

export function DataTableRowActions<TData>({ row, onAction }: DataTableRowActionsProps<TData>) {
  const produit = produitSchema.parse(row.original)
  const { currentStore } = useStore()
  const navigate = useNavigate()

  const handleAction = async (action: string) => {
    console.log(`🔄 Action ${action} pour le produit:`, produit.name, produit.id)
    
    if (!currentStore?.id) {
      toast.error("Aucune boutique sélectionnée")
      return
    }

    switch (action) {
      case "edit":
        console.log(`📝 Navigation vers l'édition: /${currentStore.id}/produits/${produit.id}/edit`)
        navigate({ to: `/${currentStore.id}/produits/${produit.id}/edit` })
        break
      
      case "duplicate":
        try {
          console.log("🔄 Début de la duplication...")
          const duplicatedProduct = {
            ...produit,
            name: `${produit.name} (Copie)`,
            sku: `${produit.sku}-copy-${Date.now()}`,
            status: 'draft'
          }
          delete duplicatedProduct.id
          delete duplicatedProduct.created_at
          delete duplicatedProduct.updated_at
          
          console.log("📡 Appel API createProduct...")
          const response = await apiService.createProduct(currentStore.id, duplicatedProduct)
          console.log("📡 Réponse API:", response)
          
          if (response.success && response.data) {
            toast.success("Produit dupliqué avec succès")
            console.log("✅ Duplication réussie")
            // Recharger la page pour afficher le nouveau produit
            window.location.reload()
          } else {
            console.error("❌ Erreur API:", response.message)
            toast.error(`Erreur lors de la duplication: ${response.message}`)
          }
        } catch (error) {
          console.error("🚨 Erreur lors de la duplication:", error)
          toast.error("Erreur lors de la duplication")
        }
        break
      
      case "download":
        toast.info("Fonctionnalité de téléchargement à implémenter")
        break
      
      case "archive":
        try {
          console.log("🔄 Début de l'archivage...")
          const response = await apiService.updateProduct(produit.id, {
            status: 'archived'
          })
          console.log("📡 Réponse API archivage:", response)
          
          if (response.success) {
            toast.success("Produit archivé avec succès")
            console.log("✅ Archivage réussi")
            window.location.reload()
          } else {
            console.error("❌ Erreur API:", response.message)
            toast.error(`Erreur lors de l'archivage: ${response.message}`)
          }
        } catch (error) {
          console.error("🚨 Erreur lors de l'archivage:", error)
          toast.error("Erreur lors de l'archivage")
        }
        break
      
      case "delete":
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${produit.name}" ? Cette action est irréversible.`)) {
          try {
            console.log("🔄 Début de la suppression...")
            const response = await apiService.deleteProduct(produit.id)
            console.log("📡 Réponse API suppression:", response)
            
            if (response.success) {
              toast.success("Produit supprimé avec succès")
              console.log("✅ Suppression réussie")
              window.location.reload()
            } else {
              console.error("❌ Erreur API:", response.message)
              toast.error(`Erreur lors de la suppression: ${response.message}`)
            }
          } catch (error) {
            console.error("🚨 Erreur lors de la suppression:", error)
            toast.error("Erreur lors de la suppression")
          }
        }
        break
      
      case "status":
        break
    }

    if (onAction) {
      onAction(action, produit)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      console.log(`🔄 Changement de statut vers: ${newStatus}`)
      const response = await apiService.updateProduct(produit.id, {
        status: newStatus
      })
      console.log("📡 Réponse API changement statut:", response)
      
      if (response.success) {
        toast.success(`Statut mis à jour vers ${newStatus}`)
        console.log("✅ Changement de statut réussi")
        window.location.reload()
      } else {
        console.error("❌ Erreur API:", response.message)
        toast.error(`Erreur lors de la mise à jour du statut: ${response.message}`)
      }
    } catch (error) {
      console.error("🚨 Erreur lors de la mise à jour du statut:", error)
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => handleAction("edit")}>
          Modifier
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("duplicate")}>
          Dupliquer
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("download")}>
          Télécharger
          <DropdownMenuShortcut>⌘↓</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Statut</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={produit.statut} onValueChange={handleStatusChange}>
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleAction("delete")}
          className="text-red-600"
        >
          Supprimer
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
