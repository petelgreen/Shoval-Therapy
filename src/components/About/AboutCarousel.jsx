import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AboutCarousel.module.css';

/* ─── Slide content ──────────────────────────────────────────────── */
function AboutSlide({ lang }) {
  const isEn = lang === 'en';
  return (
    <div className={styles.notebookSlide}>
      <div className={styles.spiralStrip}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className={styles.spiralRing} />
        ))}
      </div>

      <div className={styles.notebookBody}>
        <p className={styles.notebookGreeting}>
          {isEn ? "Hi, I'm Shoval Cohen" : 'היי, אני שובל כהן'}
          <br />
          <span className={styles.notebookSub}>
            {isEn ? 'Certified Professional Therapist 🧡' : 'מטפלת מקצועית מוסמכת 🧡'}
          </span>
        </p>

        <p className={styles.notebookPara}>
          {isEn
            ? 'My love for this profession began from a personal place — from the desire to understand how it\'s possible to feel better. Over the years, I discovered that what I feel through my hands passes forward. That this touch can heal, release, and calm.'
            : 'האהבה שלי למקצוע התחילה ממקום אישי — מהרצון להבין איך אפשר להרגיש יותר טוב. עם השנים, גיליתי שמה שאני מרגישה דרך הידיים עובר הלאה. שהמגע הזה יכול לרפא, לשחרר, להרגיע.'}
        </p>

        <p className={styles.notebookPara}>
          {isEn
            ? 'I trained in Swedish massage, deep tissue, Lomi Lomi, foot massage, facial massage, Thai massage and prenatal treatments.'
            : 'למדתי עיסוי שוודי, עיסוי רקמות עמוק, עיסוי לומי לומי, פות מסאג׳, עיסוי פנים, עיסוי תאילנדי וטיפולי הריון.'}
        </p>

        <p className={styles.notebookPara}>
          {isEn
            ? 'Cupping therapy and hot stones — every treatment with me is a precise combination based on what your body needs.'
            : 'טיפול בכוסות רוח ואבנים חמות — וכל טיפול אצלי הוא שילוב מדויק לפי מה שהגוף שלך צריך.'}
        </p>
      </div>
    </div>
  );
}

function CTASlide({ lang }) {
  const isEn = lang === 'en';
  return (
    <div className={styles.ctaSlide}>
      <div className={styles.spiralStrip}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className={styles.spiralRing} />
        ))}
      </div>

      <div className={styles.notebookBody}>
        <p className={styles.ctaInvite}>
          {isEn ? 'I invite you to take a moment.' : 'אני מזמינה אותך לצאת רגע.'}
          <br />
          {isEn ? 'Just like that.' : 'ככה פשוט.'}
        </p>

        <p className={styles.ctaLocation}>
          {isEn
            ? '📍 My clinic is located in Daratim'
            : '📍 הקליניקה שלי נמצאת בדרתים'}
          <br />
          {isEn
            ? 'For more details about the different treatments, feel free to contact me.'
            : 'לפרטים נוספים על הטיפולים השונים, מוזמנות לפנות אלי.'}
        </p>

        <p className={styles.ctaSign}>{isEn ? 'With love, Shoval ♥' : 'אוהבת שובל ♥'}</p>

        <div className={styles.ctaBrand}>
          <span className={styles.ctaBrandText}>
            {isEn ? 'Breath . Touch . Healing' : 'נשימה . מגע . ריפוי'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main carousel ──────────────────────────────────────────────── */
const TOTAL = 2;
const AUTO_MS = 5000;

export default function AboutCarousel() {
  const { lang } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1); // 1 = forward, -1 = backward
  const [phase, setPhase]     = useState('idle'); // idle | exit | enter
  const timerRef              = useRef(null);
  const touchStartX           = useRef(null);

  const goTo = useCallback((next) => {
    if (phase !== 'idle') return;
    const d = next > current ? 1 : -1;
    setDir(d);
    setPhase('exit');
    setTimeout(() => {
      setCurrent(next);
      setPhase('enter');
      setTimeout(() => setPhase('idle'), 350);
    }, 300);
  }, [current, phase]);

  const advance = useCallback(() => {
    goTo((current + 1) % TOTAL);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    timerRef.current = setTimeout(advance, AUTO_MS);
    return () => clearTimeout(timerRef.current);
  }, [advance]);

  const prev = () => goTo((current - 1 + TOTAL) % TOTAL);
  const next = () => goTo((current + 1) % TOTAL);

  // Touch / swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  // Animation class
  const slideClass = [
    styles.slideInner,
    phase === 'exit'  ? (dir > 0 ? styles.exitLeft  : styles.exitRight)  : '',
    phase === 'enter' ? (dir > 0 ? styles.enterRight : styles.enterLeft) : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={styles.wrapper}
      dir={lang === 'en' ? 'ltr' : 'rtl'}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Phone-frame shell */}
      <div className={styles.frame}>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((current + 1) / TOTAL) * 100}%` }}
          />
        </div>

        {/* Slide content */}
        <div className={slideClass}>
          {current === 0 && <AboutSlide lang={lang} />}
          {current === 1 && <CTASlide  lang={lang} />}
        </div>

        {/* Arrow buttons */}
        <button
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={prev}
          aria-label={lang === 'en' ? 'Previous' : 'הקודם'}
        >‹</button>
        <button
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={next}
          aria-label={lang === 'en' ? 'Next' : 'הבא'}
        >›</button>

        {/* Dot navigation */}
        <div className={styles.dots}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={lang === 'en' ? `Slide ${i + 1}` : `שקף ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
