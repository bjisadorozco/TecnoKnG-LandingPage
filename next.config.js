/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'firebase-admin',
      'firebase-admin/app',
      'firebase-admin/auth',
      'firebase-admin/firestore',
      'google-auth-library',
      'google-logging-utils',
      'gcp-metadata'
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Configurar externals para Firebase Admin
      config.externals = config.externals || []
      
      // Agregar paquetes problemáticos a externals
      const problematicPackages = [
        'firebase-admin',
        'google-auth-library',
        'google-logging-utils',
        'gcp-metadata'
      ]
      
      problematicPackages.forEach(pkg => {
        config.externals.push({
          [pkg]: pkg
        })
      })

      // Mapear módulos node: a CommonJS
      const nodeModules = {
        'node:process': 'commonjs process',
        'node:buffer': 'commonjs buffer',
        'node:crypto': 'commonjs crypto',
        'node:fs': 'commonjs fs',
        'node:path': 'commonjs path',
        'node:url': 'commonjs url',
        'node:util': 'commonjs util',
        'node:stream': 'commonjs stream',
        'node:events': 'commonjs events',
      }
      
      config.externals.push(nodeModules)
    }
    
    return config
  },
}

module.exports = nextConfig
