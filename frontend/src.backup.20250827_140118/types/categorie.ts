// src/types/index.ts

export interface Category {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
    // Ajoutez ici toutes les autres propriétés de votre catégorie si nécessaire
  }
  
  // Vous pouvez également ajouter d'autres interfaces partagées ici
  // export interface Product { /* ... */ }
  // export interface Store { /* ... */ }