const trazos = {
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  atras: <path d="M19 12H5m6-6-6 6 6 6" />,
  externo: <path d="M7 17 17 7M8 7h9v9" />,
  bajar: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  subir: <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  imagen: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 17-5-5-8 8" /></>,
  grilla: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  persona: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  ojo: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  salir: <path d="M15 17l5-5-5-5M20 12H9M12 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7" />,
  mas: <path d="M12 5v14M5 12h14" />,
  lapiz: <path d="M4 20h4L19 9l-4-4L4 16z" />,
  tacho: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  arriba: <path d="m6 15 6-6 6 6" />,
  abajo: <path d="m6 9 6 6 6-6" />,
  cruz: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
}

export default function Icono({ n, size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {trazos[n]}
    </svg>
  )
}
