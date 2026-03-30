import { createContext, useContext, useState, useEffect } from 'react'
import { savePhoto, deletePhoto } from '../utils/photoStore'

const DogContext = createContext(null)

export function DogProvider({ children }) {
  const [dogs, setDogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dogs')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    // Strip photo data before saving to localStorage — photos live in IndexedDB
    const slim = dogs.map(({ photo, ...rest }) => rest)
    localStorage.setItem('dogs', JSON.stringify(slim))
  }, [dogs])

  async function addDog(dog) {
    const id = crypto.randomUUID()
    const { photo, ...rest } = dog
    if (photo) await savePhoto(id, photo)
    setDogs(prev => [...prev, { ...rest, id, hasPhoto: !!photo, createdAt: new Date().toISOString() }])
  }

  async function updateDog(id, updates) {
    const { photo, ...rest } = updates
    if (photo !== undefined) {
      if (photo) await savePhoto(id, photo)
      else await deletePhoto(id)
    }
    setDogs(prev => prev.map(d =>
      d.id === id
        ? { ...d, ...rest, hasPhoto: photo !== undefined ? !!photo : d.hasPhoto }
        : d
    ))
  }

  async function deleteDog(id) {
    await deletePhoto(id)
    setDogs(prev => prev.filter(d => d.id !== id))
  }

  return (
    <DogContext.Provider value={{ dogs, addDog, updateDog, deleteDog }}>
      {children}
    </DogContext.Provider>
  )
}

export function useDogs() {
  return useContext(DogContext)
}
