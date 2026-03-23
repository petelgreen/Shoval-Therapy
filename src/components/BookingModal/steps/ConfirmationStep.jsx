import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BOOKING_MODAL, BRAND } from '../../../data/content';
import styles from './ConfirmationStep.module.css';

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(lang === 'en' ? 'en-IL' : 'he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildWhatsAppUrl(booking, lang) {
  const serviceName = lang === 'en' ? booking.service?.nameEn : booking.service?.nameHe;
  const msg = lang === 'en'
    ? `Hi Shoval! I just booked an appointment:\n${serviceName}\n${formatDate(booking.date, lang)} at ${booking.time}\nName: ${booking.name}\nPhone: ${booking.phone}`
    : `שלום שובל! קבעתי תור:\n${serviceName}\n${formatDate(booking.date, lang)} בשעה ${booking.time}\nשמי ${booking.name}, טל: ${booking.phone}`;
  return `${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
}

function buildIcsUrl(booking, lang) {
  if (!booking.date || !booking.time || !booking.service) return null;
  const serviceName = lang === 'en' ? booking.service.nameEn : booking.service.nameHe;
  const [year, month, day] = booking.date.split('-').map(Number);
  const [hour, minute] = booking.time.split(':').map(Number);
  const pad = (n) => String(n).padStart(2, '0');
  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  const endMins = hour * 60 + minute + (booking.service.durationMins || 60);
  const endHour = Math.floor(endMins / 60);
  const endMin = endMins % 60;
  const dtEnd = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMin)}00`;
  const summary = encodeURIComponent(serviceName + (lang === 'en' ? ' - Shoval Therapy' : ' - נשימה. מגע. ריפוי.'));
  const location = encodeURIComponent(BRAND.addressHe);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${decodeURIComponent(summary)}`,
    `LOCATION:${decodeURIComponent(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');
  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
}

export default function ConfirmationStep({ lang, booking, bookingId, rescheduleUrl, onClose }) {
  const t = BOOKING_MODAL;
  const [copied, setCopied] = useState(false);

  // Fire confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#C9A96E', '#A8844A', '#FFFDF9', '#E8D5C4', '#F5EFE6'],
        ticks: 200,
        gravity: 0.9,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const serviceName = lang === 'en' ? booking.service?.nameEn : booking.service?.nameHe;

  function handleCopy() {
    const text = lang === 'en'
      ? `Booking Confirmed\nTreatment: ${serviceName}\nDate: ${formatDate(booking.date, lang)}\nTime: ${booking.time}\nName: ${booking.name}${bookingId ? `\nRef: ${bookingId}` : ''}`
      : `תור אושר\nטיפול: ${serviceName}\nתאריך: ${formatDate(booking.date, lang)}\nשעה: ${booking.time}\nשם: ${booking.name}${bookingId ? `\nמספר הזמנה: ${bookingId}` : ''}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const icsUrl = buildIcsUrl(booking, lang);

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <svg className={styles.checkSvg} viewBox="0 0 36 36" fill="none">
          <path
            className={styles.checkPath}
            d="M8 18 L15 25 L28 11"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className={styles.title}>
        {lang === 'en' ? t.confirmTitleEn : t.confirmTitleHe}
      </h2>
      <p className={styles.sub}>
        {lang === 'en' ? t.confirmSubEn : t.confirmSubHe}
      </p>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{lang === 'en' ? 'Treatment' : 'טיפול'}</span>
          <span className={styles.rowValue}>{serviceName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{lang === 'en' ? 'Date' : 'תאריך'}</span>
          <span className={styles.rowValue}>{formatDate(booking.date, lang)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{lang === 'en' ? 'Time' : 'שעה'}</span>
          <span className={styles.rowValue}>{booking.time}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{lang === 'en' ? 'Name' : 'שם'}</span>
          <span className={styles.rowValue}>{booking.name}</span>
        </div>
        {booking.service?.durationHe && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>{lang === 'en' ? 'Duration' : 'משך'}</span>
            <span className={styles.rowValue}>{lang === 'en' ? booking.service.durationEn : booking.service.durationHe}</span>
          </div>
        )}
        {booking.service?.price && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>{lang === 'en' ? 'Price' : 'מחיר'}</span>
            <span className={styles.rowValue}>{booking.service.price}</span>
          </div>
        )}
        {bookingId && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>{lang === 'en' ? t.bookingRefEn : t.bookingRefHe}</span>
            <span className={[styles.rowValue, styles.bookingRef].join(' ')} dir="ltr">{bookingId}</span>
          </div>
        )}
      </div>

      <p className={styles.cancellationNote}>
        {lang === 'en'
          ? 'Cancellations or changes made less than 24 hours before the appointment will be charged ₪100.'
          : 'ביטול או שינוי שיתבצעו פחות מ-24 שעות לפני מועד התור יחויבו בתשלום של 100 ש״ח.'}
      </p>

      <div className={styles.actions}>
        {icsUrl && (
          <a
            href={icsUrl}
            download="appointment.ics"
            className={styles.calendarBtn}
          >
            📅 {lang === 'en' ? 'Add to Calendar' : 'הוסיפי ליומן'}
          </a>
        )}

        <button className={styles.copyBtn} onClick={handleCopy} type="button">
          {copied
            ? (lang === 'en' ? '✓ ' + t.copiedEn : '✓ ' + t.copiedHe)
            : (lang === 'en' ? t.copyDetailsEn : t.copyDetailsHe)}
        </button>

        <a
          href={rescheduleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.rescheduleLink}
        >
          {lang === 'en' ? t.rescheduleLabelEn : t.rescheduleLabelHe}
        </a>

        <button className="bm-btn-ghost" onClick={onClose} type="button">
          {lang === 'en' ? t.closeEn : t.closeHe}
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
