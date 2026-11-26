import { Link } from 'react-router-dom'
import { useIdioma } from '../lib/i18n'
import { useInclinar } from '../lib/efectos'
import Icono from './Icono'

export default function Tarjeta({ p, i }) {
  const { tr } = useIdioma()
  const r = useInclinar(8)
  const portada = p.imagenes?.[0]?.url
  return (
    <Link to={`/proyecto/${p.slug}`} className="tarjeta aparece-item" style={{ '--d': `${i * 70}ms` }} ref={r}>
      <div className="tarjeta-foto" style={{ background: p.color || '#E9EDF5' }}>
        {portada
          ? <img src={portada} alt="" loading="lazy" />
          : <div className="tarjeta-vacia"><Icono n="imagen" /> {tr(p.nombre)}</div>}
      </div>
      <div className="tarjeta-cuerpo">
        <div className="tarjeta-titulo">
          <h3>{tr(p.nombre)}</h3>
          <Icono n="externo" size={22} className="tarjeta-flecha" />
        </div>
        <p>{tr(p.desc)}</p>
        <div className="etiquetas">{(p.tags || []).map((t) => <span key={t}>{t}</span>)}</div>
      </div>
      <span className="brillo" aria-hidden="true" />
    </Link>
  )
}
