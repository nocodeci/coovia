import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BoutiquePageModern from './components/BoutiquePageModern';
import ProductDetail from './components/ProductDetail';
import { ProductPage } from './components/product/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductPageTest from './pages/ProductPageTest';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { useSubdomain } from './hooks/useSubdomain';
import { storeService, Store } from './services/storeService';
import {
  Loader,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  Button,
  Badge,
  Separator,
  Footer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Status,
} from './components/ui';
import { TestComponents } from './components/ui/test-components';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { subdomain, isSubdomain } = useSubdomain();
  const [storeData, setStoreData] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les segments de l'URL
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  
  // Déterminer le storeSlug : priorité au sous-domaine, puis à l'URL
  const storeSlug = isSubdomain && subdomain ? subdomain : (pathSegments[0] || 'test-store');
  
  // Vérifier si c'est une page de détail de produit
  const isProductDetail = pathSegments.length >= 3 && pathSegments[1] === 'products';
  const productId = isProductDetail ? pathSegments[2] : null;

  // Vérifier si c'est la page de checkout
  const isCheckout = pathSegments.length >= 2 && pathSegments[1] === 'checkout';

  // Vérifier si c'est la page de test du nouveau design
  const isProductPageTest = pathSegments.length >= 2 && pathSegments[1] === 'product-test';

  // Vérifier si c'est la nouvelle page produit avec le nouveau design
  const isNewProductPage = pathSegments.length >= 3 && pathSegments[1] === 'product';
  const newProductId = isNewProductPage ? pathSegments[2] : null;

  // Vérifier si c'est la page de test des composants
  const isTestPage = pathSegments.length >= 2 && pathSegments[1] === 'test';



  // Charger les données de la boutique si c'est un sous-domaine
  useEffect(() => {
    const loadStoreData = async () => {
      if (isSubdomain && subdomain) {
        setLoading(true);
        try {
          const store = await storeService.getStoreBySlug(subdomain);
          setStoreData(store);
        } catch (error) {
          console.error('Erreur lors du chargement de la boutique:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadStoreData();
  }, [isSubdomain, subdomain]);

  console.log('🔍 Store slug from URL:', storeSlug);
  console.log('🌐 Current URL:', window.location.href);
  console.log('🏪 Is subdomain:', isSubdomain);
  console.log('📝 Subdomain:', subdomain);
  console.log('📦 Is product detail:', isProductDetail);
  console.log('🆔 Product ID:', productId);
  console.log('💳 Is checkout:', isCheckout);
  console.log('🧪 Is product page test:', isProductPageTest);
  console.log('🆕 Is new product page:', isNewProductPage);
  console.log('🆔 New Product ID:', newProductId);
  console.log('🏪 Store data:', storeData);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Loader size="lg" variant="spinner" />
            </div>
            <CardTitle className="text-primary">Chargement en cours</CardTitle>
            <CardDescription>
              Préparation de votre boutique...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Si c'est un sous-domaine mais que la boutique n'existe pas
  if (isSubdomain && !storeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                La boutique "{subdomain}" n'existe pas ou n'est pas accessible.
              </AlertDescription>
            </Alert>
            <CardTitle className="text-destructive">Boutique introuvable</CardTitle>
            <CardDescription className="mb-6">
              Nous n'avons pas pu trouver la boutique que vous recherchez.
            </CardDescription>
            <a href="https://wozif.store" className="w-full">
              <Button className="w-full">
                Retour à l'accueil
              </Button>
            </a>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
          {/* Barre de navigation */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex">
                <a href="/" className="mr-6 flex items-center space-x-2">
                  <span className="font-bold text-primary">Wozif Store</span>
                </a>
              </div>
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  {storeData && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{storeData.name}</Badge>
                      <Status variant="online">En ligne</Status>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </header>
          
          <Separator />
          
          {/* Breadcrumbs */}
          <div className="container py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {storeData && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{storeData.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                    {isProductDetail && productId && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Produit</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                    {isCheckout && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Paiement</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Contenu principal */}
          <main className="flex-1">
            {isTestPage ? (
              <TestComponents />
            ) : isProductPageTest ? (
              <ProductPageTest />
            ) : isNewProductPage && newProductId ? (
              <ProductPage storeId={storeSlug} productId={newProductId} />
            ) : isCheckout ? (
              <CheckoutPage />
            ) : isProductDetail && productId ? (
              <ProductDetail storeId={storeSlug} productId={productId} />
            ) : (
              <BoutiquePageModern storeId={storeSlug} />
            )}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App; 