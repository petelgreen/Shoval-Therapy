import { useLanguage } from '../../context/LanguageContext';
import ScrollReveal from '../ui/ScrollReveal';
import { BRAND, BOOKING } from '../../data/content';
import styles from './Booking.module.css';

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.21 2 2 0 012.22 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.47 7.64a16 16 0 006.29 6.29l1-1a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Booking() {
  const { lang } = useLanguage();

  return (
    <section id="booking" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <p className={styles.contactIntro}>
            {lang === 'en' ? BOOKING.subtitleEn : BOOKING.subtitleHe}
          </p>

          <div className={styles.divider} />

          {/* Contact cards */}
          <div className={styles.cards}>
            <ScrollReveal delay={0}>
              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.card}>
                <div className={`${styles.iconCircle} ${styles.whatsapp}`}>
                  <WhatsAppIcon className={styles.cardIcon} />
                </div>
                <span className={styles.cardLabel}>{lang === 'en' ? 'WhatsApp' : 'וואטסאפ'}</span>
                <span className={styles.cardValue}>{BRAND.phone}</span>
              </a>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className={styles.card}>
                <div className={`${styles.iconCircle} ${styles.insta}`}>
                  <InstaIcon className={styles.cardIcon} />
                </div>
                <span className={styles.cardLabel}>{lang === 'en' ? 'Instagram' : 'אינסטגרם'}</span>
                <span className={styles.cardValue}>{BRAND.instagramHandle}</span>
              </a>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <a href={BRAND.phoneHref} className={styles.card}>
                <div className={`${styles.iconCircle} ${styles.phone}`}>
                  <PhoneIcon className={styles.cardIcon} />
                </div>
                <span className={styles.cardLabel}>{lang === 'en' ? 'Phone' : 'טלפון'}</span>
                <span className={styles.cardValue}>{BRAND.phone}</span>
              </a>
            </ScrollReveal>
          </div>

          <div className={styles.divider} />

          {/* Address */}
          <ScrollReveal>
            <div className={styles.address}>
              <p className={styles.addressLabel}>{lang === 'en' ? 'Location' : 'מיקום'}</p>
              <p className={styles.addressText}>{lang === 'en' ? BRAND.addressEn : BRAND.addressHe}</p>
              <p className={styles.note}>{lang === 'en' ? BOOKING.noteEn : BOOKING.noteHe}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
