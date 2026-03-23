import { useEffect, useRef } from "react";
import { BRAND } from "../../data/content";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Button";
import AnimatedShinyText from "../ui/AnimatedShinyText";
import { Awards } from "../ui/award";
import styles from "./Hero.module.css";
import heroBg from "../../assets/hero/hero-bg.mp4";

const introLines = {
  he: [
    "נעים להכיר שמי שובל, מעסה מקצועית לנשים בלבד.",
    "עיסוי טיפולים ומפנקים – תאילנדי, שבדי, רקמות עמוק, אבנים חמות והריון.",
  ],
  en: [
    "Nice to meet you  My name is Shoval, a professional masseuse for women only.",
    "Therapeutic & pampering massages – Thai, Swedish, deep tissue, hot stones and prenatal.",
  ],
};

export default function Hero() {
  const { lang } = useLanguage();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Set all required attrs as real HTML attributes (not just JS properties)
    v.muted = true;
    v.setAttribute("muted", "");
    v.setAttribute("autoplay", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const play = () => v.play().catch(() => {});

    // IntersectionObserver — iOS requires element to be visible before play()
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
      },
      { threshold: 0.1 },
    );
    observer.observe(v);

    // Resume after tab switch / app foreground
    const onVisible = () => {
      if (!document.hidden) play();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Last-resort fallback: play on first user touch
    const onTouch = () => play();
    document.addEventListener("touchstart", onTouch, { once: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      document.removeEventListener("touchstart", onTouch);
    };
  }, []);

  const taglineWords =
    lang === "en" ? BRAND.taglineEn.split(" ") : BRAND.taglineHe.split(" ");

  return (
    <section id="hero" className={styles.section}>
      {/* SVG clip-path definition — wave shape for the video */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="heroWaveClip" clipPathUnits="objectBoundingBox">
            <path d="M 0.22,0 C 0.04,0.3 0.04,0.7 0.22,1 L 1,1 L 1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Text content — left column (DOM first = left in grid) */}
      <div className={styles.content}>
        <div className={styles.intro}>
          <div className={styles.badge}>
            {lang === "en"
              ? "Professional Massage · Women Only"
              : "עיסוי טיפולי מקצועי · לנשים בלבד"}
          </div>
          <h1 className={styles.introTitle}>
            <span className={styles.introTitleScript}>Shoval</span>
            <span className={styles.introTitleSerif}> Therapy</span>
          </h1>
          <div className={styles.introLines}>
            {introLines[lang].map((line, i) => (
              <span
                key={i}
                className={styles.introLine}
                style={{ animationDelay: `${0.3 + i * 0.18}s` }}
              >
                {line}
              </span>
            ))}
            <AnimatedShinyText className={styles.discountLine} lang={lang} />
          </div>
        </div>

        <p className={styles.tagline}>
          {taglineWords.map((word, i) => (
            <span
              key={i}
              className={styles.taglineWord}
              style={{ animationDelay: `${0.9 + i * 0.35}s` }}
            >
              {word}
            </span>
          ))}
        </p>

        <div className={styles.cta}>
          <Button
            onClick={() =>
              document
                .querySelector("#services")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            size="lg"
          >
            {lang === "en" ? "Book Now" : "הזמיני תור עכשיו"}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() =>
              document
                .querySelector("#about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {lang === "en" ? "Explore ↓" : "↓ גלי עוד"}
          </Button>
        </div>

        {/* Award badge */}
        <div className={styles.awardBadge}>
          <Awards
            variant="award"
            title={lang === "en" ? "5th in the World" : "מקום 5 בעולם"}
            subtitle="World Massage Super Cup 2025"
            level="gold"
            showLevel={false}
            compact
          />
        </div>

        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollLine} />
        </div>
      </div>

      {/* Wave video panel — right column */}
      <div className={styles.videoWave}>
        <video
          className={styles.waveVideo}
          ref={videoRef}
          src={heroBg}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </section>
  );
}
