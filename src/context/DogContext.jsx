import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchAllDogs,
  fetchDogById,
  createDog as apiCreateDog,
  updateDog as apiUpdateDog,
  deleteDog as apiDeleteDog
} from '../services/dogApi'

const DogContext = createContext(null)

const PAGE_SIZE = 20

export function DogProvider({ children }) {
  const [dogs, setDogs] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadPage = useCallback(async (page) => {
    setLoading(true)
    try {
      const data = await fetchAllDogs(page, PAGE_SIZE)
      setDogs(data.content)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPage(0)
  }, [loadPage])

  const refresh = useCallback(() => loadPage(currentPage), [loadPage, currentPage])
  const goToPage = useCallback((page) => loadPage(page), [loadPage])

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
    // Go to page 0 after adding so the new dog is visible (sorted by id desc)
    await loadPage(0)
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
    <DogContext.Provider value={{
      dogs, loading, error,
      currentPage, totalPages, totalElements,
      goToPage,
      addDog, updateDog, deleteDog, getToken
    }}>
      {children}
    </DogContext.Provider>
  )
}

export function useDogs() {
  return useContext(DogContext)
}
