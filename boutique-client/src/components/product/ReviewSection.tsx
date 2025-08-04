import React from 'react'
import {
  StarIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  FilterIcon,
} from 'lucide-react'

interface ReviewSectionProps {
  rating?: number
  reviewCount?: number
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  rating = 4.8,
  reviewCount = 127,
}) => {
  // Sample reviews - in a real app these would come from an API
  const reviews = [
    {
      id: 'rev-001',
      author: 'Marie L.',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
      rating: 5,
      date: '12 août 2023',
      title: "Exactement ce dont j'avais besoin !",
      content:
        "Cette formation a dépassé toutes mes attentes. Le contenu est très bien structuré et les explications sont claires. J'ai pu mettre en pratique immédiatement les concepts appris. Je recommande vivement !",
      helpfulCount: 24,
    },
    {
      id: 'rev-002',
      author: 'Thomas B.',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80',
      rating: 4,
      date: '3 août 2023',
      title: 'Très bon cours, quelques améliorations possibles',
      content:
        "Le contenu est excellent et j'ai beaucoup appris. Les projets pratiques sont particulièrement utiles. J'enlève une étoile car certaines sections auraient pu être plus détaillées, notamment sur les aspects avancés du design d'interaction.",
      helpfulCount: 16,
    },
  ]

  return (
    <div id="reviews" className="mb-20">
      {/* Conteneur principal */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Graphiques</h2>
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            <FilterIcon size={16} />
            <span>Filtrer les avis</span>
          </button>
        </div>
      
      {/* Rating Overview */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 bg-blue-50 p-6 rounded-xl mb-10">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">{rating}</div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                size={20}
                className={
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200'
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            Basé sur {reviewCount} avis
          </span>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center">
              <span className="text-xs font-medium w-6 text-gray-700">
                {star}
              </span>
              <div className="h-2 mx-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium w-8 text-right text-gray-700">
                {star === 5
                  ? '70%'
                  : star === 4
                    ? '20%'
                    : star === 3
                      ? '5%'
                      : star === 2
                        ? '3%'
                        : '2%'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-gray-900">
                    {review.author}
                  </h4>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }
                      />
                    ))}
                  </div>
                </div>
                <h5 className="mt-3 text-base font-semibold text-gray-900">
                  {review.title}
                </h5>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {review.content}
                </p>
                <div className="mt-4 flex items-center text-sm border-t border-gray-100 pt-4">
                  <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <ThumbsUpIcon size={16} className="mr-1" />
                    <span>Utile ({review.helpfulCount})</span>
                  </button>
                  <span className="mx-3 text-gray-300">•</span>
                  <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircleIcon size={16} className="mr-1" />
                    <span>Répondre</span>
                  </button>
                  <span className="mx-3 text-gray-300">•</span>
                  <button className="text-gray-600 hover:text-red-600 transition-colors">
                    Signaler
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Write a Review Button */}
      <div className="mt-10 text-center">
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
          Écrire un avis
        </button>
      </div>
      </div>
    </div>
  )
}

export default ReviewSection 