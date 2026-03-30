import { useNavigate } from 'react-router-dom'
import { useDogs } from '../context/DogContext'
import DogCard from '../components/DogCard'
import styles from '../styles/DogListPage.module.css'

export default function DogListPage() {
  const { dogs, deleteDog } = useDogs()
  const navigate = useNavigate()

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
            <DogCard key={dog.id} dog={dog} onDelete={deleteDog} />
          ))}
        </div>
      )}
    </main>
  )
}
