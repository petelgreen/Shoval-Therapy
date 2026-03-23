import { useEffect, useRef } from "react";
import { GALLERY, BRAND } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import SectionTitle from "../ui/SectionTitle";
import ScrollReveal from "../ui/ScrollReveal";
import styles from "./Gallery.module.css";

function AutoPlayVideo({ src, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const play = () => v.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
      },
      { threshold: 0.1 },
    );
    observer.observe(v);

    const onVisible = () => {
      if (!document.hidden) play();
    };
    document.addEventListener("visibilitychange", onVisible);

    const onTouch = () => play();
    document.addEventListener("touchstart", onTouch, { once: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      document.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}

import img1 from "../../assets/images/room.jpg";
import img2 from "../../assets/images/6cb485af-e4aa-4bcf-8c0d-2a0d79152e4f.jpg";
import img3 from "../../assets/images/9814f75f-cf10-4ff6-ad1f-e8a276a08146.jpg";
import img4 from "../../assets/images/c39483ba-06f4-4b19-a7fa-85682bb01345.jpg";
import img5 from "../../assets/images/d0382089-4a5a-4f20-954f-99d85926423c.jpg";
import vid1 from "../../assets/images/WhatsApp Video 2026-03-19 at 15.58.51.mp4";
import vid2 from "../../assets/images/WhatsApp Video 2026-03-19 at 15.57.34.mp4";
import vid3 from "../../assets/images/WhatsApp Video 2026-03-19 at 15.58.25.mp4";
import vid4 from "../../assets/images/WhatsApp Video 2026-03-19 at 16.05.27.mp4";

const mediaItems = [
  {
    id: 1,
    src: vid1,
    type: "video",
    altHe: "כוסות רוח",
    altEn: "Cupping Therapy",
  },
  {
    id: 2,
    src: img3,
    type: "image",
    altHe: "עיסויים לצוותים/ארגונים",
    altEn: "Team Building and Cohesion Days",
  },
  {
    id: 3,
    src: vid3,
    type: "video",
    altHe: "רגעי שלווה",
    altEn: "Moments of Calm",
  },
  {
    id: 4,
    src: img1,
    type: "image",
    altHe: "חדר הטיפולים",
    altEn: "Treatment Room",
  },
  {
    id: 5,
    src: vid2,
    type: "video",
    altHe: "חדר הטיפולים",
    altEn: "Treatment Video",
  },
  {
    id: 6,
    src: img5,
    type: "image",
    altHe: "חוויית הספא",
    altEn: "Spa Experience",
  },
  {
    id: 7,
    src: img4,
    type: "image",
    altHe: "World Massage Super Cup",
    altEn: "Hot Stones",
  },
  {
    id: 8,
    src: vid4,
    type: "video",
    altHe: "חוויית הטיפול",
    altEn: "The Treatment Experience",
  },
  {
    id: 9,
    src: img2,
    type: "image",
    altHe: "אווירת הטיפול",
    altEn: "Treatment Ambiance",
  },
];

export default function Gallery() {
  const { lang } = useLanguage();

  return (
    <section id="gallery" className={styles.section}>
      <div className="container">
        <ScrollReveal>
          <SectionTitle
            titleHe={GALLERY.titleHe}
            titleEn={GALLERY.titleEn}
            subtitleHe={GALLERY.subtitleHe}
            subtitleEn={GALLERY.subtitleEn}
          />
        </ScrollReveal>

        <div className={styles.grid}>
          {mediaItems.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60} className={item.id === 4 ? styles.hideOnMobile : ''}>
              <figure className={styles.figure}>
                {item.type === "video" ? (
                  <AutoPlayVideo src={item.src} className={styles.media} />
                ) : (
                  <img
                    src={item.src}
                    alt={lang === "en" ? item.altEn : item.altHe}
                    className={styles.media}
                  />
                )}
                <div className={styles.overlay}>
                  <svg
                    className={styles.overlayIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                  <span className={styles.overlayText}>
                    {lang === "en" ? item.altEn : item.altHe}
                  </span>
                </div>
              </figure>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className={styles.instaCta}>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instaLink}
            >
              <svg
                className={styles.instaIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              {lang === "en"
                ? `Follow on Instagram · ${BRAND.instagramHandle}`
                : `עקבו אחרי באינסטגרם · ${BRAND.instagramHandle}`}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
