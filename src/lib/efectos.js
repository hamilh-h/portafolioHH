import { useEffect, useRef } from 'react'

const quieto = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Aparece suave cuando entra en pantalla
export function useAparecer() {
  const r = useRef(null)
  useEffect(() => {
    const el = r.current
    if (!el) return
    if (quieto() || !('IntersectionObserver' in window)) { el.classList.add('visto'); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visto'); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return r
}

// Inclinación 3D siguiendo el mouse
export function useInclinar(max = 10) {
  const r = useRef(null)
  useEffect(() => {
    const el = r.current
    if (!el || quieto()) return
    let raf = 0
    const mover = (e) => {
      const b = el.getBoundingClientRect()
      const x = (e.clientX - b.left) / b.width - 0.5
      const y = (e.clientY - b.top) / b.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`)
        el.style.setProperty('--rx', `${(-y * max * 0.7).toFixed(2)}deg`)
        el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
      })
    }
    const salir = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerleave', salir)
    return () => { el.removeEventListener('pointermove', mover); el.removeEventListener('pointerleave', salir); cancelAnimationFrame(raf) }
  }, [max])
  return r
}
