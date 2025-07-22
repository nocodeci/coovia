"use client"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Home, ChevronRight, AlertTriangle, Save, X, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  onBack?: () => void
  hasUnsavedChanges?: boolean
  currentPage?: string
  previousPage?: string
  className?: string
}

export function BackButton({
  onBack,
  hasUnsavedChanges = false,
  currentPage = "Page actuelle",
  previousPage = "Page précédente",
  className = "",
}: BackButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-collapse après inactivité
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsActive(false)
        setShowTooltip(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  // Gestion des clics extérieurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsActive(false)
        setShowTooltip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setIsDialogOpen(true)
    } else {
      onBack?.()
    }
  }

  const handleConfirmBack = () => {
    onBack?.()
    setIsDialogOpen(false)
  }

  const getStatusColor = () => {
    if (hasUnsavedChanges) return "bg-orange-400"
    return "bg-green-400"
  }

  const getStatusIcon = () => {
    if (hasUnsavedChanges) return Clock
    return CheckCircle
  }

  const StatusIcon = getStatusIcon()

  return (
    <div className={cn("relative flex items-center", className)} ref={containerRef}>
      {/* Bouton de retour */}
      <motion.div
        initial={{ width: 40, height: 40, borderRadius: 20 }}
        animate={{
          width: isActive ? 200 : 40,
          height: 40,
          borderRadius: isActive ? 20 : 20,
        }}
        transition={{
          type: "spring",
          bounce: 0.2,
          damping: 20,
          stiffness: 300,
        }}
        className="backdrop-blur-md border shadow-lg relative overflow-hidden z-[9998] cursor-pointer"
        style={{
          backgroundColor: "oklch(0.129 0.042 264.695)",
          borderColor: "oklch(0.2 0.05 264.695)",
        }}
        onClick={() => setIsActive(!isActive)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <AnimatePresence mode="wait">
          {!isActive && (
            <motion.div
              key="inactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full w-full"
            >
              {/* Indicateur de statut */}
              <div className={cn("absolute top-1 right-1 w-2 h-2 rounded-full", getStatusColor())} />

              {/* Icône de retour */}
              <ArrowLeft className="h-4 w-4 text-gray-300" />
            </motion.div>
          )}

          {isActive && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center h-full px-3 gap-2"
            >
              {/* Indicateur de statut */}
              <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", getStatusColor())} />

              {/* Icône de retour */}
              <ArrowLeft className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />

              {/* Breadcrumb */}
              <div className="flex items-center gap-1 min-w-0 text-xs">
                <Home className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <ChevronRight className="h-3 w-3 text-gray-500 flex-shrink-0" />
                <span className="text-gray-400 truncate">{previousPage}</span>
              </div>

              {/* Badge de statut */}
              {hasUnsavedChanges && (
                <Badge
                  variant="secondary"
                  className="text-xs h-4 px-1.5 flex-shrink-0 bg-orange-500/20 text-orange-300 border-orange-400/30"
                >
                  Non sauvé
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tooltip au survol */}
      <AnimatePresence>
        {showTooltip && !isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-[9999] whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <StatusIcon className="h-3 w-3" />
              <span>
                Retour vers {previousPage}
                {hasUnsavedChanges && " (modifications non sauvées)"}
              </span>
            </div>
            {/* Flèche du tooltip */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog de confirmation */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Modifications non sauvegardées
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez des modifications non sauvegardées sur cette page. Êtes-vous sûr de vouloir retourner à "
              {previousPage}" ? Toutes les modifications seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Save className="h-4 w-4 mr-2" />
              Continuer l'édition
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBack}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <X className="h-4 w-4 mr-2" />
              Abandonner les modifications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Action directe si pas de modifications */}
      {!hasUnsavedChanges && isActive && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-2 z-[9999]"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="h-8 px-3 text-xs bg-gray-800/90 text-white hover:bg-gray-700 border border-gray-600"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Retour
          </Button>
        </motion.div>
      )}
    </div>
  )
}
