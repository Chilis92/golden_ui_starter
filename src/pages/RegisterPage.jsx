import { useNavigate } from 'react-router-dom'
import { useDogs } from '../context/DogContext'
import DogForm from '../components/DogForm'
import styles from '../styles/RegisterPage.module.css'

export default function RegisterPage() {
  const { addDog } = useDogs()
  const navigate = useNavigate()

  function handleSubmit(data) {
    addDog(data)
    navigate('/dogs')
  }

  return (
    <main className={styles.page}>
      <h2>Registrar mi Golden</h2>
      <DogForm onSubmit={handleSubmit} submitLabel="Registrar mi golden" />
    </main>
  )
}
