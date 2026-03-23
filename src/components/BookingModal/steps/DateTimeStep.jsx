import { useState, useEffect } from 'react';
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
  return AVAILABLE_SLOTS.filter((slot) => {
    return timeToMins(slot) + durationMins <= 22 * 60;
  });
}

function getDayAllowedSlots(dateStr, slots) {
  if (!dateStr) return slots;
  const day = new Date(dateStr + 'T00:00:00').getDay(); // 5=Fri, 6=Sat
  if (day === 5) return slots.filter((s) => timeToMins(s) <= timeToMins('14:00'));
  if (day === 6) return slots.filter((s) => timeToMins(s) >= timeToMins('19:00'));
  return slots;
}


function isDateUnavailable() {
  return false;
}

export default function DateTimeStep({ lang, service, date, time, onDateChange, onTimeChange, onNext, onBack }) {
  const t = BOOKING_MODAL;
  const [bookedSlots, setBookedSlots] = useState([]);
  const [extraSlots, setExtraSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const durationMins = service?.durationMins ?? 60;
  const availableSlots = getFilteredSlots(durationMins);
  const minDate = today(getLocalTimeZone()).add({ days: 1 });
  const maxDate = today(getLocalTimeZone()).add({ days: 14 });
  const calendarValue = date ? parseDate(date) : null;

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

    fetch(`${url}?action=checkSlots&date=${date}`, { signal: controller.signal })
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
  const canNext = date && time && !loadingSlots;

  return (
    <div className={styles.root}>
      <h2 className="bm-step-title">
        {lang === 'en' ? t.steps[1].labelEn : t.steps[1].labelHe}
      </h2>

      {/* Date picker */}
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

      {/* Time slots */}
      {date && (
        <div className={styles.field}>
          <label className={styles.label}>
            {lang === 'en' ? t.timeLabelEn : t.timeLabelHe}
          </label>

          {loadingSlots ? (
            <div className={styles.slotGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.slotSkeleton} />
              ))}
            </div>
          ) : freeSlots.length === 0 ? (
            <div className={styles.noSlots}>
              <p>{lang === 'en' ? t.noSlotsEn : t.noSlotsHe}</p>
              <button
                type="button"
                className={styles.nextDayBtn}
                onClick={tryNextDay}
              >
                {lang === 'en' ? 'Try next available day →' : 'נסי את היום הבא →'}
              </button>
            </div>
          ) : (
            <div className={styles.slotGrid}>
              {allSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isUnavailable = !freeSlots.includes(slot);
                const isSelected = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isUnavailable}
                    className={[
                      styles.slot,
                      isSelected ? styles.slotSelected : '',
                      isBooked ? styles.slotBooked : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => !isUnavailable && onTimeChange(slot)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
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
