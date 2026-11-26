import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, google, firebaseListo, ADMIN_EMAIL } from '../lib/firebase'
import {
  obtenerProyectos, guardarProyecto, borrarProyecto, borrarArchivo, subirArchivo,
  obtenerPerfil, guardarPerfil, nuevoId, slugDe,
} from '../lib/api'
import { Logo } from '../components/Encabezado'
import Icono from '../components/Icono'

const CATS = ['Web', 'Móvil', 'Juegos', 'Otros']
const COLORES = ['#DCE5FF', '#E4F4EC', '#FDEBDD', '#F1E6FB', '#FDF3C7', '#E9EDF5']

const vacio = () => ({
  id: nuevoId(), nuevo: true, slug: '', orden: 999, visible: false, categoria: 'Web', anio: String(new Date().getFullYear()),
  color: COLORES[0], nombre: { es: '', en: '' }, desc: { es: '', en: '' }, cuerpo: { es: '', en: '' },
  tags: [], imagenes: [], video: null, links: { vivo: '', github: '', otro: '' },
})

function Aviso({ texto }) {
  return texto ? <div className="aviso" role="status">{texto}</div> : null
}

function Confirmar({ abierto, titulo, texto, onSi, onNo }) {
  if (!abierto) return null
  return (
    <div className="modal-fondo" onClick={onNo}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="conf-t" onClick={(e) => e.stopPropagation()}>
        <h3 id="conf-t">{titulo}</h3>
        <p>{texto}</p>
        <div className="botones derecha">
          <button type="button" className="btn btn-blanco" onClick={onNo}>Cancelar</button>
          <button type="button" className="btn btn-rojo" onClick={onSi}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

function PestanasIdioma({ lang, setLang }) {
  return (
    <div className="idioma" role="group" aria-label="Idioma del texto">
      <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>Español</button>
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
    </div>
  )
}

function Interruptor({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="switch" onClick={() => onChange(!on)}>
      <span />
    </button>
  )
}

/* ---------- Editor de un proyecto ---------- */
function EditorProyecto({ inicial, todos, alGuardar, alCerrar, avisar }) {
  const [p, setP] = useState(inicial)
  const [lang, setLang] = useState('es')
  const [progreso, setProgreso] = useState(null)
  const [nuevas, setNuevas] = useState([])
  const [quitadas, setQuitadas] = useState([])
  const [borrando, setBorrando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const set = (campo, valor) => setP((x) => ({ ...x, [campo]: valor }))
  const setTxt = (campo, valor) => setP((x) => ({ ...x, [campo]: { ...x[campo], [lang]: valor } }))
  const setLink = (campo, valor) => setP((x) => ({ ...x, links: { ...x.links, [campo]: valor } }))

  const subir = async (files, esVideo) => {
    for (const f of files) {
      try {
        setProgreso(0)
        const r = await subirArchivo(f, `projects/${p.id}`, setProgreso)
        setNuevas((n) => [...n, r.ruta])
        if (esVideo) {
          if (p.video?.ruta) setQuitadas((q) => [...q, p.video.ruta])
          set('video', r)
        } else {
          setP((x) => ({ ...x, imagenes: [...x.imagenes, r] }))
        }
      } catch (e) { avisar('No se pudo subir ' + f.name + ': ' + e.message) }
    }
    setProgreso(null)
  }

  const quitarImg = (i) => {
    setQuitadas((q) => [...q, p.imagenes[i].ruta])
    set('imagenes', p.imagenes.filter((_, j) => j !== i))
  }
  const portada = (i) => set('imagenes', [p.imagenes[i], ...p.imagenes.filter((_, j) => j !== i)])

  const guardar = async () => {
    if (!p.nombre.es.trim()) { setLang('es'); avisar('Poné al menos el nombre en español.'); return }
    setGuardando(true)
    try {
      let slug = p.slug || slugDe(p.nombre.es)
      const usados = todos.filter((x) => x.id !== p.id).map((x) => x.slug)
      let base = slug, n = 2
      while (usados.includes(slug)) slug = `${base}-${n++}`
      const orden = p.nuevo ? Math.max(0, ...todos.map((x) => x.orden || 0)) + 1 : p.orden
      const { nuevo, ...datos } = { ...p, slug, orden }
      await guardarProyecto(datos)
      await Promise.all(quitadas.map(borrarArchivo))
      avisar('Guardado ✓')
      alGuardar()
    } catch (e) { avisar('Error al guardar: ' + e.message) }
    setGuardando(false)
  }

  const cancelar = async () => {
    await Promise.all(nuevas.map(borrarArchivo))
    alCerrar()
  }

  const eliminar = async () => {
    setBorrando(false)
    try {
      await Promise.all(nuevas.map(borrarArchivo))
      if (!p.nuevo) await borrarProyecto(inicial)
      avisar('Proyecto eliminado')
      alGuardar()
    } catch (e) { avisar('Error al eliminar: ' + e.message) }
  }

  return (
    <section className="panel-caja editor">
      <div className="editor-cabecera">
        <h2>{p.nuevo ? 'Nuevo proyecto' : `Editar · ${inicial.nombre.es}`}</h2>
        <PestanasIdioma lang={lang} setLang={setLang} />
      </div>

      <form className="formulario" onSubmit={(e) => { e.preventDefault(); guardar() }}>
        <label>Nombre ({lang === 'es' ? 'español' : 'inglés'})
          <input value={p.nombre[lang]} onChange={(e) => setTxt('nombre', e.target.value)} placeholder={lang === 'es' ? 'Ej: HFoco' : 'Optional: same as Spanish'} />
        </label>
        <label>Descripción corta ({lang === 'es' ? 'español' : 'inglés'})
          <textarea rows="2" value={p.desc[lang]} onChange={(e) => setTxt('desc', e.target.value)} />
        </label>
        <label>Texto largo: qué es, cómo lo hiciste ({lang === 'es' ? 'español' : 'inglés'})
          <textarea rows="5" value={p.cuerpo[lang]} onChange={(e) => setTxt('cuerpo', e.target.value)} />
        </label>

        <div className="fila-campos">
          <label>Categoría
            <select value={p.categoria} onChange={(e) => set('categoria', e.target.value)}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Año
            <input inputMode="numeric" value={p.anio} onChange={(e) => set('anio', e.target.value)} />
          </label>
          <label className="ancho">Etiquetas (separadas por coma)
            <input value={p.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} />
          </label>
        </div>

        <div className="campo">
          <span>Color de fondo de la tarjeta</span>
          <div className="colores">
            {COLORES.map((c) => (
              <button key={c} type="button" aria-label={`Color ${c}`} aria-pressed={p.color === c} style={{ background: c }} onClick={() => set('color', c)} />
            ))}
          </div>
        </div>

        <div className="campo">
          <span>Capturas y GIFs (la primera es la portada, hasta 10 MB cada una)</span>
          <label className="zona-subida">
            <Icono n="subir" size={26} />
            <span>Arrastrá imágenes o <b>elegí archivos</b></span>
            <input type="file" accept="image/*" multiple className="oculto" onChange={(e) => { subir([...e.target.files], false); e.target.value = '' }} />
          </label>
          {p.imagenes.length > 0 && (
            <div className="mini-grilla">
              {p.imagenes.map((im, i) => (
                <div key={im.ruta || im.url} className="mini">
                  <img src={im.url} alt="" />
                  {i === 0 && <span className="mini-tag">Portada</span>}
                  <div className="mini-acciones">
                    {i > 0 && <button type="button" onClick={() => portada(i)}>Portada</button>}
                    <button type="button" aria-label="Quitar imagen" onClick={() => quitarImg(i)}><Icono n="cruz" size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="campo">
          <span>Video (opcional, MP4 hasta 100 MB)</span>
          {p.video?.url
            ? <div className="video-fila">
                <video src={p.video.url} controls preload="metadata" />
                <button type="button" className="btn btn-blanco" onClick={() => { setQuitadas((q) => [...q, p.video.ruta]); set('video', null) }}>Quitar video</button>
              </div>
            : <label className="zona-subida chica">
                <Icono n="subir" size={22} /><span><b>Elegí un video</b></span>
                <input type="file" accept="video/*" className="oculto" onChange={(e) => { subir([...e.target.files].slice(0, 1), true); e.target.value = '' }} />
              </label>}
        </div>
        {progreso !== null && <div className="progreso"><span style={{ width: `${progreso}%` }} /><em>Subiendo… {progreso}%</em></div>}

        <div className="fila-campos">
          <label>Link en vivo<input type="url" placeholder="https://…" value={p.links.vivo} onChange={(e) => setLink('vivo', e.target.value)} /></label>
          <label>GitHub<input type="url" placeholder="https://github.com/…" value={p.links.github} onChange={(e) => setLink('github', e.target.value)} /></label>
          <label>Otro link<input type="url" placeholder="https://…" value={p.links.otro} onChange={(e) => setLink('otro', e.target.value)} /></label>
        </div>

        <div className="campo fila-switch">
          <Interruptor on={p.visible} onChange={(v) => set('visible', v)} label="Mostrar en el sitio" />
          <span>{p.visible ? 'Visible en el sitio' : 'Oculto (borrador)'}</span>
        </div>

        <div className="botones derecha">
          <button type="button" className="btn btn-blanco texto-rojo" onClick={() => setBorrando(true)}>Eliminar</button>
          <button type="button" className="btn btn-blanco" onClick={cancelar}>Cancelar</button>
          <button type="submit" className="btn btn-negro" disabled={guardando || progreso !== null}>{guardando ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
      <Confirmar abierto={borrando} titulo="¿Eliminar este proyecto?" texto="Se borra del sitio y no se puede deshacer. Sus archivos quedan en tu Cloudinary."
        onSi={eliminar} onNo={() => setBorrando(false)} />
    </section>
  )
}

/* ---------- Pestaña Proyectos ---------- */
function PanelProyectos({ avisar }) {
  const [lista, setLista] = useState([])
  const [editando, setEditando] = useState(null)

  const cargar = () => obtenerProyectos({ todos: true }).then(setLista).catch((e) => avisar(e.message))
  useEffect(() => { cargar() }, [])

  const cambiarVisible = async (p, v) => {
    setLista((l) => l.map((x) => (x.id === p.id ? { ...x, visible: v } : x)))
    try { await guardarProyecto({ ...p, visible: v }) } catch (e) { avisar(e.message); cargar() }
  }

  const mover = async (i, d) => {
    const j = i + d
    if (j < 0 || j >= lista.length) return
    const nueva = [...lista];[nueva[i], nueva[j]] = [nueva[j], nueva[i]]
    const conOrden = nueva.map((x, k) => ({ ...x, orden: k + 1 }))
    setLista(conOrden)
    try { await Promise.all([conOrden[i], conOrden[j]].map(guardarProyecto)) } catch (e) { avisar(e.message); cargar() }
  }

  return (
    <>
      <div className="panel-cabecera">
        <div>
          <h1>Proyectos</h1>
          <p className="sub">Lo que guardes acá aparece en el sitio al instante.</p>
        </div>
        <button type="button" className="btn btn-azul" onClick={() => setEditando(vacio())}><Icono n="mas" /> Nuevo proyecto</button>
      </div>
      <div className="panel-columnas">
        <section className="panel-caja lista">
          <div className="lista-cabecera"><span>{lista.length} proyectos</span><span>Visible</span></div>
          {lista.length === 0 && <p className="vacio">Todavía no subiste proyectos. Tocá “Nuevo proyecto”.</p>}
          {lista.map((p, i) => (
            <div className={'lista-fila' + (editando?.id === p.id ? ' activa' : '')} key={p.id}>
              <div className="orden">
                <button type="button" aria-label="Subir" disabled={i === 0} onClick={() => mover(i, -1)}><Icono n="arriba" size={14} /></button>
                <button type="button" aria-label="Bajar" disabled={i === lista.length - 1} onClick={() => mover(i, 1)}><Icono n="abajo" size={14} /></button>
              </div>
              <div className="lista-mini" style={{ background: p.color }}>{p.imagenes?.[0] && <img src={p.imagenes[0].url} alt="" />}</div>
              <button type="button" className="lista-nombre" onClick={() => setEditando(p)}>
                <b>{p.nombre.es}</b>
                <span>{p.categoria} · {p.imagenes?.length || 0} capturas</span>
              </button>
              <button type="button" className="icono-btn" aria-label={`Editar ${p.nombre.es}`} onClick={() => setEditando(p)}><Icono n="lapiz" /></button>
              <Interruptor on={!!p.visible} onChange={(v) => cambiarVisible(p, v)} label={`Mostrar ${p.nombre.es} en el sitio`} />
            </div>
          ))}
        </section>
        {editando
          ? <EditorProyecto key={editando.id} inicial={editando} todos={lista} avisar={avisar}
              alGuardar={() => { setEditando(null); cargar() }} alCerrar={() => setEditando(null)} />
          : <section className="panel-caja ayuda"><Icono n="lapiz" size={26} /><p>Elegí un proyecto para editarlo o creá uno nuevo.</p></section>}
      </div>
    </>
  )
}

/* ---------- Pestaña Perfil ---------- */
function PanelPerfil({ avisar }) {
  const [pf, setPf] = useState(null)
  const [lang, setLang] = useState('es')
  const [progreso, setProgreso] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => { obtenerPerfil().then(setPf).catch((e) => avisar(e.message)) }, [])
  if (!pf) return <p className="estado">Cargando…</p>

  const set = (k, v) => setPf((x) => ({ ...x, [k]: v }))
  const setTxt = (k, v) => setPf((x) => ({ ...x, [k]: { ...x[k], [lang]: v } }))
  const setHab = (i, cambio) => set('habilidades', pf.habilidades.map((h, j) => (j === i ? { ...h, ...cambio } : h)))

  const subir = async (file, campo, carpeta) => {
    if (!file) return
    try {
      setProgreso(0)
      const viejo = pf[campo + 'Ruta']
      const r = await subirArchivo(file, carpeta, setProgreso)
      setPf((x) => ({ ...x, [campo + 'Url']: r.url, [campo + 'Ruta']: r.ruta }))
      if (viejo) borrarArchivo(viejo)
      avisar('Archivo subido. Acordate de guardar.')
    } catch (e) { avisar('Error al subir: ' + e.message) }
    setProgreso(null)
  }

  const guardar = async () => {
    setGuardando(true)
    try { await guardarPerfil(pf); avisar('Perfil guardado ✓') } catch (e) { avisar('Error: ' + e.message) }
    setGuardando(false)
  }

  return (
    <>
      <div className="panel-cabecera">
        <div><h1>Mi perfil</h1><p className="sub">Portada, sobre mí, habilidades, contacto y CV.</p></div>
        <PestanasIdioma lang={lang} setLang={setLang} />
      </div>
      <form className="panel-caja formulario perfil" onSubmit={(e) => { e.preventDefault(); guardar() }}>
        <h3>Portada</h3>
        <label>Título grande<input value={pf.titulo?.[lang] || ''} onChange={(e) => setTxt('titulo', e.target.value)} /></label>
        <label>Bajada<textarea rows="2" value={pf.bajada?.[lang] || ''} onChange={(e) => setTxt('bajada', e.target.value)} /></label>

        <h3>Sobre mí</h3>
        <label>Texto (dejá una línea en blanco entre párrafos)<textarea rows="5" value={pf.sobre?.[lang] || ''} onChange={(e) => setTxt('sobre', e.target.value)} /></label>
        <div className="fila-campos">
          <div className="campo">
            <span>Foto</span>
            <div className="archivo-fila">
              {pf.fotoUrl && <img className="foto-mini" src={pf.fotoUrl} alt="" />}
              <label className="btn btn-blanco">Elegir foto<input type="file" accept="image/*" className="oculto" onChange={(e) => subir(e.target.files[0], 'foto', 'perfil')} /></label>
            </div>
          </div>
          <div className="campo">
            <span>CV en PDF</span>
            <div className="archivo-fila">
              {pf.cvUrl && <a href={pf.cvUrl} target="_blank" rel="noopener">Ver CV actual</a>}
              <label className="btn btn-blanco">Subir CV<input type="file" accept="application/pdf" className="oculto" onChange={(e) => subir(e.target.files[0], 'cv', 'perfil')} /></label>
            </div>
          </div>
        </div>
        {progreso !== null && <div className="progreso"><span style={{ width: `${progreso}%` }} /><em>Subiendo… {progreso}%</em></div>}

        <h3>Habilidades</h3>
        {pf.habilidades.map((h, i) => (
          <div className="fila-campos habilidad" key={i}>
            <label>Grupo ({lang === 'es' ? 'español' : 'inglés'})<input value={h.area?.[lang] || ''} onChange={(e) => setHab(i, { area: { ...h.area, [lang]: e.target.value } })} /></label>
            <label className="ancho">Items (separados por coma)<input value={h.items.join(', ')} onChange={(e) => setHab(i, { items: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} /></label>
            <button type="button" className="icono-btn" aria-label="Quitar grupo" onClick={() => set('habilidades', pf.habilidades.filter((_, j) => j !== i))}><Icono n="tacho" /></button>
          </div>
        ))}
        <button type="button" className="btn btn-blanco" onClick={() => set('habilidades', [...pf.habilidades, { area: { es: '', en: '' }, items: [] }])}><Icono n="mas" /> Agregar grupo</button>

        <h3>Contacto</h3>
        <div className="fila-campos">
          <label>Mail<input type="email" value={pf.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label>WhatsApp (con código de país)<input inputMode="tel" placeholder="54 9 260 …" value={pf.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></label>
        </div>
        <div className="fila-campos">
          <label>GitHub<input type="url" placeholder="https://github.com/…" value={pf.github} onChange={(e) => set('github', e.target.value)} /></label>
          <label>LinkedIn<input type="url" placeholder="https://linkedin.com/in/…" value={pf.linkedin} onChange={(e) => set('linkedin', e.target.value)} /></label>
        </div>
        <div className="botones derecha">
          <button type="submit" className="btn btn-negro" disabled={guardando || progreso !== null}>{guardando ? 'Guardando…' : 'Guardar perfil'}</button>
        </div>
      </form>
    </>
  )
}

/* ---------- Página Admin ---------- */
export default function Admin() {
  const [usuario, setUsuario] = useState(undefined)
  const [pestana, setPestana] = useState('proyectos')
  const [aviso, setAviso] = useState('')

  useEffect(() => { document.title = 'Admin · Hamil' }, [])
  useEffect(() => (auth ? onAuthStateChanged(auth, setUsuario) : undefined), [])
  useEffect(() => { if (!aviso) return; const t = setTimeout(() => setAviso(''), 3500); return () => clearTimeout(t) }, [aviso])

  if (!firebaseListo) return (
    <div className="login"><div className="login-caja">
      <Logo /><h1>Falta configurar Firebase</h1>
      <p>Completá el archivo <code>.env</code> (o las variables en Vercel) siguiendo el LEEME.md. Mientras tanto el sitio muestra contenido de ejemplo.</p>
      <Link className="btn btn-blanco" to="/">Ver sitio</Link>
    </div></div>
  )
  if (usuario === undefined) return <div className="login"><p className="estado">Cargando…</p></div>

  const esAdmin = usuario && usuario.email?.toLowerCase() === ADMIN_EMAIL
  if (!esAdmin) return (
    <div className="login"><div className="login-caja">
      <Logo /><h1>Panel admin</h1>
      {usuario
        ? <><p>La cuenta <b>{usuario.email}</b> no tiene acceso.</p><button type="button" className="btn btn-blanco" onClick={() => signOut(auth)}>Usar otra cuenta</button></>
        : <><p>Entrá con tu cuenta de Google para administrar el portafolio.</p>
            <button type="button" className="btn btn-negro" onClick={() => signInWithPopup(auth, google).catch((e) => setAviso(e.message))}>Entrar con Google</button></>}
      <Link to="/" className="link-chico">Volver al sitio</Link>
    </div><Aviso texto={aviso} /></div>
  )

  return (
    <div className="admin">
      <aside className="lateral">
        <div className="lateral-logo"><Logo /> <span className="etq-admin">ADMIN</span></div>
        <button type="button" aria-current={pestana === 'proyectos'} onClick={() => setPestana('proyectos')}><Icono n="grilla" /> Proyectos</button>
        <button type="button" aria-current={pestana === 'perfil'} onClick={() => setPestana('perfil')}><Icono n="persona" /> Mi perfil</button>
        <div className="espacio" />
        <Link to="/" target="_blank"><Icono n="ojo" /> Ver sitio</Link>
        <button type="button" className="texto-rojo" onClick={() => signOut(auth)}><Icono n="salir" /> Cerrar sesión</button>
      </aside>
      <main className="admin-main">
        {pestana === 'proyectos' ? <PanelProyectos avisar={setAviso} /> : <PanelPerfil avisar={setAviso} />}
      </main>
      <Aviso texto={aviso} />
    </div>
  )
}
