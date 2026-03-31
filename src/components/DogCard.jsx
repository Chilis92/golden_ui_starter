import { useNavigate } from 'react-router-dom'
import styles from '../styles/DogCard.module.css'

export default function DogCard({ dog, onDelete }) {
  const navigate = useNavigate()

  function handleDelete() {
    if (window.confirm(`Delete ${dog.name}?`)) onDelete(dog.dogId)
  }

  return (
    <div className={styles.card}>
      {dog.imageURL
        ? <img src={dog.imageURL} alt={dog.name} className={styles.photo} />
        : <div className={styles.photoPlaceholder}>No Photo</div>
      }
      <h3 className={styles.name}>{dog.name}</h3>
      <p><span className={styles.label}>Breed:</span> {dog.breed}</p>
      <p><span className={styles.label}>Color:</span> {dog.color}</p>
      <p><span className={styles.label}>Age:</span> {dog.age} {dog.age === 1 ? 'year' : 'years'}</p>
      <p><span className={styles.label}>Gender:</span> {dog.gender}</p>
      {dog.owner && (
        <>
          <p><span className={styles.label}>Owner:</span> {dog.owner.name}</p>
          <p><span className={styles.label}>City:</span> {dog.owner.city}</p>
        </>
      )}
      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => navigate(`/dogs/${dog.dogId}/edit`)}>Edit</button>
        <button className={styles.delete} onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}
