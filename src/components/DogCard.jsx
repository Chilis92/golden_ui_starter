import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPhoto } from '../utils/photoStore'
import styles from '../styles/DogCard.module.css'

export default function DogCard({ dog, onDelete }) {
  const navigate = useNavigate()
  const [photoUrl, setPhotoUrl] = useState(null)

  useEffect(() => {
    if (dog.hasPhoto) {
      getPhoto(dog.id).then(setPhotoUrl)
    } else {
      setPhotoUrl(null)
    }
  }, [dog.id, dog.hasPhoto])

  function handleDelete() {
    if (window.confirm(`Delete ${dog.name}?`)) onDelete(dog.id)
  }

  return (
    <div className={styles.card}>
      {photoUrl
        ? <img src={photoUrl} alt={dog.name} className={styles.photo} />
        : <div className={styles.photoPlaceholder}>No Photo</div>
      }
      <h3 className={styles.name}>{dog.name}</h3>
      <p><span className={styles.label}>Breed:</span> {dog.breed}</p>
      <p><span className={styles.label}>Age:</span> {dog.age} {dog.age === 1 ? 'year' : 'years'}</p>
      <p><span className={styles.label}>Owner:</span> {dog.ownerName}</p>
      <p><span className={styles.label}>Location:</span> {dog.location}</p>
      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => navigate(`/dogs/${dog.id}/edit`)}>Edit</button>
        <button className={styles.delete} onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}
