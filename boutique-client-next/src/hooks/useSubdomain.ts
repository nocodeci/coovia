import { useState, useEffect } from 'react';

export const useSubdomain = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // Vérifier si c'est un sous-domaine (ex: boutique.wozif.store)
      if (hostname.includes('.') && !hostname.startsWith('www.')) {
        const parts = hostname.split('.');
        if (parts.length >= 3) {
          const potentialSubdomain = parts[0];
          // Ignorer les sous-domaines communs
          if (!['www', 'api', 'admin', 'app'].includes(potentialSubdomain)) {
            setSubdomain(potentialSubdomain);
            setIsSubdomain(true);
            return;
          }
        }
      }
      
      setIsSubdomain(false);
      setSubdomain(null);
    }
  }, []);

  return { subdomain, isSubdomain };
};

