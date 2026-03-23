import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BOOKING_MODAL, BRAND } from '../../data/content';
import ServiceStep from './steps/ServiceStep';
import DateTimeStep from './steps/DateTimeStep';
import CustomerStep from './steps/CustomerStep';
import OTPStep from './steps/OTPStep';
import HealthDeclarationStep from './steps/HealthDeclarationStep';
import ConfirmationStep from './steps/ConfirmationStep';
import styles from './BookingModal.module.css';

const STEPS = 6;
const SESSION_KEY = 'shoval_booking_draft';

export default function BookingModal({ isOpen, onClose, initialService = null }) {
  const { lang } = useLanguage();
  const t = BOOKING_MODAL;

  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    service: initialService,
    date: '',
    time: '',
    name: '',
    phone: '',
    notes: '',
  });
  const [bookingId, setBookingId] = useState(null);
  const [submitError, setSubmitError] = useState('');
  // creatingBooking: true while POST-OTP booking creation is in flight
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Reset when modal opens/closes — restore draft from sessionStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved && !initialService) {
          const draft = JSON.parse(saved);
          setBooking(draft.booking || { service: null, date: '', time: '', name: '', phone: '', notes: '' });
          setStep(draft.step ?? 0);
        } else {
          setStep(initialService ? 1 : 0);
          setBooking({ service: initialService, date: '', time: '', name: '', phone: '', notes: '' });
        }
      } catch {
        setStep(initialService ? 1 : 0);
        setBooking({ service: initialService, date: '', time: '', name: '', phone: '', notes: '' });
      }
      setBookingId(null);
      setSubmitError('');
    }
  }, [isOpen, initialService]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const update = useCallback((fields) => {
    setBooking((prev) => {
      const next = { ...prev, ...fields };
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ booking: next, step })); } catch {}
      return next;
    });
  }, [step]);

  function goToStep(n) {
    setStep(n);
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ booking, step: n })); } catch {}
  }

  async function handleVerified() {
    setCreatingBooking(true);
    setSubmitError('');
    try {
      const url = import.meta.env.VITE_APPS_SCRIPT_URL;
      const serviceName = lang === 'en' ? booking.service.nameEn : booking.service.nameHe;

      if (url) {
        const params = new URLSearchParams({
          action: 'createBooking',
          name: booking.name,
          phone: booking.phone,
          service: serviceName,
          date: booking.date,
          time: booking.time,
          duration: booking.service.durationMins,
          notes: booking.notes || '',
        });
        const res = await fetch(`${url}?${params}`);
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch {
          console.error('Apps Script non-JSON response:', text);
          throw new Error('Bad response from server');
        }
        console.log('Apps Script response:', json);
        if (!json.success) throw new Error(json.error || 'Failed');
        setBookingId(json.bookingId || null);
      }

      try { sessionStorage.removeItem(SESSION_KEY); } catch {}
      setCreatingBooking(false);
      setStep(5);
    } catch (err) {
      console.error('Booking error:', err);
      setCreatingBooking(false);
      if (!navigator.onLine) {
        setSubmitError(lang === 'en' ? t.errorOfflineEn : t.errorOfflineHe);
      } else if (err.message && /slot|taken|conflict|booked/i.test(err.message)) {
        setSubmitError(lang === 'en' ? t.errorSlotTakenEn : t.errorSlotTakenHe);
      } else {
        setSubmitError(lang === 'en' ? t.errorEn : t.errorHe);
      }
    }
  }

  function buildWhatsAppRescheduleUrl() {
    const serviceName = lang === 'en' ? booking.service?.nameEn : booking.service?.nameHe;
    const msg = lang === 'en'
      ? `Hi Shoval, I'd like to cancel/reschedule my appointment: ${serviceName} on ${booking.date} at ${booking.time}. Name: ${booking.name}, Phone: ${booking.phone}`
      : `שלום שובל, הייתי רוצה לשנות/לבטל את התור שלי: ${serviceName} ב-${booking.date} בשעה ${booking.time}. שמי ${booking.name}, טל: ${booking.phone}`;
    return `${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  if (!isOpen) return null;

  const showServicePill = step > 0 && booking.service;
  const servicePillText = booking.service
    ? `${lang === 'en' ? booking.service.nameEn : booking.service.nameHe} · ${lang === 'en' ? booking.service.durationEn : booking.service.durationHe} · ${booking.service.price}`
    : '';

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.stepIndicators}>
              {t.steps.map((s, i) => (
                <div
                  key={i}
                  className={[
                    styles.stepDot,
                    i === step ? styles.stepDotActive : '',
                    i < step ? styles.stepDotDone : '',
                  ].filter(Boolean).join(' ')}
                >
                  <span className={styles.stepDotLabel}>
                    {lang === 'en' ? s.labelEn : s.labelHe}
                  </span>
                </div>
              ))}
              <span className={styles.stepCounter}>
                {lang === 'en' ? `Step ${step + 1} of ${STEPS}` : `שלב ${step + 1} מתוך ${STEPS}`}
              </span>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {showServicePill && (
            <div className={styles.servicePill} title={servicePillText}>
              {servicePillText}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((step + 1) / STEPS) * 100}%` }}
          />
        </div>

        {/* Step content */}
        <div className={`${styles.body} ${styles.stepEnter}`} key={step}>
          {step === 0 && (
            <ServiceStep
              lang={lang}
              selected={booking.service}
              onSelect={(service) => update({ service })}
              onNext={() => goToStep(1)}
            />
          )}
          {step === 1 && (
            <DateTimeStep
              lang={lang}
              service={booking.service}
              date={booking.date}
              time={booking.time}
              onDateChange={(date) => update({ date, time: '' })}
              onTimeChange={(time) => update({ time })}
              onNext={() => goToStep(2)}
              onBack={() => goToStep(0)}
            />
          )}
          {step === 2 && (
            <CustomerStep
              lang={lang}
              name={booking.name}
              phone={booking.phone}
              notes={booking.notes}
              onChange={update}
              onSubmit={() => goToStep(3)}
              onBack={() => goToStep(1)}
              loading={false}
              error=""
            />
          )}
          {step === 3 && (
            <OTPStep
              lang={lang}
              phone={booking.phone}
              name={booking.name}
              onVerified={() => goToStep(4)}
              onBack={() => goToStep(2)}
              submitLoading={false}
              submitError=""
            />
          )}
          {step === 4 && !creatingBooking && !submitError && (
            <HealthDeclarationStep
              lang={lang}
              onDone={() => { handleVerified(); }}
            />
          )}
          {step === 4 && (creatingBooking || submitError) && (
            <div className={styles.creatingScreen}>
              {creatingBooking ? (
                <>
                  <div className={styles.creatingSpinner} />
                  <p className={styles.creatingText}>
                    {lang === 'en' ? 'Creating your booking…' : 'מסיימים לקבוע את התור…'}
                  </p>
                </>
              ) : (
                <>
                  <div className={styles.creatingErrorIcon}>!</div>
                  <p className={styles.creatingErrorMsg}>{submitError}</p>
                  <div className={styles.creatingActions}>
                    <button
                      className="bm-btn-primary"
                      onClick={() => { setSubmitError(''); handleVerified(); }}
                      type="button"
                    >
                      {lang === 'en' ? 'Try Again' : 'נסי שוב'}
                    </button>
                    <a
                      href={BRAND.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bm-btn-ghost"
                    >
                      {lang === 'en' ? 'Contact via WhatsApp' : 'פנייה בוואצאפ'}
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
          {step === 5 && (
            <ConfirmationStep
              lang={lang}
              booking={booking}
              bookingId={bookingId}
              rescheduleUrl={buildWhatsAppRescheduleUrl()}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
