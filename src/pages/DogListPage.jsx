import { useNavigate } from 'react-router-dom'
import { useDogs } from '../context/DogContext'
import DogCard from '../components/DogCard'
import styles from '../styles/DogListPage.module.css'

export default function DogListPage() {
  const { dogs, loading, error, deleteDog, currentPage, totalPages, totalElements, goToPage } = useDogs()
  const navigate = useNavigate()

  if (loading) {
    return (
      <main className={styles.page}>
        <p>Cargando perros...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.error}>Error al cargar los perros: {error}</p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h2>Golden Registrados ({totalElements})</h2>
        <button className={styles.addBtn} onClick={() => navigate('/register')}>+ Registrar nuevo Golden</button>
      </div>

      {dogs.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no hay perros registrados.</p>
          <button onClick={() => navigate('/register')}>Registra tu primer perro</button>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {dogs.map(dog => (
              <DogCard key={dog.dogId} dog={dog} onDelete={deleteDog} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={currentPage === 0}
                onClick={() => goToPage(currentPage - 1)}
              >
                ← Anterior
              </button>
              <span className={styles.pageInfo}>Página {currentPage + 1} de {totalPages}</span>
              <button
                className={styles.pageBtn}
                disabled={currentPage >= totalPages - 1}
                onClick={() => goToPage(currentPage + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
