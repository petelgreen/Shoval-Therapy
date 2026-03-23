import { BRAND } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.tagline}>
          {lang === "en" ? BRAND.taglineEn : BRAND.taglineHe}
        </p>
        <div className={styles.links}>
          <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <span className={styles.dot}>·</span>
          <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <span className={styles.dot}>·</span>
          <a href={BRAND.phoneHref}>{BRAND.phone}</a>
        </div>
        <p className={styles.copy}>
          © {new Date().getFullYear()} · {"@petelgreen"} · {"preen"}
        </p>
      </div>
    </footer>
  );
}
