import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, Download } from 'lucide-react'
import { Product } from '../../services/api'

interface ProductGalleryProps {
  product: Product;
}

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  // Images de fallback fiables
  const fallbackImages = [
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2536&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  ];

  // Utiliser les vraies images du produit ou des images de fallback
  const images = product.images && product.images.length > 0 
    ? product.images.filter(img => img && typeof img === 'string' && img.trim() !== '') // Filtrer les images vides
    : fallbackImages;

  const [mainImage, setMainImage] = useState(images[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({})

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    setCurrentIndex(newIndex)
    setMainImage(images[newIndex])
  }

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setMainImage(images[newIndex])
  }

  // Gérer les erreurs de chargement d'images
  const handleImageError = (imageUrl: string) => {
    setImageError(prev => ({ ...prev, [imageUrl]: true }));
  }

  // Obtenir une image de fallback si l'image principale ne se charge pas
  const getCurrentImage = () => {
    if (imageError[mainImage]) {
      // Si l'image principale a une erreur, utiliser la première image de fallback
      return fallbackImages[0];
    }
    return mainImage;
  }

  // Obtenir une image de fallback pour les miniatures
  const getThumbnailImage = (imageUrl: string) => {
    if (imageError[imageUrl]) {
      return fallbackImages[0];
    }
    return imageUrl;
  }

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-w-16 aspect-h-9 shadow-sm border border-gray-100">
        {/* Image */}
        <img
          src={getCurrentImage()}
          alt={`Aperçu du produit ${product.name}`}
          className="h-full w-full object-cover object-center transition-opacity duration-500"
          onError={() => handleImageError(mainImage)}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={handlePrevious}
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
              aria-label="Image précédente"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              onClick={handleNext}
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110"
              aria-label="Image suivante"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
        )}
        
        {/* Zoom button */}
        <button className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110">
          <ZoomInIcon size={20} />
        </button>

        {/* Badge pour produits numériques */}
        {product.files && product.files.length > 0 && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
            <Download className="w-4 h-4" />
            Téléchargeable
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-4 justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setMainImage(image)
                setCurrentIndex(index)
              }}
              className={`relative h-20 w-20 overflow-hidden rounded-lg transition-all duration-200 ${
                mainImage === image 
                  ? 'ring-2 ring-blue-600 scale-105 shadow-md' 
                  : 'border border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getThumbnailImage(image)}
                alt={`Miniature ${index + 1} du produit ${product.name}`}
                className="h-full w-full object-cover object-center"
                onError={() => handleImageError(image)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 