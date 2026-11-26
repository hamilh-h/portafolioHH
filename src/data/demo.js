// Contenido de ejemplo: se usa solo mientras Firebase no está configurado.
export const demoPerfil = {
  titulo: { es: 'Hago apps y sitios web que funcionan de verdad.', en: 'I build apps and websites that actually work.' },
  bajada: {
    es: 'Soy Hamil, estudiante de ingeniería en la UTN San Rafael. Diseño y programo apps web, móviles y herramientas a medida.',
    en: "I'm Hamil, an engineering student at UTN San Rafael. I design and build web apps, mobile apps and custom tools.",
  },
  sobre: {
    es: 'Estudio ingeniería en la UTN Facultad Regional San Rafael, Mendoza. Me gusta resolver problemas reales con código: desde organizar el estudio hasta automatizar mensajes o armar plugins para un servidor de juegos.',
    en: 'I study engineering at UTN San Rafael, Mendoza. I like solving real problems with code: from organizing study time to automating messages or building plugins for a game server.',
  },
  email: '', github: '', linkedin: '', whatsapp: '',
  fotoUrl: '', cvUrl: '',
  habilidades: [
    { area: { es: 'Lenguajes', en: 'Languages' }, items: ['Python', 'JavaScript', 'Java', 'Dart', 'Assembly 8086'] },
    { area: { es: 'Web y apps', en: 'Web & apps' }, items: ['HTML y CSS', 'React', 'Flutter', 'PWA'] },
    { area: { es: 'Herramientas', en: 'Tools' }, items: ['Git y GitHub', 'Firebase', 'Vercel', 'VS Code'] },
  ],
}

export const demoProyectos = [
  {
    id: 'hfoco', slug: 'hfoco', orden: 1, visible: true, categoria: 'Web', anio: '2026', color: '#DCE5FF',
    nombre: { es: 'HFoco', en: 'HFoco' },
    desc: { es: 'App para organizar el estudio, instalable en Android y PC.', en: 'Study planner app you can install on Android and PC.' },
    cuerpo: { es: '', en: '' }, tags: ['PWA', 'Web'], imagenes: [], video: null, links: { vivo: '', github: '', otro: '' },
  },
  {
    id: 'next-level', slug: 'next-level', orden: 2, visible: true, categoria: 'Web', anio: '2026', color: '#E4F4EC',
    nombre: { es: 'Next Level', en: 'Next Level' },
    desc: { es: 'Manda un mismo mensaje a una lista de contactos por WhatsApp, SMS o Instagram.', en: 'Sends one message to a contact list via WhatsApp, SMS or Instagram.' },
    cuerpo: { es: '', en: '' }, tags: ['Web', 'Automatización'], imagenes: [], video: null, links: { vivo: '', github: '', otro: '' },
  },
  {
    id: 'hhplugin', slug: 'hhplugin', orden: 3, visible: true, categoria: 'Juegos', anio: '2026', color: '#FDEBDD',
    nombre: { es: 'HHplugin', en: 'HHplugin' },
    desc: { es: 'Plugin para servidor de Minecraft: clanes, protecciones y economía.', en: 'Minecraft server plugin: clans, land protection and economy.' },
    cuerpo: { es: '', en: '' }, tags: ['Java', 'Paper'], imagenes: [], video: null, links: { vivo: '', github: '', otro: '' },
  },
  {
    id: 'instagram-parser', slug: 'instagram-parser', orden: 4, visible: true, categoria: 'Móvil', anio: '2026', color: '#F1E6FB',
    nombre: { es: 'Instagram Parser', en: 'Instagram Parser' },
    desc: { es: 'App que lee la exportación de Instagram y muestra quién no te sigue.', en: "App that reads your Instagram export and shows who doesn't follow you back." },
    cuerpo: { es: '', en: '' }, tags: ['Flutter', 'Móvil'], imagenes: [], video: null, links: { vivo: '', github: '', otro: '' },
  },
]
