# Portafolio de Hamil

Sitio en React + Vite. Firebase se encarga del login y guarda los datos, Cloudinary guarda las imágenes, los videos y el CV, y el deploy es en Vercel.

- `/` → portada (proyectos, sobre mí, habilidades, contacto)
- `/proyecto/<nombre>` → página de cada proyecto
- `/admin` → panel para subir y editar (solo entra tu cuenta de Google)

Si Firebase no está configurado, el sitio muestra contenido de ejemplo.

---

## 1. Probarlo en tu compu

Necesitás Node.js 20 o más nuevo.

```
npm install
npm run dev
```

Abrí la dirección que aparece (normalmente http://localhost:5173).

## 2. Crear el proyecto en Firebase

1. Entrá a https://console.firebase.google.com y creá un proyecto. Google Analytics no hace falta.
2. **Autenticación**: andá a *Compilación › Authentication › Comenzar › Google*, activalo y guardá.
3. **Base de datos**: andá a *Compilación › Firestore Database › Crear base de datos*, en modo producción. Elegí la ubicación `southamerica-east1` (São Paulo).
4. **App web**: andá a *Configuración del proyecto (engranaje) › Tus apps › icono `</>`*, registrala y copiá los datos de `firebaseConfig`.

## 3. Crear la cuenta de Cloudinary (imágenes, videos y CV)

1. Creá una cuenta gratis en https://cloudinary.com. No pide tarjeta.
2. En el inicio del panel vas a ver tu **Cloud name**. Copialo.
3. Andá a *Settings (engranaje) › Upload › Upload presets › Add upload preset* y configuralo así:
   - **Signing mode:** `Unsigned`.
   - **Asset folder:** `portafolio`.
   - Si tiene la opción, poné un límite de tamaño de archivo (por ejemplo 100 MB).
4. Guardalo y copiá el **nombre del preset**.
5. Andá a *Settings › Security* y activá **Allow delivery of PDF and ZIP files**. Sin esto, el CV en PDF no se puede descargar.

Algo a tener en cuenta: un preset unsigned permite subir sin clave, así que alguien que lea el código del sitio podría subir archivos a tu cuenta. No puede ver, cambiar ni borrar lo tuyo, y los proyectos igual solo los edita tu login. Si algún día ves archivos raros en la Media Library, cambiá el nombre del preset.

## 4. Variables de entorno

Copiá `.env.example` como `.env` y completalo:
- con los datos de `firebaseConfig`;
- en `VITE_ADMIN_EMAIL`, tu Gmail;
- en `VITE_CLOUDINARY_CLOUD`, tu Cloud name;
- en `VITE_CLOUDINARY_PRESET`, el nombre del preset.

Después cortá `npm run dev` con **Ctrl + C** y volvé a ejecutarlo para que tome los cambios.

## 5. Reglas de seguridad (importante)

1. Abrí `firestore.rules` y cambiá `TU-MAIL-ADMIN@gmail.com` por tu Gmail, el mismo de `VITE_ADMIN_EMAIL`.
2. En la consola de Firebase, andá a *Firestore › Reglas*, pegá el contenido de ese archivo y tocá **Publicar**.

Estas reglas protegen tus datos: cualquiera puede ver lo que marcás como visible, pero solo tu cuenta puede crear, editar o borrar proyectos y el perfil.

## 6. Deploy en Vercel

1. Subí la carpeta a un repo de GitHub. El `.env` no se sube, ya está en `.gitignore`.
2. En https://vercel.com: *Add New › Project*, elegí el repo. Vercel detecta Vite solo.
3. En *Environment Variables*, cargá las mismas 8 variables del `.env` y tocá Deploy.
4. Volvé a Firebase › *Authentication › Configuración › Dominios autorizados* y agregá tu dominio de Vercel (por ejemplo `portafolio-hamil.vercel.app`). Sin esto, el login con Google no funciona en el sitio publicado.

## 7. Usar el panel

1. Entrá a `tudominio/admin` y tocá **Entrar con Google**.
2. En **Mi perfil**, completá:
   - el título y la bajada de la portada;
   - el texto de Sobre mí, tu foto y tu CV en PDF;
   - tus habilidades;
   - tus datos de contacto.

   Usá las pestañas Español / English para cargar cada idioma.
3. En **Proyectos**, tocá **Nuevo proyecto** y completá los textos, las capturas, el video y los links. La primera captura es la portada.
4. Activá el interruptor **Visible** para que el proyecto aparezca en el sitio. Si lo dejás apagado, queda como borrador.
5. Con las flechitas de la lista cambiás el orden en que aparecen los proyectos.

## Dónde está cada cosa

| Archivo | Qué hace |
|---|---|
| `src/pages/Inicio.jsx` | Portada |
| `src/pages/Proyecto.jsx` | Página de un proyecto |
| `src/pages/Admin.jsx` | Login y panel |
| `src/lib/api.js` | Lectura y guardado en Firebase, subidas a Cloudinary |
| `src/lib/i18n.jsx` | Textos fijos en español e inglés |
| `src/lib/efectos.js` | Animaciones: aparecer al scrollear e inclinación 3D con el mouse |
| `src/data/demo.js` | Contenido de ejemplo cuando no hay Firebase |
| `src/index.css` | Todos los estilos y colores (variables arriba de todo) |

## Borrar archivos

Cuando quitás una imagen o borrás un proyecto desde el panel, desaparece del sitio, pero el archivo queda en Cloudinary. Borrar desde el navegador necesitaría exponer tu clave secreta. Para liberar espacio, borrá los archivos desde la *Media Library* de Cloudinary, carpeta `portafolio`.
