export default function handler(req, res) {
  const { slug } = req.query;
  
  // Récupérer le sous-domaine depuis les headers
  const host = req.headers.host;
  const subdomain = host.split('.')[0];
  
  // Si c'est un sous-domaine (pas le domaine principal)
  if (subdomain && subdomain !== 'wozif' && subdomain !== 'www') {
    // Ici vous pouvez ajouter la logique pour récupérer les données de la boutique
    // basée sur le sous-domaine
    const storeSlug = subdomain;
    
    // Rediriger vers l'application React avec le slug de la boutique
    res.setHeader('Location', `/?store=${storeSlug}`);
    res.status(302).end();
    return;
  }
  
  // Si c'est le domaine principal, servir l'application normalement
  res.status(200).json({ 
    message: 'Store API endpoint',
    slug: slug,
    subdomain: subdomain 
  });
}
