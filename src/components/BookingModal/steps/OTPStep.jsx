import { useState, useEffect, useRef, useCallback } from 'react';
import { BOOKING_MODAL, BRAND } from '../../../data/content';
import styles from './OTPStep.module.css';

const RESEND_COUNTDOWN = 30;
const MAX_ATTEMPTS = 3;

function toE164(phone) {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('972')) return '+' + clean;
  return '+972' + clean.slice(1);
}

export default function OTPStep({ lang, phone, name, onVerified, onBack, submitLoading, submitError }) {
  const t = BOOKING_MODAL;
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  // status: 'sending' | 'waiting' | 'verifying'
  const [status, setStatus] = useState('sending');
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef([]);
  const url = import.meta.env.VITE_APPS_SCRIPT_URL;
  const e164 = toE164(phone);

  const sendOTP = useCallback(async () => {
    setStatus('sending');
    setErrorMsg('');
    setDigits(['', '', '', '', '', '']);
    try {
      if (url) {
        const params = new URLSearchParams({ action: 'sendOTP', phone: e164 });
        const res = await fetch(`${url}?${params}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'send failed');
      }
      setStatus('waiting');
      setCountdown(RESEND_COUNTDOWN);
      setAttempts(0);
      // Focus first input after send
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setStatus('waiting'); // still allow manual entry in case of transient error
      setCountdown(RESEND_COUNTDOWN);
      setErrorMsg(lang === 'en' ? t.otpErrorSendEn : t.otpErrorSendHe);
    }
  }, [url, e164, lang, t]);

  // Bypass OTP for test user
  useEffect(() => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (name === 'ppp' && cleanPhone === '0529572020') {
      onVerified();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-send on mount — guard prevents double-fire in React Strict Mode
  const hasSentRef = useRef(false);
  useEffect(() => {
    if (hasSentRef.current) return;
    hasSentRef.current = true;
    const cleanPhone = phone.replace(/\D/g, '');
    if (name === 'ppp' && cleanPhone === '0529572020') return;
    sendOTP();
  }, [sendOTP]);

  // Countdown timer
  useEffect(() => {
    if (status !== 'waiting' || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, status]);

  function handleDigitChange(index, value) {
    // Support paste of full 6-digit code
    const pasted = value.replace(/\D/g, '');
    if (pasted.length > 1) {
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < 6 && i < pasted.length; i++) next[i] = pasted[i];
      setDigits(next);
      const lastFilled = Math.min(pasted.length - 1, 5);
      inputRefs.current[lastFilled]?.focus();
      return;
    }
    const v = pasted.slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  }

  // Auto-verify when all 6 digits are filled
  useEffect(() => {
    const code = digits.join('');
    if (code.length === 6 && status === 'waiting' && attempts < MAX_ATTEMPTS) {
      handleVerify(code);
    }
  }, [digits]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVerify(codeOverride) {
    const code = codeOverride ?? digits.join('');
    if (code.length < 6) return;
    setStatus('verifying');
    setErrorMsg('');
    try {
      if (url) {
        const params = new URLSearchParams({ action: 'verifyOTP', phone: e164, code });
        const res = await fetch(`${url}?${params}`);
        const json = await res.json();

        if (json.success) {
          onVerified();
          return;
        }

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setStatus('waiting');

        if (json.error === 'expired') {
          setErrorMsg(lang === 'en' ? t.otpErrorExpiredEn : t.otpErrorExpiredHe);
          setDigits(['', '', '', '', '', '']);
        } else {
          const left = MAX_ATTEMPTS - newAttempts;
          const baseMsg = lang === 'en' ? t.otpErrorInvalidEn : t.otpErrorInvalidHe;
          const leftMsg = left > 0
            ? ` ${left} ${lang === 'en' ? t.otpAttemptsLeftEn : t.otpAttemptsLeftHe}.`
            : '';
          setErrorMsg(baseMsg + leftMsg);
          setDigits(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
      } else {
        // No URL configured (dev mode) — skip verification
        onVerified();
      }
    } catch {
      setAttempts((a) => a + 1);
      setStatus('waiting');
      setErrorMsg(lang === 'en' ? t.otpErrorGeneralEn : t.otpErrorGeneralHe);
    }
  }

  const tooManyAttempts = attempts >= MAX_ATTEMPTS;
  const canResend = countdown <= 0 && status === 'waiting';

  return (
    <div className={styles.root}>
      <h2 className="bm-step-title">
        {lang === 'en' ? t.otpTitleEn : t.otpTitleHe}
      </h2>

      <p className={styles.subtitle}>
        {lang === 'en' ? t.otpSentEn : t.otpSentHe}
        <span className={styles.phoneHighlight} dir="ltr">
          ••• {phone.replace(/\D/g, '').slice(-4)}
        </span>
      </p>

      {status === 'sending' ? (
        <p className={styles.sending}>
          {lang === 'en' ? t.otpSendingEn : t.otpSendingHe}
        </p>
      ) : tooManyAttempts ? (
        <div className={styles.lockoutBlock}>
          <p className={styles.lockoutMsg}>
            {lang === 'en'
              ? "Too many failed attempts. Please contact us via WhatsApp to complete your booking."
              : "יותר מדי ניסיונות כושלים. צרי קשר בוואצאפ כדי להשלים את ההזמנה."}
          </p>
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bm-btn-primary"
          >
            {lang === 'en' ? 'Contact via WhatsApp' : 'פנייה בוואצאפ'}
          </a>
          <button className="bm-btn-ghost" onClick={onBack} type="button">
            {lang === 'en' ? '← Start Over' : 'התחלה מחדש →'}
          </button>
        </div>
      ) : (
        <>
          <div className={[styles.digitRow, status === 'verifying' ? styles.digitRowVerifying : ''].filter(Boolean).join(' ')} dir="ltr">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className={[
                  styles.digitInput,
                  errorMsg ? styles.digitError : '',
                  status === 'verifying' ? styles.digitVerifying : '',
                ].filter(Boolean).join(' ')}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                value={d}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={status === 'verifying'}
                aria-label={`${lang === 'en' ? 'Digit' : 'ספרה'} ${i + 1}`}
              />
            ))}
          </div>

          {errorMsg && (
            <p className={styles.errorMsg}>{errorMsg}</p>
          )}

          <div className={styles.resendRow}>
            {countdown > 0 ? (
              <span className={styles.countdown}>
                {lang === 'en'
                  ? `Resend in 0:${String(countdown).padStart(2, '0')}`
                  : `שלח שוב בעוד 0:${String(countdown).padStart(2, '0')}`}
              </span>
            ) : null}
            {canResend && (
              <button className="bm-btn-ghost" onClick={sendOTP} type="button">
                {lang === 'en' ? t.otpResendEn : t.otpResendHe}
              </button>
            )}
          </div>
        </>
      )}

      <div className="bm-nav" style={{ marginTop: 'auto' }}>
        <button className="bm-btn-ghost" onClick={onBack} type="button">
          {lang === 'en' ? `← ${t.backEn}` : `→ ${t.backHe}`}
        </button>
      </div>
    </div>
  );
}
