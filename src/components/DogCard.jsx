import { useNavigate } from 'react-router-dom'
import styles from '../styles/DogCard.module.css'

export default function DogCard({ dog, onDelete }) {
  const navigate = useNavigate()

  function handleDelete() {
    if (window.confirm(`¿Eliminar a ${dog.name}?`)) onDelete(dog.dogId)
  }

  return (
    <div className={styles.card}>
      {dog.imageURL
        ? <img src={dog.imageURL} alt={dog.name} className={styles.photo} />
        : <div className={styles.photoPlaceholder}>Sin foto</div>
      }
      <h3 className={styles.name}>{dog.name}</h3>
      <p><span className={styles.label}>Raza:</span> {dog.breed}</p>
      <p><span className={styles.label}>Edad:</span> {dog.age} {dog.age === 1 ? 'año' : 'años'}</p>
      <p><span className={styles.label}>Género:</span> {dog.gender}</p>
      {dog.owner && (
        <>
          <p><span className={styles.label}>Dueño:</span> {dog.owner.name}</p>
          <p><span className={styles.label}>Ciudad:</span> {dog.owner.city}</p>
        </>
      )}
      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => navigate(`/dogs/${dog.dogId}/edit`)}>Editar</button>
        <button className={styles.delete} onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  )
}
