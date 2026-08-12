# 🛒 Mi Ecommerce - Hardware Shop

Bienvenido al repositorio de **Mi Ecommerce**, un proyecto de tienda virtual orientado a hardware de un proyecto facultativo de la materia Web 1.

**Alumnos🤠:** Silvera Alvaro, Oliva Jonathan, Mercado Luka. 

Este proyecto está construido utilizando una arquitectura **desacoplada**, lo que significa que está dividido en dos partes principales que trabajan juntas: un **Backend** y un **Frontend**.

## 🏗️ Arquitectura del Proyecto

### 1. Backend (`/backend`)
Desarrollado con **Node.js, Express y SQLite**.
Cumple dos roles fundamentales:
* **Tienda Pública:** Utiliza el motor de plantillas **EJS** para renderizar las vistas desde el servidor (SSR). Aquí es donde los clientes pueden ver el catálogo, agregar productos al carrito, registrarse e iniciar sesión.
* **API REST:** Provee distintos endpoints (rutas `/api/...`) que devuelven información en formato JSON puro.

### 2. Frontend (`/frontend`)
Desarrollado con **React y Vite**.
* **Panel de Administración (Backoffice):** Es una *Single Page Application (SPA)* consumida únicamente por los administradores. Se conecta al Backend consumiendo su API REST para realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre productos, categorías y usuarios.

---

## 🚀 Cómo inicializar el proyecto localmente

Para ejecutar el proyecto en tu computadora, vas a necesitar abrir **dos terminales diferentes**, una para encender el servidor Backend y otra para el panel Frontend.

### Paso 1: Iniciar el Backend (Servidor y Tienda)

1. Abrí una terminal y navegá hacia la carpeta del backend:
   ```bash
   cd backend
   ```
2. *(Opcional)* Si es la primera vez que clonás el proyecto, instalá las dependencias:
   ```bash
   npm install
   ```
3. Ejecutá el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor se iniciará. Podrás acceder a la tienda pública ingresando a `http://localhost:3000` en tu navegador. La base de datos SQLite se inicializará automáticamente si no existe.*

### Paso 2: Iniciar el Frontend (Panel de Administración)

1. Abrí una **segunda terminal** (sin cerrar la primera) y navegá hacia la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. *(Opcional)* Si es la primera vez que clonás el proyecto, instalá las dependencias:
   ```bash
   npm install
   ```
3. Ejecutá la aplicación de React:
   ```bash
   npm run dev
   ```
   *Vite iniciará la aplicación. Podrás acceder al panel de administración ingresando a la URL que te indique la consola (generalmente `http://localhost:5173`).*

---

## 🛠️ Tecnologías Utilizadas

* **Node.js & Express:** Creación del servidor y rutas.
* **better-sqlite3:** Base de datos relacional ligera y sincrónica.
* **EJS:** Motor de plantillas para HTML dinámico.
* **React & Vite:** Framework de frontend rápido para el panel de control.
* **react-router-dom:** Manejo de rutas sin recarga en el panel de React.
* **express-session:** Manejo de sesiones de usuario y carrito de compras.
