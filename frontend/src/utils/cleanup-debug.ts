// Script pour nettoyer les logs de debug et améliorer les performances
export function cleanupDebugLogs() {
  // Réduire la verbosité des logs en production
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {}
    console.debug = () => {}
  }
  
  // Nettoyer les logs de debug spécifiques
  const originalLog = console.log
  console.log = (...args) => {
    const message = args[0]
    
    // Filtrer les logs de debug trop verbeux
    if (typeof message === 'string') {
      if (message.includes('🔄 Chargement des produits') && 
          message.includes('pour la boutique')) {
        // Ne logger qu'une fois par seconde
        return
      }
      
      if (message.includes('📡 Réponse API produits')) {
        // Réduire la fréquence des logs de réponse
        return
      }
    }
    
    originalLog.apply(console, args)
  }
}

// Exposer la fonction globalement
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.cleanupDebug = cleanupDebugLogs
  console.log('🧹 Tapez "cleanupDebug()" pour nettoyer les logs de debug')
} 