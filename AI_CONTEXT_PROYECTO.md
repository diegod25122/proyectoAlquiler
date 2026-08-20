# CONTEXTO COMPLETO DEL PROYECTO POLIRENT

## 1) Resumen ejecutivo

Este proyecto es una aplicación web para la gestión de alquiler, préstamo, venta y control de inventario de herramientas y materiales dentro del entorno académico universitario. La plataforma está pensada para estudiantes, docentes y administradores de un taller/laboratorio.

La lógica de negocio principal es:
- Un usuario puede registrarse, verificar su correo y autenticarse.
- Un usuario puede reservar herramientas para uso académico.
- Un administrador aprueba, rechaza, entrega y recibe devoluciones de reservas.
- Un usuario puede comprar productos consumibles mediante pago con Stripe.
- Un administrador gestiona catálogo, usuarios, reservas y órdenes.
- El sistema integra IA para chatbot y generación de imágenes/modelos 3D.

El proyecto está dividido en 3 partes:
1. Frontend: React + Vite + Tailwind
2. Backend: Node.js + Express + MongoDB + Mongoose
3. Backend IA: Flask + scikit-learn + modelo entrenado para chatbot

---

## 2) Objetivo de negocio

PoliRent busca digitalizar y agilizar la administración de herramientas dentro de una institución educativa, evitando procesos manuales y mejorando la trazabilidad de:
- préstamos de equipos
- reservas académicas
- pagos por compras
- control de stock
- validación de usuarios
- seguimiento de entregas y devoluciones

Tiene un enfoque de sistema de gestión de taller + e-commerce académico.

---

## 3) Stack tecnológico

### Frontend
- React 18
- Vite
- JavaScript / JSX
- React Router DOM
- Zustand para estado global
- Axios para peticiones HTTP
- Tailwind CSS
- React Toastify + SweetAlert2 para feedback UX
- Stripe JS y React Stripe para pagos
- React Three Fiber / Drei / Three.js para modelos 3D
- Socket.IO client (aunque no parece central en la app actual)

### Backend
- Node.js 18+
- Express 5
- MongoDB con Mongoose
- JWT para autenticación
- Swagger para documentación API
- Cloudinary para almacenamiento de imágenes
- Stripe para pagos
- Brevo para envío de correos
- Node-cron para tareas programadas
- CORS, dotenv, file upload

### Backend IA
- Python
- Flask
- Flask-CORS
- Flasgger
- scikit-learn
- MLPClassifier
- Dataset de entrenamiento JSON para intents del chatbot

---

## 4) Estructura del repositorio

### Raíz
- package.json: archivo de nivel raíz, probablemente no es el proyecto principal del frontend/backend, pero debe mantenerse consistente si se usan scripts globales.
- frontend/: aplicación cliente
- backend/: API REST principal
- backend-IA/: servicio de chatbot IA
- Imagenes/: recursos visuales / assets del proyecto

### Frontend

Estructura principal:
- src/App.jsx: definición principal de rutas y navegación
- src/main.jsx: render principal de la app
- src/index.css: estilos globales y Tailwind
- src/pages/: pantallas principales
- src/components/: componentes reutilizables
- src/context/: stores de Zustand
- src/hooks/: hooks reutilizables
- src/layout/: layout principal del dashboard
- src/routers/: protección de rutas por roles y autenticación
- src/helpers/: utilidades como IA y conexión externa

### Backend

Estructura principal:
- src/index.js: arranque del servidor
- src/server.js: configuración express + middlewares + rutas
- src/database.js: conexión a MongoDB
- src/config/: configuración de Swagger y Brevo
- src/controllers/: lógica de negocio por dominio
- src/models/: entidades MongoDB
- src/routers/: endpoints REST por dominio
- src/middlewares/: JWT y validaciones
- src/helpers/: manejo Cloudinary y emails

### Backend IA
- app_ia.py: aplicación Flask con modelo entrenado
- dataset_entrenamiento.json: dataset del chatbot
- requirements.txt: dependencias Python
- Procfile: configuración de despliegue

---

## 5) Funcionamiento general de la aplicación

### 5.1 Flujo de autenticación

El sistema usa JWT para autenticar usuarios.

