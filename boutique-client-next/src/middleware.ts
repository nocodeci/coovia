import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  console.log('🔍 Middleware - Hostname:', hostname)
  
  // Extraire le storeId du sous-domaine
  const storeIdMatch = hostname.match(/^([^.]+)\.wozif\.store$/)
  
  console.log('🔍 Middleware - Regex match:', storeIdMatch)
  
  if (storeIdMatch) {
    let storeId = storeIdMatch[1]
    
    console.log('🔍 Middleware - StoreId original:', storeId)
    
    // Redirection spéciale pour le sous-domaine de test
    if (storeId === 'test') {
      storeId = 'test-store'
      console.log('🔍 Middleware - Redirection test → test-store')
    }
    
    console.log('🔍 Middleware - StoreId final:', storeId)
    console.log('🔍 Middleware - Pathname:', request.nextUrl.pathname)
    
    // Si on est sur la racine, rediriger vers la page d'accueil du store
    if (request.nextUrl.pathname === '/') {
      const rewriteUrl = new URL(`/${storeId}`, request.url)
      console.log('🔍 Middleware - Rewrite URL:', rewriteUrl.toString())
      return NextResponse.rewrite(rewriteUrl)
    }
    
    // Pour les autres routes, ajouter le storeId
    const url = request.nextUrl.clone()
    url.pathname = `/${storeId}${url.pathname}`
    
    console.log('🔍 Middleware - Final URL:', url.toString())
    return NextResponse.rewrite(url)
  }
  
  console.log('🔍 Middleware - No subdomain match, continuing...')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
