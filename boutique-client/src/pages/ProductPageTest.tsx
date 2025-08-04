import React from 'react';
import { ProductPage } from '../components/product/ProductPage';

export default function ProductPageTest() {
  // Récupérer le storeId depuis l'URL
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const storeId = pathSegments[0] || 'ma-boutique';
  const productId = 'product-123'; // ID de test

  return <ProductPage storeId={storeId} productId={productId} />;
} 