# MovieStream DB

MovieStream DB es una aplicación web CRUD hecha con MongoDB donde se pueden administrar películas, actores e interacciones de usuarios.  
La aplicación permite crear, editar, eliminar y visualizar información desde una interfaz sencilla conectada a una API REST.

## ¿Qué hace el proyecto?

La app permite:

- Ver películas registradas
- Filtrar películas por género o búsqueda
- Agregar y editar películas
- Registrar interacciones de usuarios (views y ratings)
- Visualizar actores almacenados en la base de datos
- Consultar estadísticas generales de la colección

El proyecto fue construido como una adaptación NoSQL del modelo original de MovieStream usando MongoDB.

---

## Stack utilizado

### Backend
- Node.js
- Express

Usé Express porque permite crear una API REST rápida y simple sin demasiada configuración.

### Base de datos
- MongoDB Atlas

MongoDB permitió trabajar con documentos flexibles y manejar fácilmente arreglos embebidos como géneros y cast.

### Frontend
- HTML
- CSS
- JavaScript vanilla

El frontend está hecho sin frameworks para mantener el proyecto ligero y entender mejor toda la comunicación con la API.

### Deploy
- Render

Se utilizó Render porque permite desplegar aplicaciones Node.js gratis y conecta fácilmente con GitHub.

---

## Cómo correr el proyecto desde cero

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar MongoDB Atlas
- Crear una cuenta en MongoDB Atlas
- Crear un cluster gratuito M0
- Crear un usuario y contraseña
- En Network Access agregar: 0.0.0.0/0
- Copiar el connection string

### 3. Poblar la base de datos
```bash
MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/" node seed.js
```

Esto crea:
- películas
- actores
- usuarios
- interacciones

### 4. Ejecutar el servidor
```bash
MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/" npm start
```
 
Abrir http://localhost:3000
 
---
 
## Deploy en Render
 
1. Sube el proyecto a un repositorio de GitHub
2. Entra a render.com → Iniciar → New Web Service → Conecta el repositorio
3. Build Command: `npm install` / Start Command: `npm start`
4. Agrega variable de entorno `MONGODB_URI` con tu connection string de Atlas
5. Deploy → URL pública
---

## Estructura del proyecto

```txt
moviestream-db/
├── node_modules/
├── server.js
├── seed.js
├── package.json
├── package-lock.json
├── public/
│   └── index.html
│   └── style.css
├── reflection.md
└── README.md
```

---

## Captura de pantalla

<img width="1910" height="898" alt="mongoDB_moviestream" src="https://github.com/user-attachments/assets/1557db8d-39c7-4428-a9d8-68bd615115b1" />

---

## API principal

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/movies | Obtener películas |
| POST | /api/movies | Crear película |
| PUT | /api/movies/:id | Editar película |
| DELETE | /api/movies/:id | Eliminar película |
| GET | /api/interactions | Obtener interacciones |
| POST | /api/interactions | Crear interacción |
| GET | /api/users | Obtener usuarios |
| GET | /api/actors | Obtener actores |
| GET | /api/stats | Estadísticas |
