import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function ScrollReveal({ children, delay = 0, direction = 'up', className = '' }) {
  const { ref, isVisible } = useScrollReveal();

  const dirClass = {
    up:    '',
    left:  'from-left',
    right: 'from-right',
    fade:  'fade-only',
  }[direction] || '';

  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