Flujo:
1. Usuario se registra en /registro
2. Se valida email, cédula, facultad y contraseña
3. Se crea usuario con password cifrado
4. Se envia correo de confirmación con token
5. Usuario confirma email en /confirm/:token
6. Se inicia sesión y se devuelve JWT + datos del usuario
7. El frontend guarda token y rol en Zustand
8. Las rutas protegidas validan el token con middleware JWT

Archivos clave:
- backend/src/controllers/usuario_controller.js
- backend/src/middlewares/JWT.js
- backend/src/models/Usuario.js
- frontend/src/context/storeAuth.jsx
- frontend/src/pages/Login.jsx
- frontend/src/pages/Register.jsx

### 5.2 Flujo de catálogo de productos

El catálogo muestra productos activos y disponibles.

Reglas principales:
- Los productos tienen tipo: Prestable o Consumible
- Prestable: se reserva, no se compra
- Consumible: se compra por pago
- Cada producto tiene categoría, precio, stock e imagen
- Se usa Cloudinary para guardar imágenes
- La baja es lógica (estado: false), no física

Archivos clave:
- backend/src/models/Producto.js
- backend/src/controllers/producto_controller.js
- backend/src/routers/producto_routers.js
- frontend/src/context/storeProducto.jsx
- frontend/src/components/home/Catalog.jsx
- frontend/src/components/create/RegistrarProducto.jsx

### 5.3 Flujo de reservas

Los usuarios pueden solicitar una reserva de herramientas para uso académico.

Campos relevantes:
- producto
- materia
- docente
- proposito
- horasSolicitadas
- cantidad
- estado

Estados de reserva:
- Pendiente
- Aprobada
- Alquilada
- Devuelta
- Cancelada
- Rechazada

Reglas:
- Solo productos de tipo Prestable pueden reservarse
- El admin valida stock y descuenta disponibilidad
- La aprobación baja el stock del producto
- Cuando se devuelve, el stock se restaura

Archivos clave:
- backend/src/models/Reserva.js
- backend/src/controllers/reserva_controller.js
- backend/src/routers/reserva_routers.js
- frontend/src/pages/ReservarProducto.jsx
- frontend/src/pages/GestionReservas.jsx
- frontend/src/pages/MisReservas.jsx

### 5.4 Flujo de compras y pagos

Los consumibles se compran mediante orden y pago digital.

Arquitectura:
- El cliente crea una orden con items
- El backend valida stock y genera PaymentIntent de Stripe
- El backend devuelve clientSecret al frontend
- El frontend confirma el pago con Stripe
- El backend confirma el pago y marca la orden como Pagada
- El admin puede marcarla como Entregada

Archivos clave:
- backend/src/models/OrdenCompra.js
- backend/src/controllers/ordenCompra_controller.js
- backend/src/routers/OrdenCompra_routers.js
- frontend/src/context/storeOrden.jsx
- frontend/src/pages/Carrito.jsx
- frontend/src/components/treatments/ModalPayment.jsx

### 5.5 Panel administrativo

Hay rutas protegidas para admin con roles:
- usuarios
- reservas
- gestión de productos
- órdenes
- panel general

El sistema diferencia entre usuario normal y administrador por el campo `rol` del modelo Usuario.

---

## 6) Modelos principales de MongoDB

### Usuario
Campos clave:
- nombre
- apellido
- facultad
- telefono
- cedula
- email
- password
- token
- imagen
- imagenID
- confirmEmail
- rol
- reservas[]

Comportamiento:
- password se cifra con bcryptjs
- token se usa para registro y recuperación de contraseña
- role acepta: Admin o Usuario

Archivo:
- backend/src/models/Usuario.js

### Producto
Campos clave:
- nombre
- codigoInventario
- descripcion
- categoria
- tipo (Prestable | Consumible)
- precio
- stock
- imagen
- imagenID
- isGeneratedByIA
- estado
- registradoPor
- reservas[]

Reglas:
- Si tipo es consumible, precio es obligatorio
- Stock mínimo 0
- Código de inventario debe ser único
- `estado` define si está activo o fuera de servicio

Archivo:
- backend/src/models/Producto.js

