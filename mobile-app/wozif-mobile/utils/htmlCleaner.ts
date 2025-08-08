/**
 * Nettoie le HTML en supprimant les balises et en convertissant les entités HTML
 */
export function cleanHtml(html: string): string {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .replace(/&nbsp;/g, ' ') // Remplace &nbsp; par un espace
    .replace(/&amp;/g, '&') // Remplace &amp; par &
    .replace(/&lt;/g, '<') // Remplace &lt; par <
    .replace(/&gt;/g, '>') // Remplace &gt; par >
    .replace(/&quot;/g, '"') // Remplace &quot; par "
    .replace(/&#39;/g, "'") // Remplace &#39; par '
    .replace(/&#x27;/g, "'") // Remplace &#x27; par '
    .replace(/&#x2F;/g, '/') // Remplace &#x2F; par /
    .replace(/&apos;/g, "'") // Remplace &apos; par '
    .trim(); // Supprime les espaces en début/fin
}

/**
 * Formate un prix en FCFA avec séparateurs de milliers
 * Les prix sont déjà en FCFA dans la base de données
 */
export function formatFCFA(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

/**
 * Récupère la valeur de stock d'un produit
 * Gère les différents noms de champs possibles
 */
export function getProductStock(product: any): number {
  return product.stock || product.stock_quantity || 0;
}
