"use client"

import { useState } from "react"
import { ArrowLeft, MoreHorizontal, Eye, Copy, HelpCircle, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AddProductSearchBarProps {
  productName?: string
  isFormValid?: boolean
  onSave?: () => void
  onDiscard?: () => void
  onBack?: () => void
  className?: string
}

export function AddProductSearchBar({
  productName = "Produit sans titre",
  isFormValid = false,
  onSave,
  onDiscard,
  onBack,
  className = "",
}: AddProductSearchBarProps) {
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false)

  const handleSave = () => {
    if (isFormValid) {
      toast.success("Produit publié avec succès !", {
        description: "Votre produit est maintenant visible par tous les utilisateurs",
      })
    } else {
      toast.success("Brouillon sauvegardé", {
        description: "Votre produit a été sauvegardé en tant que brouillon",
      })
    }
    onSave?.()
  }

  const handleDiscard = () => {
    toast.info("Modifications annulées", {
      description: "Toutes les modifications non sauvegardées ont été supprimées",
    })
    onDiscard?.()
    setIsDiscardDialogOpen(false)
  }

  const handleBack = () => {
    onBack?.()
  }

  return (
    <div
      className={cn(
        "group relative h-10 w-full max-w-lg justify-start rounded-xl border-gray-200",
        "bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200",
        "hover:border-gray-300 hover:bg-white hover:shadow-md",
        "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
        "sm:pr-4 md:w-96 lg:w-[42rem] border flex items-center px-3 py-2",
        className,
      )}
    >
      {/* Left section - Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="h-6 w-6 p-0 flex-shrink-0 hover:bg-gray-100/80 rounded-md"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-gray-500" />
      </Button>

      {/* Product status indicator */}
      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 ml-2" />

      {/* Product name and status */}
      <div className="flex items-center gap-2 ml-2 flex-1 min-w-0">
        <span className="truncate text-sm font-normal text-gray-600 group-hover:text-gray-800">{productName}</span>
        {!isFormValid && (
          <Badge variant="secondary" className="text-xs h-4 px-1.5 flex-shrink-0 bg-gray-100 text-gray-600">
            Brouillon
          </Badge>
        )}
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100/80 rounded-md">
              <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Aperçu du produit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Dupliquer le produit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HelpCircle className="h-4 w-4 mr-2" />
              Aide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-200 mx-1" />

        {/* Discard button */}
        <AlertDialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-md"
            >
              Annuler
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Annuler les modifications ?</AlertDialogTitle>
              <AlertDialogDescription>
                Toutes les modifications non sauvegardées seront perdues. Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuer l'édition</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDiscard}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler les modifications
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Save button - styled like the kbd element */}
        <div
          className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50/80 px-2 py-1 
                     font-mono text-xs font-medium text-gray-500 shadow-sm transition-all 
                     group-hover:border-gray-300 group-hover:bg-gray-100/80 cursor-pointer hover:bg-gray-200/80"
          onClick={handleSave}
        >
          <Save className="h-3 w-3" />
          <span>{isFormValid ? "Publier" : "Enregistrer"}</span>
        </div>
      </div>
    </div>
  )
}
