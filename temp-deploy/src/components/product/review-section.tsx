'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
}

export function ReviewSection() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Données de test pour les avis
  const reviews: Review[] = [
    {
      id: 1,
      user: "Jean D.",
      rating: 5,
      date: "2024-01-15",
      title: "Excellent produit !",
      comment: "Ce produit a dépassé toutes mes attentes. La qualité est exceptionnelle et le support client est très réactif. Je recommande vivement !",
      helpful: 12
    },
    {
      id: 2,
      user: "Marie L.",
      rating: 4,
      date: "2024-01-10",
      title: "Très satisfaite",
      comment: "Bon produit, facile à utiliser. Quelques petites améliorations possibles mais dans l'ensemble je suis contente de mon achat.",
      helpful: 8
    },
    {
      id: 3,
      user: "Pierre M.",
      rating: 5,
      date: "2024-01-08",
      title: "Parfait pour mes besoins",
      comment: "Exactement ce que je cherchais. Le téléchargement était instantané et tout fonctionne parfaitement.",
      helpful: 15
    }
  ];

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Très bien';
      case 3: return 'Bien';
      case 2: return 'Moyen';
      case 1: return 'Mauvais';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avis clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Basé sur {totalReviews} avis
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (count / totalReviews) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating} étoiles</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={selectedRating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
              >
                {rating} étoiles
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews
          .filter(review => selectedRating === null || review.rating === selectedRating)
          .map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{review.user}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getRatingLabel(review.rating)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Utile ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Répondre
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Write Review Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Vous avez acheté ce produit ? Partagez votre expérience !
            </p>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              Écrire un avis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