### Reserva
Campos clave:
- usuario
- producto
- cantidad
- materia
- docente
- proposito
- horasSolicitadas
- fechaReserva
- fechaInicio
- fechaFin
- fechaEntrega
- estado
- observaciones
- estadoDevolucion
- aprobadoPor

Estados relevantes:
- Pendiente
- Aprobada
- Alquilada
- Devuelta
- Cancelada
- Rechazada

Archivo:
- backend/src/models/Reserva.js

### OrdenCompra
Campos clave:
- usuario
- items[]
- total
- estado
- stripePaymentIntentId
- stripeClientSecret
- verificadoPor
- fechaVerificacion
- expiraEn

Importante:
- Guarda snapshot del producto y precio para evitar inconsistencias históricas.
- Tiene expiración automática de 24h.

Archivo:
- backend/src/models/OrdenCompra.js

---

## 7) Endpoints principales del backend

### Autenticación y perfil
- POST /api/registro
- POST /api/usuario/login
- GET /api/usuario/perfil
- GET /api/confirm/:token
- POST /api/recuperarpassword
- GET /api/recuperarpassword/:token
- POST /api/nuevopassword/:token
- PUT /api/actualizarperfil/
- PUT /api/actualizarpassword/:id
- GET /api/usuarios
- DELETE /api/usuarios/:id
- PUT /api/usuarios/bloquear/:id

### Productos
- GET /api/productos
- GET /api/producto/:id
- GET /api/productos/admin
- POST /api/producto/registro
- PUT /api/producto/actualizar/:id
- DELETE /api/producto/eliminar/:id

### Reservas
- POST /api/registrarReserva
- GET /api/reserva/mis-reservas
- GET /api/reservas
- PUT /api/reservas/aprobar/:id
- PUT /api/reservas/rechazar/:id
- PUT /api/reservas/en-uso/:id
- PUT /api/reservas/devolver/:id

### Ordenes de compra
- POST /api/ordenes
- POST /api/ordenes/confirmar-pago
- GET /api/ordenes/mis-ordenes
- GET /api/ordenes
- PUT /api/ordenes/entregar/:id
- PUT /api/ordenes/cancelar/:id

### Cédula / verificación
- GET /api/cedula/:numero

### 3D
- POST /api/generate-3d

### Documentación API
- GET /api-docs

---

## 8) Componentes clave del frontend

### Rutas principales (App.jsx)
Rutas públicas:
- /
- /reservar/:id
- /carrito
- /confirm/:token
- /reset/:token
- /login
- /register
- /forgot

