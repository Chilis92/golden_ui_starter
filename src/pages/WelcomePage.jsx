import { useNavigate } from 'react-router-dom'
import styles from '../styles/WelcomePage.module.css'

const photos = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Golden_Retrievers_dark_and_light.jpg',
    alt: 'Two golden retrievers side by side in Los Angeles',
    credit: 'Photo by Akaporn Bhothisuwan, CC BY 2.0'
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Golden_Retriever_Puppies_Playing_on_the_South_Lawn_of_the_White_House_-_NARA_-_23869187.jpg',
    alt: 'Golden retriever puppies playing together outdoors',
    credit: 'NARA, Public Domain'
  }
]

export default function WelcomePage() {
  const navigate = useNavigate()
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.icon}>🐾</div>
        <h1>Welcome to Dog Registry</h1>
        <p>Keep track of all your furry friends in one place.</p>

        <div className={styles.photos}>
          {photos.map((photo, i) => (
            <figure key={i} className={styles.figure}>
              <img src={photo.src} alt={photo.alt} className={styles.photo} />
              <figcaption className={styles.caption}>{photo.credit}</figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.buttons}>
          <button className={styles.primary} onClick={() => navigate('/register')}>Register a Dog</button>
          <button className={styles.secondary} onClick={() => navigate('/dogs')}>View All Dogs</button>
        </div>
      </div>
    </main>
  )
}
