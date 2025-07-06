import { NextRequest, NextResponse } from 'next/server'

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']

// Routes protégées avec permissions spécifiques
const protectedRoutes = {
  '/admin': ['admin'],
  '/dashboard/payments': ['manage_payments'],
  '/dashboard/members': ['manage_members'],
  '/dashboard/account': ['view_account']
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Vérifier l'authentification
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    // Rediriger vers login si pas de token
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Vérifier les permissions pour les routes protégées
  for (const [route, requiredPermissions] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      // Ici tu peux décoder le JWT pour vérifier les permissions
      // Pour l'instant, on laisse passer si le token existe
      // En production, tu devrais vérifier les permissions dans le token
      return NextResponse.next()
    }
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