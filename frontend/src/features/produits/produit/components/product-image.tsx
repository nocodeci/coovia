import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface ProductImageProps {
  images: any[] | null | undefined
  productName: string
  className?: string
}

export function ProductImage({ images, productName, className = "h-10 w-10" }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Prendre la première image du produit
  const firstImage = images?.[0]

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Si l'image est un objet média (depuis la bibliothèque média)
  const getImageSrc = () => {
    if (!firstImage) return null
    
    // Si c'est un objet média avec thumbnail
    if (typeof firstImage === 'object' && firstImage.thumbnail) {
      return firstImage.thumbnail
    }
    
    // Si c'est un objet média avec url
    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url
    }
    
    // Si c'est une chaîne (ancien format)
    if (typeof firstImage === 'string') {
      return firstImage
    }
    
    return null
  }

  const imageSrc = getImageSrc()

  return (
    <div className={`${className} bg-gray-200 rounded overflow-hidden relative flex items-center justify-center`}>
      {imageSrc && !imageError ? (
        <img 
          src={imageSrc} 
          alt={productName}
          className={`${className} object-cover rounded ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : null}
      
      {(!imageSrc || imageError || !imageLoaded) && (
        <div className="flex items-center justify-center">
          <ImageIcon className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </div>
  )
} 