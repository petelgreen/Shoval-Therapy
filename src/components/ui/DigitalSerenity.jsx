import React, { useState, useEffect, useRef } from 'react';
import styles from './DigitalSerenity.module.css';

const inlineStyles = `
  .ds-grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: ds-grid-draw 2s ease-out forwards; }
  .ds-detail-dot { fill: #cbd5e1; opacity: 0; animation: ds-pulse-glow 3s ease-in-out infinite; }
  @keyframes ds-grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
  @keyframes ds-pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
`;

export default function DigitalSerenity({ children, className = '' }) {
  const [mousePos, setMousePos] = useState({ left: '0px', top: '0px', opacity: 0 });
  const [ripples, setRipples] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const floatsRef = useRef([]);
  const wrapperRef = useRef(null);

  // Mouse gradient
  useEffect(() => {
    const onMove = (e) => setMousePos({ left: `${e.clientX}px`, top: `${e.clientY}px`, opacity: 1 });
    const onLeave = () => setMousePos(p => ({ ...p, opacity: 0 }));
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseleave', onLeave); };
  }, []);

  // Click ripples
  useEffect(() => {
    const onClick = (e) => {
      const r = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(p => [...p, r]);
      setTimeout(() => setRipples(p => p.filter(x => x.id !== r.id)), 1000);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Floating dots on scroll
  useEffect(() => {
    if (!wrapperRef.current) return;
    floatsRef.current = Array.from(wrapperRef.current.querySelectorAll('[data-float]'));
    const onScroll = () => {
      if (scrolled) return;
      setScrolled(true);
      floatsRef.current.forEach((el, i) => {
        setTimeout(() => {
          if (el) { el.style.animationPlayState = 'running'; el.style.opacity = ''; }
        }, (parseFloat(el.style.animationDelay || '0') * 1000) + i * 100);
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolled]);

  return (
    <>
      <style>{inlineStyles}</style>
      <div ref={wrapperRef} className={`${styles.wrapper} ${className}`}>

        <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="ds-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100,116,139,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ds-grid)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="ds-grid-line" style={{ animationDelay: '0.5s' }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="ds-grid-line" style={{ animationDelay: '1s' }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="ds-grid-line" style={{ animationDelay: '1.5s' }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="ds-grid-line" style={{ animationDelay: '2s' }} />
          <circle cx="20%" cy="20%" r="2" className="ds-detail-dot" style={{ animationDelay: '3s' }} />
          <circle cx="80%" cy="20%" r="2" className="ds-detail-dot" style={{ animationDelay: '3.2s' }} />
          <circle cx="20%" cy="80%" r="2" className="ds-detail-dot" style={{ animationDelay: '3.4s' }} />
          <circle cx="80%" cy="80%" r="2" className="ds-detail-dot" style={{ animationDelay: '3.6s' }} />
          <circle cx="50%" cy="50%" r="1.5" className="ds-detail-dot" style={{ animationDelay: '4s' }} />
        </svg>

        <div className={`${styles.corner} ${styles['corner--tl']}`}><div className={styles.cornerDot} /></div>
        <div className={`${styles.corner} ${styles['corner--tr']}`}><div className={styles.cornerDot} /></div>
        <div className={`${styles.corner} ${styles['corner--bl']}`}><div className={styles.cornerDot} /></div>
        <div className={`${styles.corner} ${styles['corner--br']}`}><div className={styles.cornerDot} /></div>

        <div data-float className={styles.float} style={{ top: '25%', left: '15%', animationDelay: '0.5s' }} />
        <div data-float className={styles.float} style={{ top: '60%', left: '85%', animationDelay: '1s' }} />
        <div data-float className={styles.float} style={{ top: '40%', left: '10%', animationDelay: '1.5s' }} />
        <div data-float className={styles.float} style={{ top: '75%', left: '90%', animationDelay: '2s' }} />

        <div className={styles.children}>{children}</div>

        <div
          className={styles.mouseGradient}
          style={{ left: mousePos.left, top: mousePos.top, opacity: mousePos.opacity }}
        />

        {ripples.map(r => (
          <div key={r.id} className={styles.ripple} style={{ left: `${r.x}px`, top: `${r.y}px` }} />
        ))}
      </div>
    </>
  );
}
