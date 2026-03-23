import { SERVICES } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import SectionTitle from "../ui/SectionTitle";
import ScrollReveal from "../ui/ScrollReveal";
import styles from "./Services.module.css";

function LeafIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 2C6 2 2 6 2 12s8 10 10 10c0 0 10-2 10-10C22 6 18 2 12 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  );
}

function ServiceCard({ service, index, lang, onOpenBooking }) {
  return (
    <ScrollReveal delay={index * 80} className={styles.cardWrapper}>
      <div
        className={`${styles.card} ${service.highlight ? styles.highlight : ""}`}
      >
        {service.highlight && (
          <span className={styles.highlightBadge}>
            {lang === "en" ? "Featured" : "מומלץ"}
          </span>
        )}

        <div className={styles.iconWrapper}>
          <LeafIcon className={styles.icon} />
        </div>

        <h3 className={styles.nameHe}>
          {lang === "en" ? service.nameEn : service.nameHe}
        </h3>
        <p className={styles.description}>
          {lang === "en" ? service.descriptionEn : service.descriptionHe}
        </p>

        <div className={styles.footer}>
          <span className={styles.duration}>
            {lang === "en" ? service.durationEn : service.durationHe}
          </span>
          <span className={styles.price}>{service.price}</span>
        </div>

        <button
          className={styles.bookBtn}
          onClick={() => onOpenBooking(service)}
          type="button"
        >
          {lang === "en" ? "Book This Treatment" : "בחרי"}
        </button>
      </div>
    </ScrollReveal>
  );
}

export default function Services({ onOpenBooking }) {
  const { lang } = useLanguage();

  return (
    <section id="services" className={styles.section}>
      <div className="container">
        <ScrollReveal>
          <SectionTitle
            titleHe="שירותים וטיפולים"
            titleEn="Treatments & Services"
            subtitleHe="בחרי את הטיפול המדויק עבורך"
            subtitleEn="Choose your therapy to book"
          />
        </ScrollReveal>

        <div className={styles.grid}>
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              lang={lang}
              onOpenBooking={onOpenBooking}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
