import styles from './AnimatedShinyText.module.css';

export default function AnimatedShinyText({ className = '', lang = 'he' }) {
  return (
    <span className={`${styles.wrapper} ${className}`}>
      <span className={styles.shiny}>
        {lang === 'en' ? 'Discount for Students & Soldiers' : 'הנחה לסטודנטיות וחיילות'}
      </span>
      {' '}✨ 💞
    </span>
  );
}
