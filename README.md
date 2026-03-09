# 🚀 TecnoKnG - Tienda de Tecnología y Reparaciones

## 📋 Tabla de Contenidos

- [📖 Descripción del Proyecto](#-descripción-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🔧 Variables de Entorno](#-variables-de-entorno)
- [📦 Scripts Disponibles](#-scripts-disponibles)
- [👥 Roles del Sistema](#-roles-del-sistema)
- [🏪 Funcionalidades de la Tienda](#-funcionalidades-de-la-tienda)
- [⚙️ Panel de Administración](#️-panel-de-administración)
- [🔐 Sistema de Autenticación](#-sistema-de-autenticación)
- [📊 Gestión de Productos](#-gestión-de-productos)
- [🏷️ Gestión de Categorías](#️-gestión-de-categorías)
- [🏢 Gestión de Marcas](#-gestión-de-marcas)
- [📝 Gestión de Pedidos](#-gestión-de-pedidos)
- [💬 Sistema de Mensajes](#-sistema-de-mensajes)
- [🎨 Componentes UI](#-componentes-ui)
- [📱 Diseño Responsivo](#-diseño-responsivo)
- [🔄 Estados Globales](#-estados-globales)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🚀 Despliegue](#-despliegue)
- [🧪 Pruebas](#-pruebas)
- [🐛 Solución de Problemas](#-solución-de-problemas)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)
- [📞 Contacto](#-contacto)

---

## 📖 Descripción del Proyecto

**TecnoKnG** es una plataforma web moderna para la venta de productos tecnológicos y servicios de reparación. La aplicación combina una tienda online con un sistema de gestión administrativa integral, permitiendo a los clientes comprar productos y solicitar servicios de reparación, mientras que los administradores pueden gestionar inventario, pedidos, categorías y marcas de manera eficiente.

### 🎯 Objetivos Principales

- **Comercio Electrónico**: Venta de productos tecnológicos con experiencia de compra optimizada
- **Servicios Técnicos**: Gestión de solicitudes de reparación y mantenimiento
- **Gestión Integral**: Panel administrativo completo para control total del negocio
- **Experiencia de Usuario**: Interfaz moderna, intuitiva y responsiva
- **Escalabilidad**: Arquitectura modular y mantenible

---

## ✨ Características Principales

### 🏪 **Para Clientes**
- 🛒 **Catálogo de Productos**: Navegación por categorías y marcas
- 🖼️ **Galería de Imágenes**: Múltiples imágenes por producto con carrusel
- 🔍 **Búsqueda y Filtros**: Búsqueda avanzada y filtrado por categoría
- 🛍️ **Carrito de Compras**: Gestión de productos con cantidades
- 📱 **Diseño Responsivo**: Experiencia optimizada en todos los dispositivos
- 💬 **Chat de Soporte**: Asistente virtual para consultas inmediatas
- 📝 **Solicitudes de Servicio**: Formularios para reparaciones y soporte

### ⚙️ **Para Administradores**
- 🔐 **Panel Seguro**: Autenticación y control de accesos
- 📦 **Gestión de Inventario**: CRUD completo de productos
- 🏷️ **Administración de Categorías**: Organización jerárquica
- 🏢 **Gestión de Marcas**: Control de fabricantes y proveedores
- 📊 **Dashboard Analítico**: Estadísticas y métricas en tiempo real
- 📋 **Gestión de Pedidos**: Seguimiento completo de ventas
- 💬 **Mensajes de Clientes**: Comunicación directa con usuarios
- 📁 **Historial de Archivos**: Gestión de datos archivados

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework con SSR y SSG
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) - Tipado estático y mejor DX
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Componentes**: [Lucide React](https://lucide.dev/) - Iconos modernos y consistentes
- **UI Components**: Componentes personalizados con shadcn/ui

### **Backend & Datos**
- **API Routes**: Next.js API Routes para endpoints REST
- **Base de Datos**: Sistema de archivos JSON para simplicidad y portabilidad
- **Estado Global**: Context API de React para gestión de estado
- **Manejo de Formularios**: React Hook Form con validaciones

### **Desarrollo**
- **Package Manager**: npm
- **Control de Versiones**: Git
- **Entorno de Desarrollo**: Node.js
- **Build Tool**: Next.js con Turbopack

---

## 📁 Estructura del Proyecto

```
TecnoKnG/
├── 📁 app/                          # App Router de Next.js
│   ├── 📁 admin/                   # Panel de administración
│   │   ├── 📄 login/               # Página de login admin
│   │   └── 📄 page.tsx            # Dashboard principal
│   ├── 📁 tienda/                  # Tienda online
│   │   └── 📄 page.tsx            # Página principal de tienda
│   ├── 📁 globals.css              # Estilos globales
│   ├── 📁 layout.tsx               # Layout principal
│   └── 📄 page.tsx                # Homepage
├── 📁 components/                  # Componentes reutilizables
│   ├── 📁 sections/               # Secciones principales
│   │   ├── 📄 about.tsx          # Sección "Sobre nosotros"
│   │   ├── 📄 hero.tsx           # Hero principal
│   │   └── 📄 testimonials-carousel.tsx # Testimonios
│   ├── 📁 store/                  # Componentes de tienda
│   │   └── 📄 store-view.tsx     # Vista principal de tienda
│   ├── 📄 chatbox.tsx             # Chat de soporte
│   ├── 📄 footer.tsx              # Footer del sitio
│   └── 📄 header.tsx              # Navegación principal
├── 📁 lib/                        # Utilidades y configuración
│   ├── 📄 auth-context.ts         # Contexto de autenticación
│   ├── 📄 brands-context.ts       # Contexto de marcas
│   ├── 📄 categories-context.ts   # Contexto de categorías
│   ├── 📄 store-context.ts       # Contexto global de tienda
│   └── 📄 utils.ts              # Funciones utilitarias
├── 📁 public/                     # Archivos estáticos
│   ├── 📁 assets/                # Imágenes y recursos
│   └── 📄 favicon.ico
├── 📄 README.md                   # Documentación del proyecto
├── 📄 next.config.js              # Configuración de Next.js
├── 📄 package.json               # Dependencias y scripts
└── 📄 tailwind.config.js         # Configuración de Tailwind
```

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18.0 o superior
- npm 9.0 o superior
- Git para control de versiones

### **Pasos de Instalación**

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd TecnoKnG
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (ver sección [Variables de Entorno](#variables-de-entorno))

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir navegador**
   ```
   http://localhost:3000
   ```

---

## 🔧 Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=TecnoKnG
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configuración de autenticación
NEXTAUTH_SECRET=tu-secreto-super-seguro
NEXTAUTH_URL=http://localhost:3000

# Configuración de base de datos (si aplica)
# DATABASE_URL=tu-url-de-base-de-datos

# Configuración de servicios externos
# EMAIL_SERVICE_API=tu-api-email
# PAYMENT_GATEWAY_API=tu-api-pagos
```

---

## 📦 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### **Descripción de Scripts**

- **`npm run dev`**: Inicia servidor de desarrollo con hot reload
- **`npm run build`**: Compila aplicación para producción
- **`npm run start`**: Inicia servidor de producción
- **`npm run lint`**: Ejecuta análisis de código con ESLint
- **`npm run type-check`**: Verifica tipos TypeScript

---

## 👥 Roles del Sistema

### **🛒 Cliente/Visitante**
- Navegar por el catálogo de productos
- Ver detalles de productos con múltiples imágenes
- Agregar productos al carrito
- Realizar solicitudes de servicio
- Contactar vía chat de soporte
- Ver información de la empresa

### **⚙️ Administrador**
- Acceso completo al panel administrativo
- Gestión CRUD de productos, categorías y marcas
- Procesamiento de pedidos y solicitudes
- Configuración del sistema
- Análisis de métricas y reportes
- Gestión de usuarios y permisos

---

## 🏪 Funcionalidades de la Tienda

### **🛍️ Catálogo de Productos**
- **Visualización**: Grid de productos con información esencial
- **Filtros**: Por categoría, marca, precio y disponibilidad
- **Búsqueda**: Búsqueda en tiempo real con resultados instantáneos
- **Ordenamiento**: Por precio, nombre y fecha de adición
- **Paginación**: Navegación eficiente con grandes volúmenes

### **🖼️ Gestión Multimedia**
- **Múltiples Imágenes**: Hasta 5 imágenes por producto
- **Carrusel Interactivo**: Navegación entre imágenes
- **Miniaturas**: Grid de vistas previas clickeables
- **Optimización**: Imágenes optimizadas para web
- **Zoom**: Vista ampliada de imágenes principales

### **🛒 Carrito de Compras**
- **Gestión**: Agregar, modificar y eliminar productos
- **Cálculos**: Subtotal automático con impuestos
- **Persistencia**: Carrito mantiene estado entre sesiones
- **Validaciones**: Stock y disponibilidad en tiempo real
- **Experiencia**: Animaciones y feedback visual

### **💬 Chat de Soporte**
- **Asistente Virtual**: Bot con respuestas predefinidas
- **Mensajes Personalizados**: Respuestas adaptativas
- **Historial**: Registro de conversaciones
- **Notificaciones**: Alertas de nuevos mensajes
- **Integración**: Con sistema de gestión de mensajes

---

## ⚙️ Panel de Administración

### **🔐 Sistema de Autenticación**
- **Login Seguro**: Validación de credenciales
- **Sesiones**: Manejo de tokens y expiración
- **Protección**: Rutas protegidas con middleware
- **Logout**: Cierre seguro de sesión
- **Recordarme**: Opción de mantener sesión activa

### **📊 Dashboard Principal**
- **Métricas en Tiempo Real**: Ventas, visitas, productos
- **Gráficos Interactivos**: Visualización de datos
- **Accesos Rápidos**: Atajos a funciones principales
- **Notificaciones**: Alertas de eventos importantes
- **Resúmenes**: Estadísticas clave del negocio

---

## 📊 Gestión de Productos

### **📝 CRUD Completo**
- **Crear**: Formulario completo con validaciones
- **Leer**: Listado con filtros y búsqueda
- **Actualizar**: Edición inline con modal
- **Eliminar**: Confirmación y eliminación segura

### **🖼️ Gestión de Imágenes**
- **Upload Múltiple**: Selección de varios archivos
- **Vistas Previas**: Miniaturas inmediatas
- **Reordenamiento**: Arrastrar y soltar
- **Eliminación**: Remover imágenes individuales
- **Validación**: Tipos y tamaños permitidos

### **📋 Campos del Producto**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  available: boolean;
  image: string;        // Imagen principal
  images: string[];     // Array de imágenes
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🏷️ Gestión de Categorías

### **📂 Organización Jerárquica**
- **Categorías Principales**: Computadores, Laptops, Celulares, etc.
- **Subcategorías**: Niveles adicionales de organización
- **Asociaciones**: Relación con productos y marcas
- **Validaciones**: Nombres únicos y obligatorios

### **🎛️ Funcionalidades**
- **CRUD Completo**: Crear, leer, actualizar, eliminar
- **Asignación**: Vincular productos a categorías
- **Filtros**: Búsqueda y filtrado rápido
- **Estadísticas**: Productos por categoría

---

## 🏢 Gestión de Marcas

### **🏭 Control de Fabricantes**
- **Registro**: Nueva marca con información básica
- **Asociación**: Vinculación con categorías
- **Validación**: Marcas únicas por categoría
- **Gestión**: Edición y eliminación segura

### **📊 Información de Marca**
```typescript
interface Brand {
  id: string;
  name: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📝 Gestión de Pedidos

### **🛍️ Procesamiento de Ventas**
- **Recepción**: Notificación de nuevos pedidos
- **Estados**: Pendiente, Procesando, Enviado, Entregado
- **Actualización**: Cambio de estado con notificaciones
- **Historial**: Registro completo de cambios
- **Archivado**: Gestión de pedidos completados

### **📋 Información del Pedido**
```typescript
interface Order {
  id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 💬 Sistema de Mensajes

### **📨 Comunicación con Clientes**
- **Recepción**: Mensajes de formulario de contacto
- **Gestión**: Leer, responder y archivar mensajes
- **Estados**: Nuevo, Leído, Respondido, Archivado
- **Notificaciones**: Alertas de nuevos mensajes
- **Historial**: Conversaciones completas

### **🔄 Flujo de Trabajo**
1. **Cliente envía mensaje** desde formulario de contacto
2. **Admin recibe notificación** en dashboard
3. **Admin lee y responde** mensaje
4. **Estado actualizado** automáticamente
5. **Historial archivado** para referencia futura

---

## 🎨 Componentes UI

### **📱 Componentes Principales**
- **Header**: Navegación con logo condicional y menú móvil
- **Hero**: Sección principal con animaciones y llamadas a la acción
- **StoreView**: Catálogo completo con filtros y carrito
- **Footer**: Información de contacto y redes sociales
- **Chatbox**: Asistente virtual interactivo

### **🎛️ Componentes de Admin**
- **AdminDashboard**: Panel principal con todas las funcionalidades
- **ProductModal**: Formulario para crear/editar productos
- **CategoryModal**: Gestión de categorías
- **BrandModal**: Gestión de marcas
- **OrderTable**: Listado de pedidos con acciones

### **🎨 Diseño y Estilos**
- **Tailwind CSS**: Sistema de utilidades para estilos
- **Diseño Responsivo**: Mobile-first con breakpoints
- **Tema Oscuro**: Soporte para modo oscuro/claro
- **Animaciones**: Transiciones suaves y microinteracciones
- **Iconografía**: Lucide React para consistencia visual

---

## 📱 Diseño Responsivo

### **📐 Breakpoints Utilizados**
```css
/* Mobile */
@media (max-width: 640px) { /* sm */ }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { /* md */ }

/* Desktop */
@media (min-width: 1025px) { /* lg */ }
```

### **📱 Adaptaciones**
- **Navegación**: Menú hamburguesa en móvil
- **Grids**: Layouts adaptativos según pantalla
- **Tipografía**: Tamaños relativos (rem/em)
- **Imágenes**: Optimizadas para diferentes resoluciones
- **Touch**: Gestos táctiles en dispositivos móviles

---

## 🔄 Estados Globales

### **🏪 Store Context**
```typescript
interface StoreContextType {
  // Productos
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Carrito
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Pedidos
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}
```

### **🔐 Auth Context**
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}
```

---

## 🗄️ Base de Datos

### **📁 Sistema de Archivos JSON**
- **Simplicidad**: Fácil configuración y mantenimiento
- **Portabilidad**: Migración sencilla entre entornos
- **Backups**: Copias de seguridad manuales
- **Versionado**: Control de cambios con Git

### **📂 Estructura de Datos**
```
data/
├── 📄 products.json          # Catálogo de productos
├── 📄 categories.json       # Categorías disponibles
├── 📄 brands.json          # Marcas registradas
├── 📄 orders.json          # Pedidos de clientes
└── 📄 messages.json        # Mensajes de contacto
```

---

## 🚀 Despliegue

### **🌐 Opciones de Despliegue**

#### **Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

#### **Netlify**
```bash
npm run build
# Subir carpeta /out a Netlify
```

#### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **⚙️ Configuración de Producción**
- **Variables de Entorno**: Configurar todas las variables necesarias
- **Build Optimizado**: `npm run build` para producción
- **HTTPS**: Configurar certificado SSL
- **CDN**: Configurar para assets estáticos
- **Monitoreo**: Implementar sistema de logs

---

## 🧪 Pruebas

### **🔍 Pruebas Manuales**
- **Funcionalidad**: Verificar todas las características
- **Responsividad**: Probar en diferentes dispositivos
- **Navegadores**: Compatibilidad cruzada
- **Rendimiento**: Tiempos de carga y optimización

### **📋 Checklist de Pruebas**
- [ ] Login y logout funcionan correctamente
- [ ] CRUD de productos opera sin errores
- [ ] Carrito de compras mantiene estado
- [ ] Imágenes se cargan y muestran correctamente
- [ ] Formularios validan datos correctamente
- [ ] Diseño responsivo en móvil/tablet/desktop
- [ ] Notificaciones y toast messages funcionan

---

## 🐛 Solución de Problemas

### **🔥 Problemas Comunes**

#### **Productos no se guardan con múltiples imágenes**
```typescript
// Solución: Asegurar que el array images se incluya en la actualización
const updatedProduct = {
  ...editingProduct,
  image: editingProduct.images?.[0] || "",
  images: editingProduct.images || [] // ← Línea clave
}
```

#### **Modal de edición no muestra datos**
```typescript
// Verificar que el estado se inicialice correctamente
const [editingProduct, setEditingProduct] = React.useState<any>(null)

// Asegurar que handleEditProduct actualice el estado
const handleEditProduct = (product: any) => {
  setEditingProduct({...product}) // ← Spread operator importante
  setIsProductModalOpen(true)
}
```

#### **Errores de TypeScript con parámetros implícitos**
```typescript
// Solución: Tipar explícitamente los parámetros
setEditingProduct((prev: any) => ({ // ← Tipo explícito
  ...prev,
  images: prev.images?.filter((_: any, i: number) => i !== index) || []
}))
```

### **🛠️ Herramientas de Debug**
- **Console Logs**: `console.log()` para seguimiento de estado
- **React DevTools**: Inspeccionar componentes y estado
- **Network Tab**: Verificar llamadas API
- **TypeScript**: `tsc --noEmit` para verificar tipos

---

## 🤝 Contribución

### **📋 Cómo Contribuir**

1. **Fork** el repositorio
2. **Crear rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Hacer commit** de cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a tu fork: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request** con descripción detallada

### **📝 Estándares de Código**
- **TypeScript**: Usar tipos estrictos
- **ESLint**: Seguir reglas configuradas
- **Componentes**: Nombres descriptivos en PascalCase
- **Comentarios**: Documentar funciones complejas
- **Formato**: Prettier para consistencia

### **🏷️ Convenciones de Commits**
```
feat: agregar nueva funcionalidad
fix: corregir error específico
docs: actualizar documentación
style: cambios de formato/estilo
refactor: mejorar código sin cambiar funcionalidad
test: agregar o modificar pruebas
```

---

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License**. Ver archivo [LICENSE](LICENSE) para más detalles.

### **📜 Resumen de Licencia**
- ✅ Uso comercial permitido
- ✅ Modificación permitida
- ✅ Distribución permitida
- ✅ Uso privado permitido
- ❌ Responsabilidad no garantizada
- ❌ Licencia no puede ser revocada

---

## 📞 Contacto

### **🏢 Información del Proyecto**
- **Nombre**: TecnoKnG
- **Versión**: 1.0.0
- **Autor**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **Website**: [https://tecnokng.com](https://tecnokng.com)

### **🤝 Soporte y Colaboración**
- **Issues**: Reportar bugs en GitHub Issues
- **Features**: Solicitar nuevas funcionalidades
- **Discusiones**: Participar en GitHub Discussions
- **Email**: Contacto directo para consultas comerciales

### **📱 Redes Sociales**
- **Facebook**: [Enlace a Facebook]
- **Instagram**: [Enlace a Instagram]
- **Twitter**: [Enlace a Twitter]
- **LinkedIn**: [Enlace a LinkedIn]

---

## 🎯 Roadmap Futuro

### **📅 Próximas Actualizaciones (v1.1.0)**
- [ ] **Sistema de Pagos**: Integración con pasarelas de pago
- [ ] **Gestión de Usuarios**: Roles y permisos avanzados
- [ ] **Notificaciones Push**: Alertas en tiempo real
- [ ] **Exportación de Datos**: Reportes en CSV/PDF
- [ ] **API Pública**: Endpoints para integraciones

### **🚀 Visión a Largo Plazo**
- [ ] **Aplicación Móvil**: Versiones iOS y Android nativas
- [ ] **Sistema de Reviews**: Calificaciones y reseñas de productos
- [ ] **Integración CRM**: Gestión de relaciones con clientes
- [ ] **Analytics Avanzado**: Google Analytics y métricas personalizadas
- [ ] **Multi-idioma**: Soporte para inglés y portugués

---

## 🙏 Agradecimientos

- **Next.js Team**: Por el excelente framework
- **Tailwind CSS**: Por el sistema de utilidades CSS
- **Lucide**: Por los iconos modernos
- **Comunidad Open Source**: Por las herramientas y librerías utilizadas

---

**🎉 ¡Gracias por usar TecnoKnG!**

*Si encuentras este proyecto útil, considera darle una ⭐ en GitHub y compartirlo con otros desarrolladores.*
