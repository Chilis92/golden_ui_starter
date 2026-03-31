import { useNavigate } from 'react-router-dom'
import { useDogs } from '../context/DogContext'
import DogCard from '../components/DogCard'
import styles from '../styles/DogListPage.module.css'

export default function DogListPage() {
  const { dogs, loading, error, deleteDog } = useDogs()
  const navigate = useNavigate()

  if (loading) {
    return (
      <main className={styles.page}>
        <p>Loading dogs...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.error}>Failed to load dogs: {error}</p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h2>Registered Dogs ({dogs.length})</h2>
        <button className={styles.addBtn} onClick={() => navigate('/register')}>+ Register New Dog</button>
      </div>

      {dogs.length === 0 ? (
        <div className={styles.empty}>
          <p>No dogs registered yet.</p>
          <button onClick={() => navigate('/register')}>Register your first dog</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {dogs.map(dog => (
            <DogCard key={dog.dogId} dog={dog} onDelete={deleteDog} />
          ))}
        </div>
      )}
    </main>
  )
}
