import { SERVICES, BOOKING_MODAL } from '../../../data/content';
import styles from './ServiceStep.module.css';

export default function ServiceStep({ lang, selected, onSelect, onNext }) {
  const t = BOOKING_MODAL;

  return (
    <div className={styles.root}>
      <h2 className="bm-step-title">
        {lang === 'en' ? t.steps[0].labelEn : t.steps[0].labelHe}
      </h2>

      <div className={styles.grid}>
        {SERVICES.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <button
              key={service.id}
              className={[styles.card, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
              onClick={() => onSelect(service)}
              type="button"
            >
              {service.highlight && (
                <span className={styles.badge}>{lang === 'en' ? 'Featured' : 'מומלץ'}</span>
              )}
              <span className={styles.name}>
                {lang === 'en' ? service.nameEn : service.nameHe}
              </span>
              <span className={styles.description}>
                {lang === 'en' ? service.descriptionEn : service.descriptionHe}
              </span>
              <div className={styles.meta}>
                <span className={styles.duration}>
                  {lang === 'en' ? service.durationEn : service.durationHe}
                </span>
                <span className={styles.price}>{service.price}</span>
              </div>
              {isSelected && (
                <span className={styles.checkmark} aria-hidden="true">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bm-nav">
        <button
          className="bm-btn-primary"
          onClick={onNext}
          disabled={!selected}
          type="button"
        >
          {lang === 'en' ? `${t.nextEn} →` : `${t.nextHe} ←`}
        </button>
      </div>
    </div>
  );
}
