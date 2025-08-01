/**
 * Service Worker optimisé pour e-commerce
 * 
 * Stratégies de cache :
 * - StaleWhileRevalidate pour les API
 * - CacheFirst pour les assets statiques
 * - NetworkFirst pour les données critiques
 * - Background sync pour les actions offline
 */

const CACHE_NAME = 'coovia-ecommerce-v1'
const STATIC_CACHE = 'coovia-static-v1'
const API_CACHE = 'coovia-api-v1'
const IMAGES_CACHE = 'coovia-images-v1'

// URLs critiques à précharger
const CRITICAL_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
]

// Patterns pour les différents types de ressources
const STATIC_PATTERNS = [
  /\.(js|css|woff2?|eot|ttf|otf)$/,
  /\/assets\//,
]

const API_PATTERNS = [
  /^https:\/\/api\./,
  /\/api\//,
]

const IMAGE_PATTERNS = [
  /\.(png|jpe?g|svg|webp|avif|ico)$/,
]

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation')
  
  event.waitUntil(
    Promise.all([
      // Précharger les ressources critiques
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_URLS)
      }),
      
      // Activer immédiatement
      self.skipWaiting()
    ])
  )
})

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation')
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGES_CACHE) {
              console.log('Service Worker: Suppression du cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ])
  )
})

/**
 * Interception des requêtes
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return
  }
  
  // Stratégies selon le type de ressource
  if (isStaticResource(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isImageResource(request)) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE))
  } else if (isApiRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE))
  } else {
    event.respondWith(networkFirst(request))
  }
})

/**
 * Stratégie CacheFirst pour les assets statiques
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Fallback pour les pages
    if (request.destination === 'document') {
      return cache.match('/offline.html')
    }
    throw error
  }
}

/**
 * Stratégie StaleWhileRevalidate pour les API
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Retourner immédiatement la version en cache si disponible
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // En cas d'erreur réseau, utiliser le cache
    return cachedResponse
  })
  
  return cachedResponse || fetchPromise
}

/**
 * Stratégie NetworkFirst pour les données critiques
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fallback pour les pages
    if (request.destination === 'document') {
      return caches.match('/offline.html')
    }
    
    throw error
  }
}

/**
 * Vérifie si c'est une ressource statique
 */
function isStaticResource(request) {
  return STATIC_PATTERNS.some(pattern => pattern.test(request.url))
}

/**
 * Vérifie si c'est une image
 */
function isImageResource(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url)) ||
         request.destination === 'image'
}

/**
 * Vérifie si c'est une requête API
 */
function isApiRequest(request) {
  return API_PATTERNS.some(pattern => pattern.test(request.url))
}

/**
 * Background sync pour les actions offline
 */
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'add-to-cart') {
    event.waitUntil(syncCartActions())
  } else if (event.tag === 'submit-order') {
    event.waitUntil(syncOrderSubmission())
  }
})

/**
 * Synchronisation des actions panier
 */
async function syncCartActions() {
  const db = await openDB()
  const cartActions = await db.getAll('cartActions')
  
  for (const action of cartActions) {
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.data)
      })
      
      await db.delete('cartActions', action.id)
    } catch (error) {
      console.error('Erreur sync cart:', error)
    }
  }
}

/**
 * Synchronisation des commandes
 */
async function syncOrderSubmission() {
  const db = await openDB()
  const pendingOrders = await db.getAll('pendingOrders')
  
  for (const order of pendingOrders) {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order.data)
      })
      
      await db.delete('pendingOrders', order.id)
    } catch (error) {
      console.error('Erreur sync order:', error)
    }
  }
}

/**
 * Ouverture de la base de données IndexedDB
 */
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CooviaOfflineDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Store pour les actions panier
      if (!db.objectStoreNames.contains('cartActions')) {
        db.createObjectStore('cartActions', { keyPath: 'id', autoIncrement: true })
      }
      
      // Store pour les commandes en attente
      if (!db.objectStoreNames.contains('pendingOrders')) {
        db.createObjectStore('pendingOrders', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

/**
 * Gestion des messages du client
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_API_RESPONSE') {
    cacheApiResponse(event.data.url, event.data.response)
  }
})

/**
 * Cache une réponse API
 */
async function cacheApiResponse(url, response) {
  const cache = await caches.open(API_CACHE)
  const request = new Request(url)
  const responseObj = new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  })
  
  await cache.put(request, responseObj)
}

/**
 * Notification push pour les mises à jour
 */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icon-192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Coovia', options)
  )
})

/**
 * Gestion des clics sur les notifications
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
}) 