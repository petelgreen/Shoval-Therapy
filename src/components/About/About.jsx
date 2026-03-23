import { ABOUT } from '../../data/content';
import { useLanguage } from '../../context/LanguageContext';
import SectionTitle from '../ui/SectionTitle';
import ScrollReveal from '../ui/ScrollReveal';
import shovalPhoto from '../../assets/shoval.jpg';
import styles from './About.module.css';

export default function About() {
  const { lang } = useLanguage();
  const paragraphs = lang === 'en' ? ABOUT.paragraphsEn : ABOUT.paragraphsHe;

  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* Portrait photo */}
          <ScrollReveal direction="right" className={styles.imageReveal}>
            <div className={styles.imageWrapper}>
              <div className={styles.photoFrame}>
                <img
                  src={shovalPhoto}
                  alt="שובל כהן"
                  className={styles.photo}
                />
              </div>
              <div className={styles.imageAccent} />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="left" delay={100}>
            <div className={styles.textSide}>
              <SectionTitle
                titleHe={ABOUT.titleHe}
                titleEn={ABOUT.titleEn}
                centered={false}
              />

              <div className={styles.paragraphs}>
                {paragraphs.map((p, i) => (
                  <p key={i} className={styles.para}>{p}</p>
                ))}
              </div>

              <div className={styles.credentials}>
                {ABOUT.credentialsHe.map((c, i) => (
                  <div key={i} className={styles.credential}>
                    <span className={styles.credDot} />
                    {lang === 'en' ? c.textEn : c.textHe}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
