"use client"

import { useToast } from "../hooks/use-toast"
import { Button } from "./ui/button"
import { ToastAction } from "./ui/toast"

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Paiement réussi !",
            description: "Votre transaction a été traitée avec succès.",
          })
        }}
      >
        Toast de succès
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Erreur de paiement",
            description: "Une erreur est survenue lors du traitement.",
            variant: "destructive",
          })
        }}
      >
        Toast d'erreur
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Action requise",
            description: "Veuillez confirmer votre action.",
            action: (
              <ToastAction altText="Confirmer l'action">Confirmer</ToastAction>
            ),
          })
        }}
      >
        Toast avec action
      </Button>
    </div>
  )
} 