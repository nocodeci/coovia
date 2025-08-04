import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart, 
  Download,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Tag,
  Package,
  X,
  Eye,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Play,
  Pause,
  ThumbsUp,
  Share,
  Flag,
  CheckCircle,
  CreditCard,
  Smartphone,
  Bitcoin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { storeService } from '../services/api';
import { Product } from '../services/api';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

interface ProductDetailProps {
  storeId: string;
  productId: string;
}

function ProductDetail({ storeId, productId }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Récupérer les données de la boutique
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
  });

  // Récupérer les détails du produit
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', storeId, productId],
    queryFn: () => storeService.getProduct(storeId, productId),
    enabled: !!storeId && !!productId,
  });

  // Méthodes de paiement
  const paymentMethods = [
    { name: "Visa", icon: CreditCard, color: "bg-blue-100 text-blue-600" },
    { name: "Mastercard", icon: CreditCard, color: "bg-red-100 text-red-600" },
    { name: "Crypto", icon: Bitcoin, color: "bg-orange-100 text-orange-600" },
    { name: "Moov Money", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
    { name: "MTN Mobile", icon: Smartphone, color: "bg-yellow-100 text-yellow-600" },
    { name: "Orange Money", icon: Smartphone, color: "bg-orange-100 text-orange-600" },
    { name: "Wave", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  ];

  // Avis fictifs
  const reviews = [
    {
      name: "Arnaud B.",
      comment: "J'ai bien reçu le guide, très utile pour démarrer sur Chariow !",
      verified: true,
      avatar: "AB",
    },
    {
      name: "Ismaël Nana N.",
      comment: "Excellent guide avec des conseils pratiques. Je recommande vivement pour tous ceux qui veulent se lancer.",
      verified: true,
      avatar: "IN",
    },
    {
      name: "Ezechias N.",
      comment: "Très efficace et bien structuré. J'ai pu créer mon premier produit grâce à ce guide.",
      verified: true,
      avatar: "EN",
    },
    {
      name: "Sylvain E.",
      comment: "Guide complet et facile à suivre. Parfait pour les débutants.",
      verified: true,
      avatar: "SE",
    },
    {
      name: "Ramus Z.",
      comment: "Excellent contenu, je le recommande !",
      verified: true,
      avatar: "RZ",
    },
  ];

  // FAQ
  const faqItems = [
    {
      id: "faq-1",
      question: "Est-ce que je dois avoir une audience pour vendre sur Chariow ?",
      answer: "Non. Chariow t'aide à créer un espace de vente professionnel, même si tu démarres de zéro. Tu peux partager le lien de ta boutique sur tes réseaux, par e-mail, sur Whatsapp et en faisant de la publicité sur Facebook. Le plus important, c'est de proposer un contenu utile, pas d'avoir des milliers d'abonnés."
    },
    {
      id: "faq-2", 
      question: "Je ne suis pas très à l'aise avec la technique… Est-ce que c'est compliqué ?",
      answer: "Pas du tout. Chariow est conçu pour être 100 % sans code. Tu peux mettre en ligne ton contenu, personnaliser ton espace, et tout automatiser (livraison, email, suivi) sans aucune compétence technique. Si tu sais remplir un formulaire, tu peux utiliser Chariow."
    },
    {
      id: "faq-3",
      question: "Quels types de contenus je peux vendre avec Chariow ?",
      answer: "Tu peux vendre tout type de contenu digital téléchargeable ou accessible en ligne : ebooks, templates, formations, séances de coaching, fichiers PDF, audios, vidéos, etc. Et tout est livré automatiquement à tes clients après l'achat."
    }
  ];

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculer la remise
  const calculateDiscount = () => {
    if (product?.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product,
        quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  // Gérer l'achat immédiat
  const handleBuyNow = () => {
    // Stocker les données du produit pour le checkout
    const checkoutData = {
      productId: product?.id,
      productName: product?.name,
      price: product?.price,
      storeId: storeId
    };
    
    console.log('🛒 ProductDetail - Données de checkout à stocker:', checkoutData);
    
    // Stocker les données du produit pour le checkout
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Rediriger vers le checkout avec le nom de la boutique
    const checkoutUrl = `/${storeId}/checkout`;
    console.log('🔗 ProductDetail - Redirection vers:', checkoutUrl);
    
    window.location.href = checkoutUrl;
  };

  // Gérer le téléchargement
  const handleDownload = () => {
    if (product?.files && product.files.length > 0) {
      const link = document.createElement('a');
      link.href = product.files[0];
      link.download = `${product.name}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Aucun fichier disponible pour le téléchargement');
    }
  };

  // Gérer le partage
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  // Toggle FAQ
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  if (storeLoading || productLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header 
          store={store} 
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Produit non trouvé</h1>
            <p className="text-slate-600 mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        </div>
        <Footer store={store} />
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header 
        store={store} 
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">{product.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contenu principal */}
            <div className="flex-1 max-w-2xl">
              {/* Titre */}
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-4">
                {product.name}
              </h1>

              {/* Statistiques */}
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2 border-r border-neutral-200 pr-4">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-600 font-medium">98% (53 Avis)</span>
                </div>
                <div className="border-r border-neutral-200 pr-4">
                  <span className="text-neutral-600 font-medium">5869 Achats</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Download className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Téléchargeable</span>
                </div>
              </div>

              {/* Image du produit */}
              <div className="mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center border border-yellow-300">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600">{product.description.substring(0, 50)}...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {product.name}
                </h2>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                  <p className="text-gray-800 italic">
                    <strong>Description détaillée :</strong>
                  </p>
                </div>

                <div className="text-gray-700 mb-6 leading-relaxed">
                  <p className="mb-4 whitespace-pre-wrap">
                    {product.description.replace(/<[^>]*>/g, '')}
                  </p>
                </div>

                {/* Caractéristiques du produit */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Caractéristiques :</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Catégorie :</strong> {product.category}</li>
                                         <li><strong>Type :</strong> {(product as any).type || 'Produit digital'}</li>
                    <li><strong>Disponibilité :</strong> {product.in_stock ? 'En stock' : 'Rupture de stock'}</li>
                    {product.tags && product.tags.length > 0 && (
                      <li><strong>Tags :</strong> {product.tags.join(', ')}</li>
                    )}
                  </ul>
                </div>

                {/* Informations supplémentaires */}
                {product.files && product.files.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">📁 Fichiers inclus :</h3>
                    <p className="text-gray-700">
                      Ce produit inclut {product.files.length} fichier{product.files.length > 1 ? 's' : ''} téléchargeable{product.files.length > 1 ? 's' : ''}.
                    </p>
                  </div>
                )}

                {/* Call to action */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                  <p className="text-gray-800">
                    <strong>Prêt à commencer ?</strong> Ce produit est conçu pour vous aider à atteindre vos objectifs.
                  </p>
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Questions Fréquentes</h2>
                <div className="space-y-2">
                  {faqItems.map((item) => (
                    <div key={item.id} className="bg-neutral-50 px-6 py-2 rounded-lg border border-neutral-200">
                      <button
                        onClick={() => toggleFAQ(item.id)}
                        className="w-full flex items-center justify-between font-semibold hover:no-underline text-left py-2"
                      >
                        <span>{item.question}</span>
                        {expandedFAQ === item.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {expandedFAQ === item.id && (
                        <div className="text-neutral-700 pt-2 pb-2">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-96 xl:w-[420px]">
              <div className="sticky top-24">
                {/* Carte de prix */}
                <div className="bg-white p-6 mb-6 border border-neutral-200 rounded-lg shadow-sm">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="text-3xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      {discount > 0 && (
                        <span className="text-lg text-neutral-500 line-through">
                          {formatPrice(product.original_price!)}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleBuyNow}
                      disabled={!product.in_stock}
                      className="w-full mb-4 text-black font-bold py-3 text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                      style={{ backgroundColor: "#FFCC00" }}
                    >
                      {product.files && product.files.length > 0 ? "Télécharger maintenant" : "Acheter maintenant"}
                    </button>
                  </div>

                  {/* Méthodes de paiement */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-neutral-500 mb-3">Moyens de paiement disponibles</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {paymentMethods.map((method, index) => (
                        <div
                          key={index}
                          className={`w-10 h-10 rounded border border-neutral-200 flex items-center justify-center ${method.color}`}
                        >
                          <method.icon className="w-5 h-5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 my-6"></div>

                  {/* Boutons d'action */}
                  <div className="grid grid-cols-3 gap-1 text-sm mb-6">
                    <button className="flex flex-col items-center gap-1 h-auto py-2 hover:bg-neutral-100 rounded transition-colors">
                      <Share className="w-4 h-4" />
                      <span className="text-xs">Partager</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 h-auto py-2 hover:bg-neutral-100 rounded transition-colors border-x border-neutral-200">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">Contacter</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 h-auto py-2 hover:bg-neutral-100 rounded transition-colors">
                      <Flag className="w-4 h-4" />
                      <span className="text-xs">Signaler</span>
                    </button>
                  </div>

                  <div className="border-t border-neutral-200 my-6"></div>

                  {/* Avis */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">Avis</h4>
                      <div className="flex items-center gap-1 text-green-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">98% (53 Avis)</span>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {reviews.map((review, index) => (
                        <div key={index} className="border-b border-neutral-200 pb-4 last:border-b-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <ThumbsUp className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-neutral-700 mb-2">{review.comment}</p>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                  {review.avatar}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm text-neutral-600 font-medium">{review.name}</span>
                                  {review.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer store={store} />
    </div>
  );
}

export default ProductDetail; 