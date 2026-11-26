import { createContext, useContext, useEffect, useState } from 'react'

const textos = {
  es: {
    nav_proyectos: 'Proyectos', nav_sobre: 'Sobre mí', nav_habilidades: 'Habilidades', nav_contacto: 'Contacto',
    disponible: 'Disponible para proyectos',
    ver_proyectos: 'Ver proyectos', contactarme: 'Contactarme',
    proyectos_sub: 'Cosas que diseñé y programé de principio a fin.',
    todos: 'Todos', sin_proyectos: 'Todavía no hay proyectos en esta categoría.',
    tu_foto: 'Tu foto', descargar_cv: 'Descargar CV (PDF)',
    cta_titulo: '¿Tenés un proyecto en mente?', cta_sub: 'Escribime y te respondo en el día.',
    acceso_admin: 'Acceso admin',
    volver: 'Volver a proyectos', ver_vivo: 'Ver en vivo', codigo: 'Código en GitHub',
    sobre_proyecto: 'Sobre el proyecto', video: 'Video', links: 'Links',
    sitio_vivo: 'Sitio en vivo', repositorio: 'Repositorio', otro_link: 'Otro link',
    categoria: 'Categoría', anio: 'Año', siguiente: 'Siguiente proyecto',
    no_encontrado: 'No encontré ese proyecto.', cargando: 'Cargando…',
    cat_Web: 'Web', cat_Móvil: 'Móvil', cat_Juegos: 'Juegos', cat_Otros: 'Otros',
  },
  en: {
    nav_proyectos: 'Projects', nav_sobre: 'About', nav_habilidades: 'Skills', nav_contacto: 'Contact',
    disponible: 'Available for projects',
    ver_proyectos: 'See projects', contactarme: 'Contact me',
    proyectos_sub: 'Things I designed and built end to end.',
    todos: 'All', sin_proyectos: 'No projects in this category yet.',
    tu_foto: 'Your photo', descargar_cv: 'Download CV (PDF)',
    cta_titulo: 'Have a project in mind?', cta_sub: "Write to me and I'll reply the same day.",
    acceso_admin: 'Admin access',
    volver: 'Back to projects', ver_vivo: 'See it live', codigo: 'Code on GitHub',
    sobre_proyecto: 'About the project', video: 'Video', links: 'Links',
    sitio_vivo: 'Live site', repositorio: 'Repository', otro_link: 'Other link',
    categoria: 'Category', anio: 'Year', siguiente: 'Next project',
    no_encontrado: "I couldn't find that project.", cargando: 'Loading…',
    cat_Web: 'Web', cat_Móvil: 'Mobile', cat_Juegos: 'Games', cat_Otros: 'Other',
  },
}

const Ctx = createContext(null)

export function IdiomaProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || (navigator.language.startsWith('es') ? 'es' : 'en') } catch { return 'es' }
  })
  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('lang', lang) } catch { /* sin almacenamiento */ }
  }, [lang])
  const t = (k) => textos[lang][k] ?? k
  const tr = (obj) => (obj && typeof obj === 'object' ? obj[lang] || obj.es || obj.en || '' : obj || '')
  return <Ctx.Provider value={{ lang, setLang, t, tr }}>{children}</Ctx.Provider>
}

export const useIdioma = () => useContext(Ctx)
