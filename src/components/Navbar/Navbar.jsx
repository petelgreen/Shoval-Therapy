import { useState, useEffect } from "react";
import { BRAND, NAV_LINKS } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Button";
import styles from "./Navbar.module.css";
import logoImg from "../../assets/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <a
            href="#hero"
            className={styles.logo}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
          >
            <img src={logoImg} alt={BRAND.nameEn} className={styles.logoImg} />
          </a>

          {/* Desktop Links */}
          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {lang === "en" ? link.labelEn : link.labelHe}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop: lang toggle + CTA */}
          <div className={styles.actions}>
            <button
              className={styles.langToggle}
              onClick={toggleLang}
              aria-label="Toggle language"
            >
              {lang === "he" ? "EN" : "עב"}
            </button>
            <Button
              size="sm"
              onClick={() => {
                handleNavClick("#services");
              }}
            >
              {lang === "en" ? "Book Now" : "הזמיני תור"}
            </Button>
          </div>

          {/* Mobile: lang toggle + Hamburger */}
          <div className={styles.mobileActions}>
            <button
              className={styles.langToggle}
              onClick={toggleLang}
              aria-label="Toggle language"
            >
              {lang === "he" ? "EN" : "עב"}
            </button>
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={lang === "en" ? "Menu" : "תפריט"}
            >
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        <button
          className={styles.mobileClose}
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
        <img
          src={logoImg}
          alt={BRAND.nameEn}
          className={styles.mobileLogoImg}
        />
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.mobileLink}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.href);
            }}
          >
            {lang === "en" ? link.labelEn : link.labelHe}
          </a>
        ))}
        <div className={styles.mobileDivider} />
        <Button href={BRAND.whatsapp} external size="sm">
          {lang === "en" ? "Book Now ✦" : "הזמיני תור ✦"}
        </Button>
      </div>
    </>
  );
}
