import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useDogs } from '../context/DogContext'
import DogForm from '../components/DogForm'
import styles from '../styles/EditDogPage.module.css'

export default function EditDogPage() {
  const { id } = useParams()
  const { dogs, updateDog, loading } = useDogs()
  const navigate = useNavigate()

  // Match against the backend integer ID (dogId), but the URL param is a string
  const dog = dogs.find(d => String(d.dogId) === String(id))

  // While the context is still fetching, don't redirect prematurely
  if (loading) return null

  if (!dog) return <Navigate to="/dogs" replace />

  // Map the backend dog shape to the form's initialValues shape.
  // photo starts as null — user must upload a new file to replace the image.
  const initialValues = {
    name: dog.name || '',
    breed: dog.breed || '',
    color: dog.color || '',
    age: dog.age ?? '',
    gender: dog.gender || 'Male',
    imageURL: dog.imageURL || null,   // used only for the preview
    owner: dog.owner
      ? {
          name: dog.owner.name || '',
          age: dog.owner.age ?? '',
          gender: dog.owner.gender || 'Male',
          email: dog.owner.email || '',
          city: dog.owner.city || 'Guadalajara',
          phone: dog.owner.phone || ''
        }
      : null
  }

  function handleSubmit(data) {
    updateDog(dog.dogId, data)
    navigate('/dogs')
  }

  return (
    <main className={styles.page}>
      <h2>Edit {dog.name}</h2>
      <DogForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </main>
  )
}
