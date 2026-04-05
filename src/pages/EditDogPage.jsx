import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDogs } from '../context/DogContext'
import { fetchDogById } from '../services/dogApi'
import DogForm from '../components/DogForm'
import styles from '../styles/EditDogPage.module.css'

export default function EditDogPage() {
  const { id } = useParams()
  const { updateDog } = useDogs()
  const navigate = useNavigate()
  const [dog, setDog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDogById(id)
      .then(setDog)
      .catch(() => navigate('/dogs', { replace: true }))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return null
  if (!dog) return null

  const initialValues = {
    name: dog.name || '',
    apodo: dog.apodo || '',
    age: dog.age ?? '',
    gender: dog.gender || 'Male',
    instagram: dog.instagram || '',
    city: dog.city || '',
    imageURL: dog.imageURL || null,
    owner: dog.owner ? { name: dog.owner.name || '', email: dog.owner.email || '' } : null
  }

  async function handleSubmit(data) {
    await updateDog(dog.dogId, data)
    navigate('/dogs')
  }

  return (
    <main className={styles.page}>
      <h2>Editar a {dog.name}</h2>
      <DogForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
    </main>
  )
}
