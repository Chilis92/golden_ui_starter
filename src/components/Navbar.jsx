import { NavLink } from 'react-router-dom'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>Dog Registry</NavLink>
      <div className={styles.links}>
        <NavLink to="/dogs" className={({ isActive }) => isActive ? styles.active : ''}>All Dogs</NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? styles.active : ''}>Register</NavLink>
      </div>
    </nav>
  )
}
