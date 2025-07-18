import { createFileRoute } from '@tanstack/react-router';
import AddPromoCode from '@/features/marketing/ajouter';

export const Route = createFileRoute('/_authenticated/marketing/ajouter/')({
  component:  AddPromoCode, // Attachez le composant à la route
});