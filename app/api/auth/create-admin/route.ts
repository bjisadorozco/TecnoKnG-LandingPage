import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST() {
  try {
    const email = 'brayanorozco920@gmail.com'
    const password = 'tecnokng'
    const username = 'tecnokng' // Nombre de usuario para login
    
    console.log('Creando usuario administrador...')
    
    // Crear usuario en Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      emailVerified: true,
      displayName: 'Administrador TecnoKnG'
    })
    
    console.log('✅ Usuario administrador creado exitosamente:', userRecord.uid)
    
    // Establecer claims personalizados para identificar como administrador
    // Incluimos el username en los claims para poder usarlo en el login
    await adminAuth.setCustomUserClaims(userRecord.uid, { 
      admin: true,
      username: username 
    })
    
    console.log('✅ Claims de administrador y username establecidos')
    
    // Verificar los claims
    const user = await adminAuth.getUser(userRecord.uid)
    console.log('   Custom Claims:', user.customClaims)
    
    return NextResponse.json({
      success: true,
      message: 'Usuario administrador creado exitosamente',
      user: {
        uid: user.uid,
        email: user.email,
        username: username,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        customClaims: user.customClaims
      }
    })
    
  } catch (error: any) {
    console.error('Error al crear usuario:', error)
    
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  El usuario ya existe. Actualizando claims...')
      
      try {
        const email = 'brayanorozco920@gmail.com'
        // Obtener usuario existente
        const user = await adminAuth.getUserByEmail(email)
        const username = 'admin' // Username para el usuario existente
        
        // Establecer claims de administrador y username
        await adminAuth.setCustomUserClaims(user.uid, { 
          admin: true,
          username: username 
        })
        
        console.log('✅ Claims de administrador y username actualizados para usuario existente')
        
        return NextResponse.json({
          success: true,
          message: 'Claims de administrador actualizados para usuario existente',
          user: {
            uid: user.uid,
            email: user.email,
            username: username,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            customClaims: { admin: true, username: username }
          }
        })
      } catch (updateError) {
        console.error('Error actualizando claims:', updateError)
        return NextResponse.json(
          { error: 'Error actualizando claims de usuario existente' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error al crear usuario administrador',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
