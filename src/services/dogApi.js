const GRAPHQL_URL = 'https://meeting-golden-498515528197.us-east1.run.app/graphql'

// Shared fragment so every dog query returns the same shape
const DOG_FIELDS = `
  dogId
  name
  apodo
  age
  gender
  imageURL
  instagram
  city
  owner {
    personId
    name
    email
  }
`

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

async function gqlRequest(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function fetchAllDogs(page = 0, size = 20) {
  const data = await gqlRequest(`
    query FindAllDogs($page: Int, $size: Int) {
      findAllDogs(page: $page, size: $size) {
        content {
          ${DOG_FIELDS}
        }
        totalElements
        totalPages
        currentPage
        hasNext
      }
    }
  `, { page, size })
  return data.findAllDogs
}

export async function fetchDogById(id) {
  const data = await gqlRequest(`
    query FindDogByID($id: ID) {
      findDogByID(id: $id) {
        ${DOG_FIELDS}
      }
    }
  `, { id })
  return data.findDogByID
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

const CREATE_DOG_FIELDS = `dogId name age gender imageURL instagram city token owner { personId name email }`

export async function createDog(dogFields, personInput, photoFile) {
  if (photoFile) {
    // Multipart upload following the GraphQL multipart request spec
    const operations = JSON.stringify({
      query: `
        mutation CreateDog($dogInput: [DogInput], $personInput: PersonInput) {
          createDog(dogInput: $dogInput, personInput: $personInput) {
            ${CREATE_DOG_FIELDS}
          }
        }
      `,
      variables: {
        dogInput: [{ ...dogFields, file: null }],
        personInput: personInput || null
      }
    })
    const map = JSON.stringify({ "0": ["variables.dogInput.0.file"] })

    const fd = new FormData()
    fd.append('operations', operations)
    fd.append('map', map)
    fd.append('0', photoFile)

    const res = await fetch(GRAPHQL_URL, { method: 'POST', body: fd })
    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0].message)
    return json.data.createDog
  }

  // No photo — plain JSON request
  const data = await gqlRequest(`
    mutation CreateDog($dogInput: [DogInput], $personInput: PersonInput) {
      createDog(dogInput: $dogInput, personInput: $personInput) {
        ${CREATE_DOG_FIELDS}
      }
    }
  `, {
    dogInput: [dogFields],
    personInput: personInput || null
  })
  return data.createDog
}

export async function updateDog(id, dogFields, token, photoFile) {
  if (photoFile) {
    const operations = JSON.stringify({
      query: `
        mutation UpdateDog($id: ID, $dogInput: DogInput, $token: String) {
          updateDog(id: $id, dogInput: $dogInput, token: $token) {
            ${DOG_FIELDS}
          }
        }
      `,
      variables: {
        id,
        token,
        dogInput: { ...dogFields, file: null }
      }
    })
    const map = JSON.stringify({ "0": ["variables.dogInput.file"] })

    const fd = new FormData()
    fd.append('operations', operations)
    fd.append('map', map)
    fd.append('0', photoFile)

    const res = await fetch(GRAPHQL_URL, { method: 'POST', body: fd })
    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0].message)
    return json.data.updateDog
  }

  const data = await gqlRequest(`
    mutation UpdateDog($id: ID, $dogInput: DogInput, $token: String) {
      updateDog(id: $id, dogInput: $dogInput, token: $token) {
        ${DOG_FIELDS}
      }
    }
  `, { id, token, dogInput: dogFields })
  return data.updateDog
}

export async function deleteDog(id, token) {
  const data = await gqlRequest(`
    mutation DeleteDog($id: ID, $token: String) {
      deleteDog(id: $id, token: $token)
    }
  `, { id, token })
  return data.deleteDog
}
