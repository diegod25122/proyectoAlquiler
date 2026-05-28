# GUÍA DE DEPLOYMENT - Vercel (Frontend) y Render (Backend)

## 📋 Requisitos previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Render](https://render.com)
- Repositorio en GitHub (público o privado)
- MongoDB Atlas con URI configurada

---

## 🚀 Backend en Render

### Pasos de Configuración:

1. **Conectar repositorio**
   - Ve a https://dashboard.render.com
   - Click en "New +"
   - Selecciona "Web Service"
   - Conecta tu repositorio de GitHub

2. **Configurar el servicio**
   - **Name**: `poli-rent-backend` (o tu preferencia)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Selecciona la más cercana a tus usuarios

3. **Variables de Entorno**
   En la sección "Environment" de Render, agrega:
   ```
   MONGODB_URI=mongodb+srv://admin_user:admin2512%40@cluster0.vlms6ew.mongodb.net/alquilerusers
   HOST_MAILTRAP=smtp-relay.brevo.com
   PORT_MAILTRAP=587
   USER_MAILTRAP=acdad0001@smtp-brevo.com
   PASS_MAILTRAP=PmXhn3w8qUs1kHFj
   JWT_SECRET=SDFGSJDF7246782CFBKJSDF
   NODE_ENV=production
   CORS_ORIGIN=https://proyecto-alquiler-five.vercel.app
   PROD_URL_BACKEND=https://poli-rent-backend.onrender.com/api
   PROD_URL_FRONTEND=https://proyecto-alquiler-five.vercel.app
   ```

4. **Deploy**
   - Haz click en "Create Web Service"
   - Espera a que se complete el build
   - Tu backend estará disponible en: `https://poli-rent-backend.onrender.com`

### Monitoreo:
- Verifica los logs en el dashboard de Render
- Tu API será accesible en `https://poli-rent-backend.onrender.com/api`
- Documentación Swagger: `https://poli-rent-backend.onrender.com/api-docs`

---

## 🎨 Frontend en Vercel

### Pasos de Configuración:

1. **Conectar Proyecto**
   - Ve a https://vercel.com
   - Click en "Add New..." → "Project"
   - Selecciona tu repositorio

2. **Configuración del Proyecto**
   - **Framework Preset**: Vite
   - **Root Directory**: `./frontend` (si el repo es monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Variables de Entorno**
   En "Environment Variables" agrega:
   ```
   VITE_BACKEND_URL=https://poli-rent-backend.onrender.com/api
   ```

4. **Deploy**
   - Haz click en "Deploy"
   - Vercel construirá y desplegará automáticamente
   - Tu frontend estará disponible en la URL que Vercel te proporcione

### Configuración adicional:
- El archivo `vercel.json` ya está configurado con rewrites para SPA
- Los cambios en `main` (o tu rama principal) se despliegan automáticamente

---

## ✅ Verificación Post-Deploy

### Backend:
1. Accede a: `https://poli-rent-backend.onrender.com`
   - Deberías ver: "Server on"

2. Verifica la documentación: `https://poli-rent-backend.onrender.com/api-docs`

3. Prueba un endpoint:
   ```bash
   curl https://poli-rent-backend.onrender.com/api/usuarios
   ```

### Frontend:
1. Accede a tu URL de Vercel
2. Intenta hacer login
3. Verifica que las solicitudes al backend funcionen

---

## 🔧 Troubleshooting

### Error de CORS
- ✓ Verifica que `CORS_ORIGIN` en el backend incluya tu URL de Vercel
- ✓ Asegúrate de que el middleware de CORS esté al inicio de `server.js`

### Errores de Conexión a MongoDB
- ✓ Verifica que tu IP esté en la whitelist de MongoDB Atlas
- ✓ En Atlas: Network Access → IP Whitelist → Agregar `0.0.0.0/0` (para dev)

### Variables de Entorno no se cargan
- ✓ Render/Vercel cargan variables después del deployment
- ✓ Verifica los logs en los dashboards respectivos
- ✓ Fuerza un redeploy haciendo push a GitHub

### Email no se envía
- ✓ Verifica las credenciales de Brevo en `.env`
- ✓ Revisa los logs de Render para errores de SMTP

---

## 📌 URLs Importantes

| Servicio | URL |
|----------|-----|
| Backend (API) | https://poli-rent-backend.onrender.com/api |
| Backend (Docs) | https://poli-rent-backend.onrender.com/api-docs |
| Frontend | https://proyecto-alquiler-five.vercel.app |
| MongoDB URI | mongodb+srv://... |

---

## 🔄 Auto-Deploy

Ambas plataformas están configuradas para desplegar automáticamente cuando:
- Haces push a la rama principal (main/master)
- Cambias las variables de entorno

---

## 📝 Notas Importantes

1. El backend en Render puede tomar ~30 segundos en iniciar por primera vez
2. Si no hay actividad por 15 minutos en Render (plan gratuito), puede dormir
3. Actualiza regularmente las URLs si cambias de servidor
4. Mantén las credenciales de MongoDB y Brevo en secreto

---

¡Tu aplicación está lista para producción! 🚀
