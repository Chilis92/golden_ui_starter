import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/DogCard.module.css'

export default function DogCard({ dog, onDelete }) {
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState(false)

  function handleDelete() {
    if (window.confirm(`¿Eliminar a ${dog.name}?`)) onDelete(dog.dogId)
  }

  return (
    <div className={styles.card}>
      {dog.imageURL
        ? <img src={dog.imageURL} alt={dog.name} className={styles.photo} onClick={() => setLightbox(true)} />
        : <div className={styles.photoPlaceholder}>Sin foto</div>
      }
      {lightbox && (
        <div className={styles.overlay} onClick={() => setLightbox(false)}>
          <button className={styles.closeBtn} onClick={() => setLightbox(false)}>✕</button>
          <img src={dog.imageURL} alt={dog.name} className={styles.lightboxImg} />
        </div>
      )}
      <h3 className={styles.name}>{dog.name}</h3>
<p><span className={styles.label}>Edad:</span> {dog.age} {dog.age === 1 ? 'año' : 'años'}</p>
      <p><span className={styles.label}>Género:</span> {dog.gender === 'Female' ? 'Hembra' : 'Macho'}</p>
      {dog.city && <p><span className={styles.label}>Ciudad:</span> {dog.city}</p>}
      {dog.instagram && <p><span className={styles.label}>Instagram:</span> {dog.instagram}</p>}
      {dog.owner && (
        <p><span className={styles.label}>Dueño:</span> {dog.owner.name}</p>
      )}
      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => navigate(`/dogs/${dog.dogId}/edit`)}>Editar</button>
        <button className={styles.delete} onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  )
}
