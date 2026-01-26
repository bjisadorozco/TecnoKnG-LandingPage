import { NextRequest, NextResponse } from 'next/server'

// Solo proteger rutas de páginas de administración
const protectedPageRoutes = ['/admin']

// Rutas que no deben ser protegidas
const publicRoutes = ['/admin/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  console.log('Middleware:', { pathname })

  // Si es una ruta pública, permitir paso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('Ruta pública, permitiendo paso')
    return NextResponse.next()
  }

  // Solo proteger páginas de administración específicas
  if (!protectedPageRoutes.some(route => pathname.startsWith(route))) {
    console.log('No es ruta protegida, permitiendo paso')
    return NextResponse.next()
  }

  try {
    // Obtener el token del header Authorization o cookie
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1]
      : req.cookies.get('auth_token')?.value

    console.log('Token encontrado:', !!token)

    if (!token) {
      console.log('No hay token, redirigiendo a login')
      // Redirigir a login si es una ruta de página admin
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    console.log('Token presente, permitiendo acceso a admin')
    // Permitir el paso - la verificación real se hará en el cliente
    return NextResponse.next()

  } catch (error) {
    console.error('Error en middleware de autenticación:', error)
    
    // Redirigir a login si hay error
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
