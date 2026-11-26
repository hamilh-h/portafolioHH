import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../lib/i18n'
import { useInclinar } from '../lib/efectos'
import { obtenerProyecto, obtenerProyectos } from '../lib/api'
import Encabezado from '../components/Encabezado'
import Icono from '../components/Icono'

export default function Proyecto() {
  const { slug } = useParams()
  const { t, tr } = useIdioma()
  const [p, setP] = useState(undefined)
  const [siguiente, setSiguiente] = useState(null)
  const [sel, setSel] = useState(0)
  const marco = useInclinar(7)

  useEffect(() => {
    setP(undefined); setSel(0); window.scrollTo(0, 0)
    obtenerProyecto(slug).then(setP).catch(() => setP(null))
    obtenerProyectos().then((lista) => {
      const i = lista.findIndex((x) => x.slug === slug)
      setSiguiente(lista.length > 1 ? lista[(i + 1) % lista.length] : null)
    }).catch(() => {})
  }, [slug])

  useEffect(() => { if (p) document.title = `${tr(p.nombre)} · Hamil` }, [p, tr])

  if (p === undefined) return <div className="pagina"><Encabezado /><p className="contenedor estado">{t('cargando')}</p></div>
  if (p === null) return (
    <div className="pagina"><Encabezado />
      <div className="contenedor estado"><p>{t('no_encontrado')}</p><Link className="btn btn-blanco" to="/">{t('volver')}</Link></div>
    </div>
  )

  const imgs = p.imagenes || []
  const actual = imgs[sel]
  const links = [
    ['sitio_vivo', p.links?.vivo], ['repositorio', p.links?.github], ['otro_link', p.links?.otro],
  ].filter(([, u]) => u)

  return (
    <div className="pagina">
      <Encabezado />
      <div className="contenedor">
        <Link to="/#proyectos" className="volver"><Icono n="atras" /> {t('volver')}</Link>
      </div>

      <section className="contenedor proy-cabecera">
        <div>
          <div className="etiquetas entra">
            <span className="etq-azul">{t(`cat_${p.categoria}`)}</span>
            {(p.tags || []).map((x) => <span key={x}>{x}</span>)}
            {p.anio && <span>{p.anio}</span>}
          </div>
          <h1 className="entra d1">{tr(p.nombre)}</h1>
          <p className="hero-bajada entra d2">{tr(p.desc)}</p>
        </div>
        <div className="botones entra d3">
          {p.links?.vivo && <a className="btn btn-azul" href={p.links.vivo} target="_blank" rel="noopener">{t('ver_vivo')} <Icono n="externo" /></a>}
          {p.links?.github && <a className="btn btn-blanco" href={p.links.github} target="_blank" rel="noopener">{t('codigo')}</a>}
        </div>
      </section>

      <section className="contenedor galeria">
        <div className="marco-3d" ref={marco}>
          <div className="marco">
            <div className="puntos barra-ventana"><i /><i /><i /></div>
            <div className="marco-img" style={{ background: p.color || '#E9EDF5' }}>
              {actual
                ? <img key={actual.url} src={actual.url} alt={`${tr(p.nombre)} ${sel + 1}`} className="foto-cambia" />
                : <div className="tarjeta-vacia"><Icono n="imagen" size={22} /> {tr(p.nombre)}</div>}
            </div>
          </div>
        </div>
        {imgs.length > 1 && (
          <div className="miniaturas">
            {imgs.map((im, i) => (
              <button key={im.url} type="button" aria-label={`Imagen ${i + 1}`} aria-pressed={i === sel} onClick={() => setSel(i)}>
                <img src={im.url} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="contenedor proy-detalle">
        <div className="proy-texto">
          {tr(p.cuerpo) && <>
            <h2>{t('sobre_proyecto')}</h2>
            {tr(p.cuerpo).split(/\n+/).filter(Boolean).map((par, i) => <p key={i}>{par}</p>)}
          </>}
          {p.video?.url && <>
            <h2>{t('video')}</h2>
            <video className="video" src={p.video.url} controls preload="metadata" playsInline />
          </>}
        </div>
        <aside className="proy-lado">
          <div className="caja">
            <p className="rotulo">{t('categoria')}</p><p className="dato">{t(`cat_${p.categoria}`)}</p>
            {p.anio && <><p className="rotulo">{t('anio')}</p><p className="dato">{p.anio}</p></>}
          </div>
          {links.length > 0 && (
            <div className="caja">
              <p className="rotulo">{t('links')}</p>
              {links.map(([k, u]) => <a key={k} className="link-fila" href={u} target="_blank" rel="noopener">{t(k)} <Icono n="externo" /></a>)}
            </div>
          )}
        </aside>
      </section>

      {siguiente && (
        <section className="banda">
          <Link to={`/proyecto/${siguiente.slug}`} className="contenedor siguiente">
            <span><span className="rotulo">{t('siguiente')}</span><span className="sig-nombre">{tr(siguiente.nombre)}</span></span>
            <Icono n="flecha" size={40} />
          </Link>
        </section>
      )}
    </div>
  )
}
