import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Extraire le storeId du sous-domaine
  const storeIdMatch = hostname.match(/^([^.]+)\.wozif\.store$/)
  
  if (storeIdMatch) {
    const storeId = storeIdMatch[1]
    
    // Si on est sur la racine, rediriger vers la page d'accueil du store
    if (request.nextUrl.pathname === '/') {
      return NextResponse.rewrite(new URL(`/${storeId}`, request.url))
    }
    
    // Pour les autres routes, ajouter le storeId
    const url = request.nextUrl.clone()
    url.pathname = `/${storeId}${url.pathname}`
    
    return NextResponse.rewrite(url)
  }
  
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
