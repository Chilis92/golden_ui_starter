import { useState, useRef } from 'react'
import styles from '../styles/DogForm.module.css'

const empty = { name: '', breed: 'Golden Retriever', age: '', ownerName: '', location: 'Guadalajara', photo: null }

export default function DogForm({ initialValues = empty, onSubmit, submitLabel = 'Submit' }) {
  const [values, setValues] = useState({ ...empty, ...initialValues })
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(initialValues.photo || null)
  const fileRef = useRef(null)

  function validate() {
    const e = {}
    if (!values.name.trim()) e.name = 'Dog name is required'
    if (!values.breed.trim()) e.breed = 'Breed is required'
    if (values.age === '' || isNaN(values.age) || parseInt(values.age) < 0) e.age = 'Valid age is required'
    if (!values.ownerName.trim()) e.ownerName = 'Owner name is required'
    return e
  }

  function handleChange(e) {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setPreview(dataUrl)
      setValues(prev => ({ ...prev, photo: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    setPreview(null)
    setValues(prev => ({ ...prev, photo: null }))
    fileRef.current.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    onSubmit({ ...values, age: parseInt(values.age) })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name">Dog Name</label>
        <input id="name" name="name" value={values.name} onChange={handleChange} placeholder="e.g. Buddy" />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="breed">Breed</label>
        <input id="breed" name="breed" value={values.breed} onChange={handleChange} placeholder="e.g. Golden Retriever" />
        {errors.breed && <span className={styles.error}>{errors.breed}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="age">Age (years)</label>
        <input id="age" name="age" type="number" min="0" step="1" value={values.age} onChange={handleChange} placeholder="e.g. 3" />
        {errors.age && <span className={styles.error}>{errors.age}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="ownerName">Owner Name</label>
        <input id="ownerName" name="ownerName" value={values.ownerName} onChange={handleChange} placeholder="e.g. Jane Smith" />
        {errors.ownerName && <span className={styles.error}>{errors.ownerName}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="location">Location</label>
        <select id="location" name="location" value={values.location} onChange={handleChange}>
          <option value="Guadalajara">Guadalajara</option>
          <option value="Zapopan">Zapopan</option>
        </select>
      </div>

      <div className={styles.field}>
        <label>Photo (optional)</label>
        {preview ? (
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Dog preview" className={styles.preview} />
            <button type="button" className={styles.removePhoto} onClick={removePhoto}>Remove</button>
          </div>
        ) : (
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className={styles.fileInput} />
        )}
      </div>

      <button type="submit" className={styles.submit}>{submitLabel}</button>
    </form>
  )
}
