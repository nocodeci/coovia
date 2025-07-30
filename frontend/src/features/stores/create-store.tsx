import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Smile, Users, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface CreateStoreProps {
  onBack?: () => void
}

export function CreateStore({ onBack }: CreateStoreProps) {
  const navigate = useNavigate()
  const [selectedExperience, setSelectedExperience] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience)
  }

  const handleContinue = () => {
    if (!selectedExperience) {
      toast.error("Veuillez sélectionner votre niveau d'expérience")
      return
    }
    
    // Ici vous pouvez ajouter la logique pour passer à l'étape suivante
    setCurrentStep(currentStep + 1)
    toast.success("Étape suivante")
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else if (onBack) {
      onBack()
    } else {
      navigate({ to: "/store-selection" })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header avec logo */}
        <div className="flex justify-between items-center p-8 pb-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Coovia</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Preview</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal avec scroll */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Barre de progression */}
          <div className="mb-8">
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`w-12 h-2 rounded-full transition-all duration-300 ${
                    index + 1 <= currentStep 
                      ? "bg-primary" 
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Contenu de l'étape */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Quelle est votre expérience de la vente en ligne ?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Parlez-nous de votre niveau d'expérience afin que nous puissions personnaliser la configuration de votre boutique.
            </p>

            <div className="space-y-4">
              {/* Option Débutant */}
              <button
                className="w-full text-left group"
                onClick={() => handleExperienceSelect("just_starting")}
              >
                <div className={`p-6 border rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  selectedExperience === "just_starting" 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/30 hover:bg-card/50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        selectedExperience === "just_starting"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                      }`}>
                        <Smile className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-semibold text-lg text-foreground block">
                          Je suis débutant
                        </span>
                        <span className="text-muted-foreground text-sm">
                          Je découvre la vente en ligne
                        </span>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedExperience === "just_starting"}
                      onCheckedChange={() => handleExperienceSelect("just_starting")}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </div>
              </button>

              {/* Option Expérimenté */}
              <button
                className="w-full text-left group"
                onClick={() => handleExperienceSelect("already_selling")}
              >
                <div className={`p-6 border rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  selectedExperience === "already_selling" 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/30 hover:bg-card/50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        selectedExperience === "already_selling"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                      }`}>
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-semibold text-lg text-foreground block">
                          Je suis expérimenté
                        </span>
                        <span className="text-muted-foreground text-sm">
                          J'ai déjà vendu en ligne
                        </span>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedExperience === "already_selling"}
                      onCheckedChange={() => handleExperienceSelect("already_selling")}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Boutons de navigation */}
        <div className="p-8 border-t border-border flex justify-between gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="border-border hover:border-border/80 bg-card/70 backdrop-blur-sm hover:bg-card rounded-2xl px-6 py-3 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedExperience}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  )
} 