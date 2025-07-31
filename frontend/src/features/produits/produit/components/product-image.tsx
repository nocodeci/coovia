import { useState } from 'react'

interface ProductImageProps {
  images: string[] | null | undefined
  productName: string
  className?: string
}

export function ProductImage({ images, productName, className = "h-10 w-10" }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const firstImage = images?.[0]

  // Debug: Afficher les informations sur l'image
  console.log(`Image pour ${productName}:`, {
    hasImages: !!images,
    imagesLength: images?.length,
    firstImage: firstImage?.substring(0, 100) + '...',
    isBase64: firstImage?.startsWith('data:'),
    isUrl: firstImage?.startsWith('http')
  })

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

  // Si pas d'image ou erreur de chargement, afficher l'initiale
  if (!validImageSrc || imageError) {
    return (
      <div className={`${className} bg-gray-200 rounded flex items-center justify-center overflow-hidden`}>
        <span className="text-gray-500 text-xs font-medium">
          {productName?.charAt(0)?.toUpperCase() || 'P'}
        </span>
      </div>
    )
  }

  return (
    <div className={`${className} bg-gray-200 rounded overflow-hidden relative`}>
      <img 
        src={validImageSrc} 
        alt={productName}
        className={`${className} object-cover rounded ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
      />
      {!imageLoaded && (
        <div className={`${className} absolute inset-0 flex items-center justify-center`}>
          <span className="text-gray-500 text-xs font-medium">
            {productName?.charAt(0)?.toUpperCase() || 'P'}
          </span>
        </div>
      )}
    </div>
  )
} 