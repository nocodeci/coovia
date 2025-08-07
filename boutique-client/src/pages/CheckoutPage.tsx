import React from 'react'
import CheckoutComplete from '../components/CheckoutComplete'

export default function CheckoutPage() {
  // Récupérer le storeId depuis l'URL
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const storeId = pathSegments[0] || 'store-123';
  
  console.log('🏪 CheckoutPage - StoreId depuis URL:', storeId);
  console.log('🌐 URL complète:', window.location.href);

  return (
    <CheckoutComplete 
      storeId={storeId}
      productId="default-product"
      productName="Produit par défaut"
      price={2000}
    />
  )
} 