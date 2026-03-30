import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useDogs } from '../context/DogContext'
import { getPhoto } from '../utils/photoStore'
import DogForm from '../components/DogForm'
import styles from '../styles/EditDogPage.module.css'

export default function EditDogPage() {
  const { id } = useParams()
  const { dogs, updateDog } = useDogs()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState(null)

  const dog = dogs.find(d => d.id === id)

  useEffect(() => {
    if (!dog) return
    if (dog.hasPhoto) {
      getPhoto(dog.id).then(photo => setInitialValues({ ...dog, photo }))
    } else {
      setInitialValues({ ...dog, photo: null })
    }
  }, [dog?.id])

  if (!dog) return <Navigate to="/dogs" replace />
  if (!initialValues) return null

  function handleSubmit(data) {
    updateDog(id, data)
    navigate('/dogs')
  }

  return (
    <main className={styles.page}>
      <h2>Edit {dog.name}</h2>
      <DogForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </main>
  )
}
