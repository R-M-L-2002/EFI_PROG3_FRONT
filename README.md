# Frontend - Sistema de Reparación de Dispositivos

Frontend en React + Vite para el sistema de gestión de reparaciones.

## Requisitos

- Node.js 16+
- Backend corriendo en http://localhost:3001

## Instalación

\`\`\`bash
cd frontend
npm install
\`\`\`

## Configuración

Crea un archivo `.env` en la carpeta `frontend/`:

\`\`\`env
VITE_API_URL=http://localhost:3001
\`\`\`

## Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

El frontend se ejecutará en http://localhost:5173

## Testing paso a paso

### 1. Iniciar el backend

\`\`\`bash
cd backend
npm run dev
\`\`\`

Verifica que veas: "Server running on port 3001"

### 2. Iniciar el frontend

\`\`\`bash
cd frontend
npm run dev
\`\`\`

Abre http://localhost:5173 en tu navegador

### 3. Probar autenticación

1. Deberías ver la página de Login
2. Abre la consola del navegador (F12 → Console)
3. Ingresa las credenciales del seed:
   - Email: `admin@test.com`
   - Password: `password123`
4. Click en "Iniciar Sesión"

### 4. Verificar que funcione

En la consola del navegador deberías ver logs como:

\`\`\`
[v0] Intentando login con: {email: "admin@test.com"}
[v0] Token almacenado en localStorage
[v0] Login exitoso, redirigiendo...
[v0] Usuario actual en Dashboard: {id: 1, name: "...", ...}
\`\`\`

Si ves el Dashboard con el mensaje verde "Test Exitoso", todo funciona correctamente.

### 5. Verificar el interceptor de Axios

1. En la consola, ve a la pestaña "Network" (Red)
2. Recarga la página (F5)
3. Busca peticiones a `/api/users/me` o similares
4. Click en la petición → Headers → Request Headers
5. Deberías ver: `Authorization: Bearer <tu-token>`

## Estructura del proyecto

\`\`\`
frontend/
├── src/
│   ├── api/              # Configuración de Axios con interceptor JWT
│   ├── contexts/         # Context API (Auth, Devices, RepairOrders, Repairs)
│   ├── services/         # Servicios para llamar al backend
│   ├── pages/            # Páginas/vistas (Login, Dashboard, etc)
│   ├── routes/           # Configuración de rutas (PrivateRoute, PublicRoute)
│   ├── utils/            # Utilidades (exportToPDF)
│   ├── App.jsx           # Componente principal con providers
│   └── main.jsx          # Punto de entrada
\`\`\`

## Próximos pasos

Una vez verificado que todo funciona:
1. Crear páginas completas para Devices, RepairOrders, Repairs
2. Agregar componentes de formularios y modales
3. Implementar exportación a PDF
4. Agregar filtros, búsquedas y paginación
