import { useNavigate } from 'react-router-dom'
import styles from '../styles/WelcomePage.module.css'

export default function WelcomePage() {
  const navigate = useNavigate()
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.icon}>🐾</div>
        <h1>Bienvenidos a la comunidad de Golden Retrievers de GDL y Zapopan</h1>

        <div className={styles.buttons}>
          <button className={styles.primary} onClick={() => navigate('/register')}>Registrar nuevo Golden</button>
          <button className={styles.secondary} onClick={() => navigate('/dogs')}>Ver todos los golden</button>
        </div>
      </div>
    </main>
  )
}
