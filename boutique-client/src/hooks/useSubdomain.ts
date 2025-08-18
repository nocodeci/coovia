import { useState, useEffect } from 'react';

export const useSubdomain = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const hostParts = host.split('.');
    
    // Si nous avons plus de 2 parties et que ce n'est pas localhost
    if (hostParts.length > 2 && host !== 'localhost') {
      const potentialSubdomain = hostParts[0];
      
      // Vérifier si c'est un sous-domaine valide (pas www, etc.)
      if (potentialSubdomain && 
          potentialSubdomain !== 'www') {
        setSubdomain(potentialSubdomain);
        setIsSubdomain(true);
      }
    }
  }, []);

  return { subdomain, isSubdomain };
};
