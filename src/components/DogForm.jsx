import { useState, useRef } from 'react'
import styles from '../styles/DogForm.module.css'

const emptyDog = {
  name: '',
  age: '',
  gender: 'Male'
}

const emptyOwner = {
  name: '',
  age: '',
  gender: 'Male',
  email: '',
  city: 'Guadalajara',
  phone: ''
}

export default function DogForm({ initialValues = {}, onSubmit, submitLabel = 'Submit' }) {
  const [values, setValues] = useState({ ...emptyDog, ...initialValues })
  const [errors, setErrors] = useState({})

  // photo state: the raw File object (or null)
  const [photoFile, setPhotoFile] = useState(null)
  // preview URL generated from the File object, or the existing S3 URL passed in
  const [preview, setPreview] = useState(initialValues.imageURL || null)
  const fileRef = useRef(null)

  // Owner toggle + fields
  const [showOwner, setShowOwner] = useState(!!initialValues.owner)
  const [ownerValues, setOwnerValues] = useState(
    initialValues.owner ? { ...emptyOwner, ...initialValues.owner } : { ...emptyOwner }
  )
  const [ownerErrors, setOwnerErrors] = useState({})

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------
  function validate() {
    const e = {}
    if (!values.name.trim()) e.name = 'El nombre del perro es requerido'
    if (values.age === '' || isNaN(values.age) || parseInt(values.age) < 0) e.age = 'Se requiere una edad válida'
    return e
  }

  function validateOwner() {
    if (!showOwner) return {}
    const e = {}
    if (!ownerValues.name.trim()) e.name = 'El nombre del dueño es requerido'
    if (ownerValues.age !== '' && (isNaN(ownerValues.age) || parseInt(ownerValues.age) < 0)) {
      e.age = 'Se requiere una edad válida'
    }
    if (ownerValues.email && !/\S+@\S+\.\S+/.test(ownerValues.email)) {
      e.email = 'Se requiere un correo electrónico válido'
    }
    return e
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  function handleChange(e) {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  function handleOwnerChange(e) {
    setOwnerValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setOwnerErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    // Revoke any previous object URL to avoid memory leaks
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
  }

  function removePhoto() {
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPhotoFile(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleOwnerToggle(e) {
    setShowOwner(e.target.checked)
    if (!e.target.checked) {
      setOwnerValues({ ...emptyOwner })
      setOwnerErrors({})
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const dogErrs = validate()
    const ownerErrs = validateOwner()

    if (Object.keys(dogErrs).length > 0) { setErrors(dogErrs); return }
    if (Object.keys(ownerErrs).length > 0) { setOwnerErrors(ownerErrs); return }

    const ownerData = showOwner
      ? {
          ...ownerValues,
          age: ownerValues.age !== '' ? parseInt(ownerValues.age) : undefined
        }
      : null

    onSubmit({
      name: values.name.trim(),
      age: parseInt(values.age),
      gender: values.gender,
      photo: photoFile,
      owner: ownerData
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* Nombre del perro */}
      <div className={styles.field}>
        <label htmlFor="name">Nombre del perro</label>
        <input id="name" name="name" value={values.name} onChange={handleChange} placeholder="ej. Buddy" />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      {/* Edad */}
      <div className={styles.field}>
        <label htmlFor="age">Edad (años)</label>
        <input id="age" name="age" type="number" min="0" step="1" value={values.age} onChange={handleChange} placeholder="ej. 3" />
        {errors.age && <span className={styles.error}>{errors.age}</span>}
      </div>

      {/* Género */}
      <div className={styles.field}>
        <label htmlFor="gender">Género</label>
        <select id="gender" name="gender" value={values.gender} onChange={handleChange}>
          <option value="Male">Macho</option>
          <option value="Female">Hembra</option>
        </select>
      </div>

      {/* Foto */}
      <div className={styles.field}>
        <label>Foto (opcional)</label>
        {preview ? (
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Vista previa del perro" className={styles.preview} />
            <button type="button" className={styles.removePhoto} onClick={removePhoto}>Eliminar</button>
          </div>
        ) : (
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className={styles.fileInput} />
        )}
      </div>

      {/* Activar sección de dueño */}
      <div className={styles.field}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showOwner}
            onChange={handleOwnerToggle}
            className={styles.checkbox}
          />
          Agregar datos del dueño
        </label>
      </div>

      {/* Sección del dueño */}
      {showOwner && (
        <fieldset className={styles.ownerSection}>
          <legend className={styles.ownerLegend}>Información del dueño</legend>

          <div className={styles.field}>
            <label htmlFor="ownerName">Nombre del dueño</label>
            <input id="ownerName" name="name" value={ownerValues.name} onChange={handleOwnerChange} placeholder="ej. Juan García" />
            {ownerErrors.name && <span className={styles.error}>{ownerErrors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="ownerAge">Edad del dueño</label>
            <input id="ownerAge" name="age" type="number" min="0" step="1" value={ownerValues.age} onChange={handleOwnerChange} placeholder="ej. 30" />
            {ownerErrors.age && <span className={styles.error}>{ownerErrors.age}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="ownerGender">Género del dueño</label>
            <select id="ownerGender" name="gender" value={ownerValues.gender} onChange={handleOwnerChange}>
              <option value="Male">Masculino</option>
              <option value="Female">Femenino</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="ownerEmail">Correo electrónico</label>
            <input id="ownerEmail" name="email" type="email" value={ownerValues.email} onChange={handleOwnerChange} placeholder="ej. juan@ejemplo.com" />
            {ownerErrors.email && <span className={styles.error}>{ownerErrors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="ownerCity">Ciudad del dueño</label>
            <select id="ownerCity" name="city" value={ownerValues.city} onChange={handleOwnerChange}>
              <option value="Guadalajara">Guadalajara</option>
              <option value="Zapopan">Zapopan</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="ownerPhone">Teléfono del dueño</label>
            <input id="ownerPhone" name="phone" value={ownerValues.phone} onChange={handleOwnerChange} placeholder="ej. 333-123-4567" />
          </div>
        </fieldset>
      )}

      <button type="submit" className={styles.submit}>{submitLabel}</button>
    </form>
  )
}