Rutas protegidas:
- /dashboard/*
  - index => Panel
  - profile
  - list
  - details/:id
  - update/:id
  - chat
  - registrar-producto
  - reservas
  - usuarios
  - mis-reservas
  - mis-pagos

### Estado global principal
- storeAuth: token y rol del usuario
- storeProfile: perfil del usuario autenticado
- storeProducto: catálogo de productos
- storeCarrito: carrito de reservas y compras
- storeReservas: reservas del usuario/admin
- storeOrden: gestión de órdenes de compra
- storePrestamos: flujo de préstamos / pagos / entregas

### Páginas relevantes
- Home.jsx: landing principal
- Catalog.jsx: catálogo de herramientas
- List.jsx: listado y gestión administrativa
- Details.jsx: detalle de producto + generación 3D
- ReservarProducto.jsx: formulario de reserva académica
- Carrito.jsx: compra de consumibles con Stripe
- Login.jsx / Register.jsx / Forgot.jsx / Reset.jsx / Confirm.jsx
- Profile.jsx: perfil del usuario
- Panel.jsx: dashboard principal
- GestionReservas.jsx: administración de reservas
- GestionUsuarios.jsx: gestión de usuarios
- MisReservas.jsx: historial del usuario
- MisPagos.jsx: historial de compras

### Chatbot IA
- frontend/src/components/ChatBotIA.jsx
- backend-IA/app_ia.py

Funcionalidad:
- El chatbot responde preguntas sobre alquiler, reservas, pagos y devoluciones
- Usa un modelo entrenado con dataset JSON
- Endpoint principal: /api/chat

---

## 9) Integraciones externas

### 9.1 Stripe
Usado para compras y pagos.
- Clave pública en frontend
- Clave privada en backend
- Se crea PaymentIntent para cada orden
- El frontend confirma el pago con Stripe.js
- El backend verifica el estado del PaymentIntent

### 9.2 Cloudinary
Usado para guardar imágenes de usuarios y productos.
- Sube imágenes a Cloudinary
- Guarda `secure_url` y `public_id`
- Borra imágenes previas al actualizar o reemplazar perfiles/productos

### 9.3 Brevo
Usado para enviar correos de:
- confirmación de registro
- recuperación de contraseña

### 9.4 Tripo / Meshy / 3D
Hay integración para generación 3D a partir de texto o imagen.
- En backend hay endpoints/contratos para generar modelos 3D
- El frontend llama a la generación desde el detalle del producto
- El proyecto tiene una intención muy clara de tener contenido visual generado por IA

### 9.5 Cédula ecuatoriana
Existe un validado de cédula con lógica propia y consulta a API externa si existe clave configurada.

---

## 10) Patrones y decisiones técnicas importantes

1. Arquitectura de capas bien separada:
- rutas -> controladores -> modelos

2. Autenticación con JWT centralizada

3. Persistencia de estado con Zustand en frontend

4. Almacenamiento de archivos en Cloudinary, no local

5. Modelado de reservas y compras como dominios separados

6. Uso de Swagger para documentación API

7. Paginación o listados no implementados pero el diseño es claramente orientado a gestión administrativa

---

## 11) Observaciones del código (estado real del proyecto)

Estas observaciones son útiles para otra IA y para mejorar el sistema:

### Fortalezas
- La arquitectura general está bien planteada
- Hay separación de roles y de dominios
- Se usan modelos con validaciones y relaciones claras
- Hay gestión de pagos, reservas y stock
- El frontend tiene estructura ordenada por páginas y componentes
- Se integra IA para chatbot y generación visual

### Puntos de atención / deuda técnica
- Hay disparidad entre nombres de endpoints y su uso real en frontend; conviene revisar y unificar
- Algunas funciones de IA están “habilitadas” parcialmente o con logs de warning en lugar de flujo completo
- Hay varios archivos con comentarios en español mezclados con código, lo que es útil pero requiere limpieza para mantener consistencia
- Los valores de entorno reales deben mantenerse fuera del repositorio; no se deben compartir ni commitear
- Unos pocos endpoints y páginas parecen estar duplicados o parcialmente repetidos (por ejemplo gestión de reservas)
- La lógica de stock, estados y validaciones debería revisarse con tests automatizados para evitar regresiones

---

## 12) Variables de entorno requeridas

No se deben compartir valores reales. Las claves deben quedar en archivos .env locales o en despliegue seguro.

### Backend (.env)
- MONGODB_URI
- PORT
- CORS_ORIGIN
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- STRIPE_PRIVATE_KEY
- BREVO_API_KEY
- ECUADOR_CEDULA_KEY
- TRIPO_API_KEY
- MESHY_API_KEY
- NODE_ENV
- PROD_URL_BACKEND

### Frontend (.env)
- VITE_BACKEND_URL
- VITE_IA_API_URL
- VITE_STRIPE_PUBLIC_KEY
- VITE_HUGGINGFACE_API_KEY
- VITE_ECUADOR_API_URL
- VITE_ECUADOR_API_KEY
- TRIPO_API_KEY (si se usa localmente desde frontend)

> Importante: no guardar secretos reales en el repositorio ni en archivos que se compartan con IA sin filtrar.

---

## 13) Cómo entender el proyecto rápidamente para trabajar con IA

### Prioridad 1: negocio
Entender que es un sistema de alquiler académico y comercio de consumibles.

### Prioridad 2: flujo principal
Usuario -> Registro -> Login -> Catálogo -> Reserva/Compra -> Pago/Confirmación -> Admin -> Validación -> Entrega -> Devolución.

### Prioridad 3: capa de datos
Modelos de `Usuario`, `Producto`, `Reserva`, `OrdenCompra` son la base del sistema.

### Prioridad 4: seguridad
JWT, roles, validaciones, Cloudinary, Stripe, confirmación por email.

### Prioridad 5: UX
El frontend tiene muchísima parte visual y de usabilidad; conviene pulir:
- navegación
- feedback del usuario
- consistencia visual
- adaptabilidad móvil
- microinteracciones
- carga de estados
- mensajes de validación claros

---

## 14) Sugerencias de mejora para IA / equipo de desarrollo

### UX y producto
- Homogeneizar estilos entre páginas del dashboard
- Mejorar mensajes de éxito/error para el usuario final
- Revisar tiempos de carga y feedback visual
- Optimizar catálogo con filtros y búsquedas más sofisticadas
- Reducir fricción del proceso de compra/reserva

### Código / arquitectura
- Añadir tests automatizados para reservas, pagos y validaciones
- Unificar endpoint naming strategy
- Revisar manejo de errores centralizado
- Limpiar duplicados y funciones redundantes
- Documentar más cada módulo para facilitar mantenimiento

### IA / innovación
- Mejorar el chatbot con contexto del usuario y comportamiento más inteligente
- Añadir soporte para imágenes con generación real en productos
- Mejorar prompts y personalización del 3D
- Diseñar decisiones de negocio para permitir más automación administrativa

### Seguridad y despliegue
- Rotar secrets si se compartieron accidentalmente
- Usar variables de entorno de despliegue reales
- Revisar CORS y dominios permitidos
- Añadir validación y sanitización más estricta en todas las entradas

---

## 15) Archivos más importantes para comenzar a trabajar

### Backend
- backend/src/server.js
- backend/src/index.js
- backend/src/controllers/producto_controller.js
- backend/src/controllers/reserva_controller.js
- backend/src/controllers/ordenCompra_controller.js
- backend/src/controllers/usuario_controller.js
- backend/src/models/Usuario.js
- backend/src/models/Producto.js
- backend/src/models/Reserva.js
- backend/src/models/OrdenCompra.js

### Frontend
- frontend/src/App.jsx
- frontend/src/context/storeAuth.jsx
- frontend/src/context/storeCarrito.jsx
- frontend/src/context/storeProducto.jsx
- frontend/src/context/storeOrden.jsx
- frontend/src/pages/Home.jsx
- frontend/src/pages/ReservarProducto.jsx
- frontend/src/pages/Carrito.jsx
- frontend/src/pages/GestionReservas.jsx
- frontend/src/pages/GestionUsuarios.jsx
- frontend/src/components/ChatBotIA.jsx

### IA
- backend-IA/app_ia.py
- backend-IA/dataset_entrenamiento.json

---

## 16) Instrucción útil para otra IA

Cuando otra IA trabaje en este proyecto, debe asumir estas premisas:
- Es una app académica de alquiler y gestión de inventario
- Tiene 3 roles funcionales principales: usuario, administrador, servicios externos (Stripe, Cloudinary, IA)
- La fuente de verdad del negocio son los modelos MongoDB y las rutas REST
- El frontend es una capa de presentación que consume la API
- La UX y la confiabilidad del flujo de negocio son prioridad
- Los cambios deben proteger autenticación, stock y pagos

---

## 17) Frase guía para continuar con IA

"Actúa como un desarrollador senior fullstack. Revisa el proyecto PoliRent, entiende su arquitectura, prioriza mejoras de UX y calidad de código, y trabaja sobre los flujos de autenticación, reservas, inventario, pagos y IA sin romper la lógica de negocio ni la seguridad del sistema. Mantén coherencia entre frontend, backend y servicios externos."

---

## 18) Nota final

Este documento fue generado como resumen operativo para que una IA pueda entrar al proyecto con contexto real y no comenzar desde cero. Sirve como base para:
- planificar mejoras
- refactorizar módulos
- pulir la experiencia de usuario
- optimizar backend/frontend
- mejorar la IA del chatbot y los procesos de generación visual
- mantener una visión de negocio clara mientras se desarrolla

Si quieres, puedo continuar con cualquiera de estas siguientes opciones:
1. Generar una estrategia de mejora de UX/UI para la landing y dashboard
2. Hacer un diagnóstico técnico de riesgos y bugs reales del proyecto
3. Crear una hoja de trabajo para IA con tareas priorizadas por impacto
4. Redactar un plan de refactorización completa del frontend y backend
5. Generar un roadmap de mejora con prioridades de 30, 60 y 90 días
