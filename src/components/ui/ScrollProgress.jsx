import { useEffect, useRef } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? scrolled / total : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={barRef} className={styles.bar} aria-hidden="true" />;
}
