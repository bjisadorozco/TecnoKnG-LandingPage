// Script para crear usuario administrador
// Ejecutar con: node scripts/create-admin.js

const admin = require('firebase-admin');
const path = require('path');

// Intentar cargar el service account desde diferentes ubicaciones
let serviceAccount;
try {
  serviceAccount = require('../serviceAccountKey.json');
} catch (error) {
  console.error('❌ No se encontró serviceAccountKey.json en la raíz del proyecto');
  console.log('   Por favor, descarga el archivo desde Firebase Console y colócalo en la raíz del proyecto');
  process.exit(1);
}

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

async function createAdminUser() {
  try {
    const email = 'brayanorozco920@gmail.com'; // Email del administrador
    const password = 'tecnokng'; // Contraseña segura
    const username = 'tecnokng'; // Nombre de usuario para login
    
    console.log('Creando usuario administrador...');
    
    // Crear usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      emailVerified: true,
      displayName: 'Administrador TecnoKnG'
    });
    
    console.log('✅ Usuario administrador creado exitosamente:');
    console.log('   UID:', userRecord.uid);
    console.log('   Email:', userRecord.email);
    console.log('   Username:', username);
    console.log('   Display Name:', userRecord.displayName);
    console.log('   Email Verified:', userRecord.emailVerified);
    
    // Establecer claims personalizados para identificar como administrador
    // Incluimos el username en los claims para poder usarlo en el login
    await auth.setCustomUserClaims(userRecord.uid, { 
      admin: true,
      username: username 
    });
    
    console.log('✅ Claims de administrador y username establecidos');
    
    // Verificar los claims
    const user = await auth.getUser(userRecord.uid);
    console.log('   Custom Claims:', user.customClaims);
    
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  El usuario ya existe. Actualizando claims...');
      
      const email = 'brayanorozco920@gmail.com';
      const username = 'tecnokng'; // Username para el usuario existente
      
      // Obtener usuario existente
      const user = await auth.getUserByEmail(email);
      
      // Establecer claims de administrador y username
      await auth.setCustomUserClaims(user.uid, { 
        admin: true,
        username: username 
      });
      
      console.log('✅ Claims de administrador y username actualizados para usuario existente');
      console.log('   UID:', user.uid);
      console.log('   Email:', user.email);
      console.log('   Username:', username);
    } else {
      console.error('❌ Error al crear usuario:', error);
    }
  } finally {
    process.exit(0);
  }
}

createAdminUser();
