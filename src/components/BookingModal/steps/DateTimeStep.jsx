import { useState, useEffect, useRef } from 'react';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import { CalendarIcon } from 'lucide-react';
import { AVAILABLE_SLOTS, BOOKING_MODAL } from '../../../data/content';
import { Button } from '../../ui/button-aria';
import { DatePicker, DatePickerContent } from '../../ui/date-picker';
import { DateInput } from '../../ui/datefield';
import { FieldGroup } from '../../ui/field';
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from '../../ui/calendar';
import styles from './DateTimeStep.module.css';

function timeToMins(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }

function getFilteredSlots(durationMins) {
  return AVAILABLE_SLOTS.filter((slot) => timeToMins(slot) + durationMins <= 22 * 60);
}

function getDayAllowedSlots(dateStr, slots) {
  if (!dateStr) return slots;
  const day = new Date(dateStr + 'T00:00:00').getDay();
  if (day === 5) return slots.filter((s) => timeToMins(s) <= timeToMins('14:00'));
  if (day === 6) return slots.filter((s) => timeToMins(s) >= timeToMins('19:00'));
  return slots;
}

function isDateUnavailable() { return false; }

export default function DateTimeStep({ lang, service, date, time, onDateChange, onTimeChange, onNext, onBack }) {
  const t = BOOKING_MODAL;
  const [bookedSlots, setBookedSlots] = useState([]);
  const [extraSlots, setExtraSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedHour, setSelectedHour] = useState(() => time ? time.split(':')[0] : null);
  const minuteSectionRef = useRef(null);

  const durationMins = service?.durationMins ?? 60;
  const availableSlots = getFilteredSlots(durationMins);
  const minDate = today(getLocalTimeZone()).add({ days: 1 });
  const maxDate = today(getLocalTimeZone()).add({ days: 14 });
  const calendarValue = date ? parseDate(date) : null;

  useEffect(() => {
    setSelectedHour(null);
  }, [date]);

  // Scroll minute section into view after hour selection
  useEffect(() => {
    if (selectedHour && minuteSectionRef.current) {
      minuteSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedHour]);

  function tryNextDay() {
    if (!date) return;
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  }

  useEffect(() => {
    setBookedSlots([]);
    setExtraSlots([]);
    if (!date) return;

    const url = import.meta.env.VITE_APPS_SCRIPT_URL;
    if (!url) return;

    const controller = new AbortController();
    setLoadingSlots(true);

    fetch(`${url}?action=checkSlots&date=${date}&duration=${durationMins}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setBookedSlots(data.bookedSlots ?? []);
        setExtraSlots(data.extraSlots ?? []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setBookedSlots([]);
          setExtraSlots([]);
        }
      })
      .finally(() => setLoadingSlots(false));

    return () => controller.abort();
  }, [date]);

  const validExtra = extraSlots.filter((s) => timeToMins(s) + durationMins <= 20 * 60);
  const allSlots = getDayAllowedSlots(date, [...new Set([...availableSlots, ...validExtra])].sort());
  const freeSlots = allSlots.filter((s) => !bookedSlots.includes(s));

  // Derived from allSlots so duration + day constraints are already applied
  const uniqueHours = [...new Set(allSlots.map((s) => s.split(':')[0]))];
  const minutesForHour = (h) => allSlots.filter((s) => s.split(':')[0] === h).map((s) => s.split(':')[1]);
  const freeMinutesForHour = (h) => freeSlots.filter((s) => s.split(':')[0] === h).map((s) => s.split(':')[1]);

  function handleHourClick(h) {
    // Second click on same hour deselects
    if (selectedHour === h) {
      setSelectedHour(null);
      onTimeChange('');
      return;
    }
    setSelectedHour(h);
    if (time && time.split(':')[0] !== h) onTimeChange('');
  }

  function handleMinuteClick(m) {
    onTimeChange(`${selectedHour}:${m}`);
  }

  const canNext = date && time && !loadingSlots;

  return (
    <div className={styles.root}>
      <h2 className="bm-step-title">
        {lang === 'en' ? t.steps[1].labelEn : t.steps[1].labelHe}
      </h2>

      <div className={styles.field}>
        <label className={styles.label}>
          {lang === 'en' ? t.dateLabelEn : t.dateLabelHe}
        </label>
        <DatePicker
          value={calendarValue}
          minValue={minDate}
          maxValue={maxDate}
          isDateUnavailable={isDateUnavailable}
          onChange={(val) => val && onDateChange(val.toString())}
        >
          <FieldGroup className={styles.dateInput}>
            <DateInput className="flex-1" variant="ghost" />
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <CalendarIcon className="size-4" />
            </Button>
          </FieldGroup>
          <DatePickerContent>
            <Calendar>
              <CalendarHeading />
              <CalendarGrid>
                <CalendarGridHeader>
                  {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => <CalendarCell date={date} />}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </DatePickerContent>
        </DatePicker>
      </div>

      {date && (
        <div className={styles.field}>
          <label className={styles.label}>
            {lang === 'en' ? t.timeLabelEn : t.timeLabelHe}
          </label>

          {loadingSlots ? (
            <div className={styles.slotGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.slotSkeleton} />
              ))}
            </div>
          ) : freeSlots.length === 0 ? (
            <div className={styles.noSlots}>
              <p>{lang === 'en' ? t.noSlotsEn : t.noSlotsHe}</p>
              <button type="button" className={styles.nextDayBtn} onClick={tryNextDay}>
                {lang === 'en' ? 'Try next available day →' : 'נסי את היום הבא →'}
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: pick hour */}
              <div className={styles.slotGrid} role="group" aria-label={lang === 'en' ? 'Select hour' : 'בחרי שעה'}>
                {uniqueHours.map((h) => {
                  const isDisabled = freeMinutesForHour(h).length === 0;
                  const isSelected = selectedHour === h;
                  const hourNum = parseInt(h, 10);
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={isDisabled}
                      aria-pressed={isSelected}
                      aria-label={
                        lang === 'en'
                          ? `${hourNum}:00${isDisabled ? ', fully booked' : ''}`
                          : `שעה ${hourNum}${isDisabled ? ', מלא' : ''}`
                      }
                      className={[
                        styles.slot,
                        isSelected ? styles.slotSelected : '',
                        isDisabled ? styles.slotBooked : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => handleHourClick(h)}
                    >
                      {hourNum}:00
                    </button>
                  );
                })}
              </div>

              {/* Step 2: pick minute */}
              {selectedHour && (
                <div
                  className={styles.minuteSection}
                  ref={minuteSectionRef}
                  role="region"
                  aria-label={
                    lang === 'en'
                      ? `Minutes for ${parseInt(selectedHour, 10)}`
                      : `דקות לשעה ${parseInt(selectedHour, 10)}`
                  }
                  aria-live="polite"
                >
                  <div className={styles.minuteGrid}>
                    {minutesForHour(selectedHour).map((m) => {
                      const slotKey = `${selectedHour}:${m}`;
                      const isFree = freeSlots.includes(slotKey);
                      const isSelected = time === slotKey;
                      const hourNum = parseInt(selectedHour, 10);
                      return (
                        <button
                          key={m}
                          type="button"
                          disabled={!isFree}
                          aria-pressed={isSelected}
                          aria-label={
                            lang === 'en'
                              ? `${hourNum}:${m}${!isFree ? ', booked' : ''}`
                              : `${hourNum}:${m}${!isFree ? ', תפוס' : ''}`
                          }
                          className={[
                            styles.slot,
                            isSelected ? styles.slotSelected : '',
                            !isFree ? styles.slotBooked : '',
                          ].filter(Boolean).join(' ')}
                          onClick={() => isFree && handleMinuteClick(m)}
                        >
                          {hourNum}:{m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <p className={styles.cancellationNote}>
        {lang === 'en'
          ? 'Cancellations or changes made less than 24 hours before the appointment will be charged ₪100.'
          : 'ביטול או שינוי שיתבצעו פחות מ-24 שעות לפני מועד התור יחויבו בתשלום של 100 ש״ח.'}
      </p>

      <div className="bm-nav">
        <button className="bm-btn-ghost" onClick={onBack} type="button">
          {lang === 'en' ? `← ${t.backEn}` : `→ ${t.backHe}`}
        </button>
        <button
          className="bm-btn-primary"
          onClick={onNext}
          disabled={!canNext}
          type="button"
        >
          {lang === 'en' ? `${t.nextEn} →` : `${t.nextHe} ←`}
        </button>
      </div>
    </div>
  );
}
