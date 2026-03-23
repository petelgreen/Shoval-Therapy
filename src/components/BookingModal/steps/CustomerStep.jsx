import { useState, useEffect, useRef } from 'react';
import { BOOKING_MODAL } from '../../../data/content';
import styles from './CustomerStep.module.css';

const IL_PHONE_RE = /^0(5[0-9]|[23489])[0-9]{7}$/;

function normalizePhone(value) {
  return value.replace(/[\s\-().]/g, '');
}

function formatPhoneDisplay(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.slice(0, 3) + '-' + digits.slice(3);
  return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
}

export default function CustomerStep({ lang, name, phone, notes, onChange, onSubmit, onBack, loading, error }) {
  const t = BOOKING_MODAL;
  const [touched, setTouched] = useState({ name: false, phone: false });
  const nameRef = useRef(null);

  // Autofocus name field on mount
  useEffect(() => {
    const timer = setTimeout(() => nameRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, []);

  const phoneClean = normalizePhone(phone);
  const phoneValid = IL_PHONE_RE.test(phoneClean);
  const nameValid = name.trim().length >= 2;

  // Show phone error only after full 10-digit entry OR explicit blur
  const phoneTypingTouched = phoneClean.length === 10;

  function blur(field) {
    setTouched((p) => ({ ...p, [field]: true }));
  }

  function handlePhoneChange(value) {
    const formatted = formatPhoneDisplay(value);
    onChange({ phone: formatted });
    if (!touched.phone && normalizePhone(formatted).length >= 3) {
      setTouched((p) => ({ ...p, phone: true }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    if (nameValid && phoneValid) onSubmit();
  }

  return (
    <div className={styles.root}>
      <h2 className="bm-step-title">
        {lang === 'en' ? t.steps[2].labelEn : t.steps[2].labelHe}
      </h2>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {/* Name */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bm-name">
            {lang === 'en' ? t.nameLabelEn : t.nameLabelHe}
          </label>
          <input
            id="bm-name"
            ref={nameRef}
            type="text"
            autoComplete="name"
            inputMode="text"
            enterKeyHint="next"
            className={[styles.input, touched.name && !nameValid ? styles.inputError : ''].filter(Boolean).join(' ')}
            value={name}
            placeholder={lang === 'en' ? (t.namePlaceholderEn || 'e.g. Rachel Cohen') : (t.namePlaceholderHe || 'לדוגמה: רחל כהן')}
            onChange={(e) => onChange({ name: e.target.value })}
            onBlur={() => blur('name')}
          />
          {touched.name && !nameValid && (
            <p className={styles.errorMsg}>
              {lang === 'en' ? 'Please enter your full name' : 'אנא הזיני שם מלא'}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bm-phone">
            {lang === 'en' ? t.phoneLabelEn : t.phoneLabelHe}
          </label>
          <input
            id="bm-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={[styles.input, (touched.phone || phoneTypingTouched) && !phoneValid ? styles.inputError : ''].filter(Boolean).join(' ')}
            value={phone}
            placeholder={lang === 'en' ? t.phonePlaceholderEn : t.phonePlaceholderHe}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={() => blur('phone')}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            dir="ltr"
          />
          {(touched.phone || phoneTypingTouched) && !phoneValid ? (
            <p className={styles.errorMsg}>
              {lang === 'en' ? t.phoneErrorEn : t.phoneErrorHe}
            </p>
          ) : (
            <p className={styles.helperText}>
              {lang === 'en' ? 'A verification code will be sent to this number' : 'קוד אימות יישלח למספר זה'}
            </p>
          )}
        </div>

        {/* Special notes */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bm-notes">
            {lang === 'en' ? 'Special requests (optional)' : 'בקשות מיוחדות (אופציונלי)'}
          </label>
          <textarea
            id="bm-notes"
            className={styles.textarea}
            rows={3}
            value={notes || ''}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>

        {error && <p className={styles.submitError}>{error}</p>}

        <div className="bm-nav">
          <button className="bm-btn-ghost" onClick={onBack} type="button">
            {lang === 'en' ? `← ${t.backEn}` : `→ ${t.backHe}`}
          </button>
          <button
            className="bm-btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? (lang === 'en' ? t.loadingEn : t.loadingHe)
              : (lang === 'en' ? t.sendCodeEn : t.sendCodeHe)}
          </button>
        </div>
      </form>
    </div>
  );
}
