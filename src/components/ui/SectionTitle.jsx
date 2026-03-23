import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLanguage } from '../../context/LanguageContext';
import styles from './SectionTitle.module.css';

export default function SectionTitle({ titleHe, titleEn, subtitle, subtitleHe, subtitleEn, centered = true }) {
  const { ref, isVisible } = useScrollReveal();
  const { lang } = useLanguage();

  const mainTitle = lang === 'en' ? titleEn : titleHe;
  const subTitle = lang === 'en'
    ? (subtitleEn ?? subtitle)
    : (subtitleHe ?? subtitle);

  return (
    <div ref={ref} className={`${styles.wrapper} ${!centered ? styles.left : ''}`}>
      <span className={`${styles.line} ${isVisible ? styles.visible : ''}`} />
      <h2 className={styles.titleHe}>{mainTitle}</h2>
      {subTitle && <p className={styles.subtitle}>{subTitle}</p>}
    </div>
  );
}
