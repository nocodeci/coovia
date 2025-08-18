export default function handler(req, res) {
  const { hostname } = req.headers;
  
  // Extraire le sous-domaine
  const hostParts = hostname.split('.');
  const subdomain = hostParts[0];
  
  // Vérifier si c'est un sous-domaine valide
  if (hostParts.length > 2 && subdomain && subdomain !== 'www') {
    // Rediriger vers l'application React avec le slug
    const targetUrl = `https://wozif.store/${subdomain}${req.url}`;
    return res.redirect(301, targetUrl);
  }
  
  // Si c'est le domaine principal, servir l'application normalement
  res.status(200).json({ 
    message: 'Subdomain handler',
    subdomain: subdomain,
    hostname: hostname
  });
}
