import styles from './Button.module.css';

export default function Button({
  variant = 'filled',
  size = 'md',
  href,
  onClick,
  children,
  external = false,
  full = false,
  className = '',
}) {
  const cls = [
    styles.btn,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    full ? styles.full : '',
    className,
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
