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

  function getTokens() {
    return JSON.parse(localStorage.getItem('golden_tokens') || '{}')
  }

  function saveToken(dogId, token) {
    const tokens = getTokens()
    tokens[dogId] = token
    localStorage.setItem('golden_tokens', JSON.stringify(tokens))
  }

  function getToken(dogId) {
    return getTokens()[dogId] || null
  }

  async function addDog(dogData) {
    const { photo, owner, ...rest } = dogData
    const personInput = owner ? Object.fromEntries(
      Object.entries(owner).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    ) : null

    const created = await apiCreateDog(rest, personInput, photo || null)
    if (created) {
      created.forEach(dog => saveToken(dog.dogId, dog.token))
    }
    await refresh()
  }

  async function updateDog(id, dogData) {
    const { photo, owner, ...rest } = dogData
    const token = getToken(id)
    await apiUpdateDog(id, rest, token, photo || null)
    await refresh()
  }

  async function deleteDog(id) {
    const token = getToken(id)
    await apiDeleteDog(id, token)
    await refresh()
  }

  return (
    <DogContext.Provider value={{ dogs, loading, error, addDog, updateDog, deleteDog, getToken }}>
      {children}
    </DogContext.Provider>
  )
}

export function useDogs() {
  return useContext(DogContext)
}
