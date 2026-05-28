📌 Sistema de Gestión de Préstamos de Recursos Académicos y Tecnológicos (Backend)
Este repositorio contiene el componente backend desarrollado para el sistema web de gestión de préstamos de recursos de la Escuela de Formación de Tecnólogos (ESFOT). El sistema tiene como objetivo automatizar la administración, registro y seguimiento de materiales tecnológicos, optimizando los procesos institucionales mediante una arquitectura escalable basada en microservicios y APIs REST [cite: 1].

👨‍💻 Equipo de Desarrollo
Diego Camacho

Jairo Maigua

Anthony Ledesma

🛠 Tecnologías Utilizadas
El backend fue implementado utilizando un stack tecnológico moderno, aplicando el patrón arquitectónico MVC (Modelo-Vista-Controlador) para garantizar mantenibilidad y escalabilidad [cite: 1]:

Entorno: Node.js [cite: 1]

Framework: Express.js [cite: 1]

Base de Datos: MongoDB (NoSQL) [cite: 1]

Modelado de datos: Mongoose [cite: 1]

Seguridad: JWT (JSON Web Tokens) y bcryptjs [cite: 1]

🚀 Instalación y Ejecución
Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

1. Clonar el repositorio
Bash
git clone 
cd backend
2. Configurar variables de entorno
Crea un archivo .env en la raíz de la carpeta backend basándote en el archivo .env.example y configura tus credenciales:

MONGO_URI: Cadena de conexión a tu base de datos MongoDB.

JWT_SECRET: Llave secreta para la autenticación.

3. Instalar dependencias
Bash
npm install
4. Ejecutar el proyecto
Bash
npm run dev
📂 Documentación Académica
Para más información sobre la metodología Scrum aplicada, diseño de la arquitectura, y los resultados obtenidos, puedes consultar los documentos del Trabajo de Integración Curricular:
