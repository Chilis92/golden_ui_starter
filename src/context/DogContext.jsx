import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchAllDogs,
  createDog as apiCreateDog,
  updateDog as apiUpdateDog,
  deleteDog as apiDeleteDog
} from '../services/dogApi'

const DogContext = createContext(null)

export function DogProvider({ children }) {
  const [dogs, setDogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load all dogs from the backend on mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAllDogs()
      .then(data => { if (!cancelled) { setDogs(data); setError(null) } })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAllDogs()
      setDogs(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // dogData shape: { name, breed, color, age, gender, photo: File|null,
  //                  owner: { name, age, gender, email, city, phone } | null }
  async function addDog(dogData) {
    const { photo, owner, ...rest } = dogData
    // Strip null/undefined owner fields to keep the payload clean
    const personInput = owner ? Object.fromEntries(
      Object.entries(owner).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    ) : null

    await apiCreateDog(rest, personInput, photo || null)
    await refresh()
  }

  async function updateDog(id, dogData) {
    const { photo, owner, ...rest } = dogData
    // photo is null when the user didn't upload a new image — omit the file arg
    await apiUpdateDog(id, rest, photo || null)
    await refresh()
  }

  async function deleteDog(id) {
    await apiDeleteDog(id)
    await refresh()
  }

  return (
    <DogContext.Provider value={{ dogs, loading, error, addDog, updateDog, deleteDog }}>
      {children}
    </DogContext.Provider>
  )
}

export function useDogs() {
  return useContext(DogContext)
}
