import { useState, useRef } from 'react'
import styles from '../styles/DogForm.module.css'

const emptyDog = {
  name: '',
  age: '',
  gender: 'Male',
  instagram: '',
  city: 'Guadalajara'
}

const emptyOwner = {
  name: '',
  email: ''
}

export default function DogForm({ initialValues = {}, onSubmit, submitLabel = 'Submit' }) {
  const [values, setValues] = useState({ ...emptyDog, ...initialValues })
  const [errors, setErrors] = useState({})

  // photo state: the raw File object (or null)
  const [photoFile, setPhotoFile] = useState(null)
  // preview URL generated from the File object, or the existing S3 URL passed in
  const [preview, setPreview] = useState(initialValues.imageURL || null)
  const fileRef = useRef(null)

  const [ownerValues, setOwnerValues] = useState(
    initialValues.owner ? { ...emptyOwner, ...initialValues.owner } : { ...emptyOwner }
  )
  const [ownerErrors, setOwnerErrors] = useState({})

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------
  function validate() {
    const e = {}
    if (!values.name.trim()) e.name = 'El nombre del golden es requerido'
    if (values.age === '' || isNaN(values.age) || parseInt(values.age) < 0) e.age = 'Se requiere una edad válida'
    return e
  }

  function validateOwner() {
    const e = {}
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

  function handleSubmit(e) {
    e.preventDefault()
    const dogErrs = validate()
    const ownerErrs = validateOwner()

    if (Object.keys(dogErrs).length > 0) { setErrors(dogErrs); return }
    if (Object.keys(ownerErrs).length > 0) { setOwnerErrors(ownerErrs); return }

    const hasOwnerData = ownerValues.name.trim() || ownerValues.email.trim()
    const ownerData = hasOwnerData
      ? { name: ownerValues.name.trim(), email: ownerValues.email.trim(), city: ownerValues.city }
      : null

    onSubmit({
      name: values.name.trim(),
      age: parseInt(values.age),
      gender: values.gender,
      instagram: values.instagram.trim() || null,
      city: values.city,
      photo: photoFile,
      owner: ownerData
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* Nombre del golden */}
      <div className={styles.field}>
        <label htmlFor="name">Nombre de mi golden</label>
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

      {/* Ciudad */}
      <div className={styles.field}>
        <label htmlFor="city">Ciudad</label>
        <select id="city" name="city" value={values.city} onChange={handleChange}>
          <option value="Guadalajara">Guadalajara</option>
          <option value="Zapopan">Zapopan</option>
        </select>
      </div>

      {/* Instagram */}
      <div className={styles.field}>
        <label htmlFor="instagram">Instagram (opcional)</label>
        <input id="instagram" name="instagram" value={values.instagram} onChange={handleChange} placeholder="ej. @buddy_golden" />
      </div>

      {/* Foto */}
      <div className={styles.field}>
        <label>Foto (opcional)</label>
        {preview ? (
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Vista previa del golden" className={styles.preview} />
            <button type="button" className={styles.removePhoto} onClick={removePhoto}>Eliminar</button>
          </div>
        ) : (
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className={styles.fileInput} />
        )}
      </div>

      {/* Sección del dueño */}
      <fieldset className={styles.ownerSection}>
        <legend className={styles.ownerLegend}>Datos del dueño (opcional)</legend>

        <div className={styles.field}>
          <label htmlFor="ownerName">Nombre</label>
          <input id="ownerName" name="name" value={ownerValues.name} onChange={handleOwnerChange} placeholder="ej. Juan García" />
        </div>

        <div className={styles.field}>
          <label htmlFor="ownerEmail">Correo electrónico</label>
          <input id="ownerEmail" name="email" type="email" value={ownerValues.email} onChange={handleOwnerChange} placeholder="ej. juan@ejemplo.com" />
          {ownerErrors.email && <span className={styles.error}>{ownerErrors.email}</span>}
        </div>
      </fieldset>

      <button type="submit" className={styles.submit}>{submitLabel}</button>
    </form>
  )
}
