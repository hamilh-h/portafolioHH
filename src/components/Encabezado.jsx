import { Link, useLocation } from 'react-router-dom'
import { useIdioma } from '../lib/i18n'

export function SelectorIdioma() {
  const { lang, setLang } = useIdioma()
  return (
    <div className="idioma" role="group" aria-label="Idioma / Language">
      <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
    </div>
  )
}

export const Logo = () => <span className="logo">hamil<span>.</span></span>

export default function Encabezado() {
  const { t } = useIdioma()
  const enInicio = useLocation().pathname === '/'
  const ir = (id) => (enInicio ? `#${id}` : `/#${id}`)
  return (
    <header className="encabezado">
      <div className="contenedor fila-encabezado">
        <Link to="/" aria-label="Inicio"><Logo /></Link>
        <nav className="nav">
          <a href={ir('proyectos')}>{t('nav_proyectos')}</a>
          <a href={ir('sobre-mi')}>{t('nav_sobre')}</a>
          <a href={ir('habilidades')}>{t('nav_habilidades')}</a>
          <a href={ir('contacto')}>{t('nav_contacto')}</a>
          <SelectorIdioma />
        </nav>
      </div>
    </header>
  )
}
