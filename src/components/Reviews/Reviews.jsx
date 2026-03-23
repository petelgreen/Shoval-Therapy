import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { REVIEWS } from '../../data/content';
import styles from './Reviews.module.css';

function StarRating({ count }) {
  return (
    <div className={styles.stars} aria-label={`${count} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );
}

function ReviewCard({ item, lang }) {
  const name      = lang === 'en' ? item.nameEn      : item.nameHe;
  const treatment = lang === 'en' ? item.treatmentEn : item.treatmentHe;
  const text      = lang === 'en' ? item.textEn      : item.textHe;

  return (
    <div className={styles.card}>
      <div className={styles.quoteIcon}>"</div>
      <p className={styles.text}>{text}</p>
      <div className={styles.cardFooter}>
        <StarRating count={item.stars} />
        <div className={styles.reviewer}>
          <span className={styles.name}>{name}</span>
          <span className={styles.treatment}>{treatment}</span>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const { lang }   = useLanguage();
  const [paused, setPaused] = useState(false);
  const doubled = [...REVIEWS.items, ...REVIEWS.items];

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.inner}>
        <div className={styles.carouselWrap}>
          <div
            className={`${styles.track} ${paused ? styles.paused : ''}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {doubled.map((item, i) => (
              <ReviewCard key={`${item.id}-${i}`} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
