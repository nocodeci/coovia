import { createFileRoute } from '@tanstack/react-router';
import NouveauProduit from '@/features/produits/addproduit'; // Importez votre composant

export const Route = createFileRoute('/_authenticated/produits/addproduit/')({
  component: NouveauProduit, // Attachez le composant à la route
});