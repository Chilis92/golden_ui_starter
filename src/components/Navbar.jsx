import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand} onClick={() => setOpen(false)}>Registro de Perros</NavLink>

      <button className={styles.hamburger} onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        <span className={open ? styles.barTop : styles.bar} />
        <span className={open ? styles.barHide : styles.bar} />
        <span className={open ? styles.barBottom : styles.bar} />
      </button>

      <div className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
        <NavLink to="/dogs" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Todos los perros</NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>Registrar</NavLink>
      </div>
    </nav>
  )
}
