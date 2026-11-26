import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useIdioma } from '../lib/i18n'
import { useAparecer, useInclinar } from '../lib/efectos'
import { obtenerPerfil, obtenerProyectos } from '../lib/api'
import Encabezado from '../components/Encabezado'
import Tarjeta from '../components/Tarjeta'
import Icono from '../components/Icono'

const CATEGORIAS = ['Todos', 'Web', 'Móvil', 'Juegos', 'Otros']

function Escena() {
  return (
    <div className="escena" aria-hidden="true">
      <div className="pieza pieza-web flota-1">
        <div className="puntos"><i /><i /><i /></div>
        <div className="pieza-web-cuerpo">
          <b className="barra negra" /><b className="barra gris" />
          <div className="bloques"><b className="azul" /><b /><b /></div>
        </div>
      </div>
      <div className="pieza pieza-cel flota-2">
        <b className="muesca" /><b className="cel-azul" /><b /><b /><b />
      </div>
      <div className="pieza pieza-chip flota-3">
        <b className="chip-icono" />
        <div><b className="barra negra" /><b className="barra gris corta" /></div>
      </div>
    </div>
  )
}

export default function Inicio() {
  const { t, tr } = useIdioma()
  const [perfil, setPerfil] = useState(null)
  const [proyectos, setProyectos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const { hash } = useLocation()
  const heroRef = useInclinar(18)
  const rProy = useAparecer(), rSobre = useAparecer(), rHab = useAparecer(), rCont = useAparecer()

  useEffect(() => {
    obtenerPerfil().then(setPerfil).catch(console.error)
    obtenerProyectos().then(setProyectos).catch(console.error)
  }, [])

  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [hash])

  const cats = useMemo(() => CATEGORIAS.filter((c) => c === 'Todos' || proyectos.some((p) => p.categoria === c)), [proyectos])
  const mostrados = proyectos.filter((p) => filtro === 'Todos' || p.categoria === filtro)
  const pf = perfil || {}
  const redes = [
    ['GitHub', pf.github], ['LinkedIn', pf.linkedin],
    ['WhatsApp', pf.whatsapp && `https://wa.me/${pf.whatsapp.replace(/\D/g, '')}`],
  ].filter(([, url]) => url)

  return (
    <div className="pagina">
      <Encabezado />

      <section id="inicio" className="contenedor hero" ref={heroRef}>
        <div className="hero-texto">
          <p className="pastilla entra"><span className="punto-verde" />{t('disponible')}</p>
          <h1 className="entra d1">{tr(pf.titulo)}</h1>
          <p className="hero-bajada entra d2">{tr(pf.bajada)}</p>
          <div className="botones entra d3">
            <a className="btn btn-azul" href="#proyectos">{t('ver_proyectos')} <Icono n="flecha" /></a>
            <a className="btn btn-blanco" href="#contacto">{t('contactarme')}</a>
          </div>
        </div>
        <div className="hero-visual"><Escena /></div>
      </section>

      <section id="proyectos" className="banda">
        <div className="contenedor aparece" ref={rProy}>
          <div className="cabecera-seccion">
            <div>
              <h2>{t('nav_proyectos')}</h2>
              <p className="sub">{t('proyectos_sub')}</p>
            </div>
            <div className="filtros">
              {cats.map((c) => (
                <button key={c} type="button" aria-pressed={filtro === c} onClick={() => setFiltro(c)}>
                  {c === 'Todos' ? t('todos') : t(`cat_${c}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="grilla-proyectos" key={filtro}>
            {mostrados.map((p, i) => <Tarjeta key={p.id} p={p} i={i} />)}
          </div>
          {mostrados.length === 0 && <p className="vacio">{t('sin_proyectos')}</p>}
        </div>
      </section>

      <section id="sobre-mi" className="contenedor sobre aparece" ref={rSobre}>
        <div className="foto">
          {pf.fotoUrl ? <img src={pf.fotoUrl} alt="Hamil" /> : <span>{t('tu_foto')}</span>}
        </div>
        <div className="sobre-texto">
          <h2>{t('nav_sobre')}</h2>
          {tr(pf.sobre).split(/\n+/).filter(Boolean).map((par, i) => <p key={i}>{par}</p>)}
          {pf.cvUrl && (
            <a className="btn btn-negro" href={pf.cvUrl} target="_blank" rel="noopener">
              <Icono n="bajar" /> {t('descargar_cv')}
            </a>
          )}
        </div>
      </section>

      <section id="habilidades" className="banda">
        <div className="contenedor aparece" ref={rHab}>
          <h2>{t('nav_habilidades')}</h2>
          <div className="grilla-habilidades">
            {(pf.habilidades || []).map((h, i) => (
              <div className="caja-habilidad aparece-item" style={{ '--d': `${i * 90}ms` }} key={i}>
                <p className="area">{tr(h.area)}</p>
                <div className="items">{h.items.map((it) => <span key={it}>{it}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="contenedor contacto aparece" ref={rCont}>
        <div className="cta">
          <div className="cta-texto">
            <h2>{t('cta_titulo')}</h2>
            <p>{t('cta_sub')}</p>
          </div>
          <div className="cta-acciones">
            {pf.email && <a className="btn btn-azul grande" href={`mailto:${pf.email}`}><Icono n="mail" size={20} /> {pf.email}</a>}
            {redes.length > 0 && (
              <div className="redes">
                {redes.map(([n, url]) => <a key={n} className="btn btn-oscuro" href={url} target="_blank" rel="noopener">{n}</a>)}
              </div>
            )}
          </div>
        </div>
        <footer className="pie">
          <span>© {new Date().getFullYear()} Hamil · San Rafael, Mendoza</span>
          <Link to="/admin">{t('acceso_admin')}</Link>
        </footer>
      </section>
    </div>
  )
}
