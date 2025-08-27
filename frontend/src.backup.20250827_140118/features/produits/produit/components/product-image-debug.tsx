import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, X } from 'lucide-react'

interface ProductImageDebugProps {
  images: string[] | null | undefined
  productName: string
  className?: string
}

export function ProductImageDebug({ images, productName, className = "h-10 w-10" }: ProductImageDebugProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const firstImage = images?.[0]

  // Debug: Afficher les informations sur l'image (une seule fois)
  useEffect(() => {
    console.log(`DEBUG - Image pour ${productName}:`, {
      hasImages: !!images,
      imagesLength: images?.length,
      firstImage: firstImage?.substring(0, 100) + '...',
      isBase64: firstImage?.startsWith('data:'),
      isUrl: firstImage?.startsWith('http'),
      imageLength: firstImage?.length
    })
  }, [productName, images, firstImage])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Erreur de chargement d'image pour ${productName}:`, e)
    setImageError(true)
  }

  const handleImageLoad = () => {
    console.log(`Image chargée avec succès pour ${productName}`)
    setImageLoaded(true)
  }

  // Fonction pour valider et nettoyer l'image
  const getValidImageSrc = (imageSrc: string) => {
    // Si c'est déjà une URL valide
    if (imageSrc.startsWith('http')) {
      return imageSrc
    }
    
    // Si c'est un base64, vérifier qu'il est complet
    if (imageSrc.startsWith('data:')) {
      // Vérifier que le base64 n'est pas tronqué
      if (imageSrc.length > 100) {
        return imageSrc
      }
    }
    
    return null
  }

  // Obtenir l'image valide
  const validImageSrc = firstImage ? getValidImageSrc(firstImage) : null

  return (
    <div className="flex items-center space-x-2">
      {/* Image normale */}
      <div className={`${className} bg-gray-200 rounded overflow-hidden relative`}>
        {validImageSrc && !imageError ? (
          <img 
            src={validImageSrc} 
            alt={productName}
            className={`${className} object-cover rounded ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
        ) : null}
        {(!validImageSrc || imageError || !imageLoaded) && (
          <div className={`${className} absolute inset-0 flex items-center justify-center`}>
            <span className="text-gray-500 text-xs font-medium">
              {productName?.charAt(0)?.toUpperCase() || 'P'}
            </span>
          </div>
        )}
      </div>

      {/* Bouton de débogage */}
      {validImageSrc && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Eye className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Débogage Image - {productName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p><strong>Nom du produit:</strong> {productName}</p>
                <p><strong>Nombre d'images:</strong> {images?.length || 0}</p>
                <p><strong>Type d'image:</strong> {validImageSrc?.startsWith('data:') ? 'Base64' : 'URL'}</p>
                <p><strong>Longueur de l'image:</strong> {validImageSrc?.length || 0} caractères</p>
                <p><strong>Statut:</strong> {imageError ? 'Erreur' : imageLoaded ? 'Chargée' : 'Chargement...'}</p>
              </div>
              
              {validImageSrc && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Aperçu de l'image:</p>
                  <div className="border rounded p-4 bg-gray-50">
                    <img 
                      src={validImageSrc} 
                      alt={productName}
                      className="max-w-full max-h-96 object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              )}
              
              {firstImage && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Données brutes (premiers 500 caractères):</p>
                  <div className="border rounded p-4 bg-gray-50 text-xs font-mono overflow-auto max-h-32">
                    {firstImage.substring(0, 500)}...
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 