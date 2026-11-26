import {
  collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseListo } from './firebase'
import { demoPerfil, demoProyectos } from '../data/demo'

const porOrden = (a, b) => (a.orden ?? 999) - (b.orden ?? 999)

export async function obtenerProyectos({ todos = false } = {}) {
  if (!firebaseListo) return [...demoProyectos].sort(porOrden)
  const col = collection(db, 'projects')
  const snap = await getDocs(todos ? col : query(col, where('visible', '==', true)))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(porOrden)
}

export async function obtenerProyecto(slug) {
  if (!firebaseListo) return demoProyectos.find((p) => p.slug === slug) || null
  const snap = await getDocs(query(collection(db, 'projects'), where('slug', '==', slug), where('visible', '==', true)))
  const d = snap.docs[0]
  return d ? { id: d.id, ...d.data() } : null
}

export async function obtenerPerfil() {
  if (!firebaseListo) return demoPerfil
  const snap = await getDoc(doc(db, 'site', 'perfil'))
  return snap.exists() ? { ...demoPerfil, ...snap.data() } : demoPerfil
}

export async function guardarPerfil(perfil) {
  await setDoc(doc(db, 'site', 'perfil'), { ...perfil, actualizado: serverTimestamp() })
}

export const nuevoId = () => doc(collection(db, "projects")).id

export async function guardarProyecto(p) {
  const { id, ...datos } = p
  const ref_ = id ? doc(db, 'projects', id) : doc(collection(db, 'projects'))
  await setDoc(ref_, { ...datos, actualizado: serverTimestamp() })
  return ref_.id
}

// Cloudinary no deja borrar desde el navegador sin exponer la clave secreta.
// Los archivos que quites quedan en tu cuenta; si querés liberar espacio,
// borralos desde la Media Library de Cloudinary.
export async function borrarArchivo() {}

export async function borrarProyecto(p) {
  const archivos = [...(p.imagenes || []).map((i) => i.ruta), p.video?.ruta]
  await Promise.all(archivos.map(borrarArchivo))
  await deleteDoc(doc(db, 'projects', p.id))
}

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD
const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET

export function subirArchivo(file, carpeta, alProgresar) {
  if (!CLOUD || !PRESET) return Promise.reject(new Error('Falta configurar Cloudinary en el .env'))
  const datos = new FormData()
  datos.append('file', file)
  datos.append('upload_preset', PRESET)
  datos.append('folder', `portafolio/${carpeta}`)
  return new Promise((ok, mal) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`)
    xhr.upload.onprogress = (e) => e.lengthComputable && alProgresar?.(Math.round((e.loaded / e.total) * 100))
    xhr.onerror = () => mal(new Error('Sin conexión con Cloudinary'))
    xhr.onload = () => {
      let r = {}
      try { r = JSON.parse(xhr.responseText) } catch { /* respuesta rara */ }
      if (xhr.status >= 300 || !r.secure_url) return mal(new Error(r.error?.message || `Error ${xhr.status}`))
      const esImagen = r.resource_type === 'image' && r.format !== 'pdf'
      const url = esImagen ? r.secure_url.replace('/upload/', '/upload/f_auto,q_auto/') : r.secure_url
      ok({ url, ruta: r.public_id, tipo: file.type })
    }
    xhr.send(datos)
  })
}

export const slugDe = (texto) =>
  (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'proyecto'
