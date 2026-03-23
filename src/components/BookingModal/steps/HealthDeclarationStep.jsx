import { useState } from 'react';
import { BOOKING_MODAL } from '../../../data/content';
import styles from './HealthDeclarationStep.module.css';

const HEALTH_FORM_URL = 'https://forms.gle/3zr4fJ9S298TUsScA';

export default function HealthDeclarationStep({ lang, onDone }) {
  const t = BOOKING_MODAL;
  const [filledBefore, setFilledBefore] = useState(null); // null | 'yes' | 'no'
  const [changedSince, setChangedSince] = useState(null);  // null | 'yes' | 'no'

  const needsForm =
    filledBefore === 'no' ||
    (filledBefore === 'yes' && changedSince === 'yes');

  const canProceedDirectly =
    filledBefore === 'yes' && changedSince === 'no';

  return (
    <div className={styles.root}>
      <h2 className="bm-step-title">
        {lang === 'en' ? t.healthTitleEn : t.healthTitleHe}
      </h2>

      {/* Q1 */}
      <div className={styles.question}>
        <p className={styles.questionText}>
          {lang === 'en' ? t.healthQ1En : t.healthQ1He}
        </p>
        <div className={styles.btnRow}>
          <button
            type="button"
            className={[
              styles.choiceBtn,
              filledBefore === 'yes' ? styles.choiceBtnActive : '',
            ].filter(Boolean).join(' ')}
            onClick={() => { setFilledBefore('yes'); setChangedSince(null); }}
          >
            {lang === 'en' ? t.healthYesEn : t.healthYesHe}
          </button>
          <button
            type="button"
            className={[
              styles.choiceBtn,
              filledBefore === 'no' ? styles.choiceBtnActive : '',
            ].filter(Boolean).join(' ')}
            onClick={() => { setFilledBefore('no'); setChangedSince(null); }}
          >
            {lang === 'en' ? t.healthNoEn : t.healthNoHe}
          </button>
        </div>
      </div>

      {/* Q2 — only when filledBefore === 'yes' */}
      {filledBefore === 'yes' && (
        <div className={styles.question}>
          <p className={styles.questionText}>
            {lang === 'en' ? t.healthQ2En : t.healthQ2He}
          </p>
          <div className={styles.btnRow}>
            <button
              type="button"
              className={[
                styles.choiceBtn,
                changedSince === 'yes' ? styles.choiceBtnActive : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setChangedSince('yes')}
            >
              {lang === 'en' ? t.healthYesEn : t.healthYesHe}
            </button>
            <button
              type="button"
              className={[
                styles.choiceBtn,
                changedSince === 'no' ? styles.choiceBtnActive : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setChangedSince('no')}
            >
              {lang === 'en' ? t.healthNoEn : t.healthNoHe}
            </button>
          </div>
        </div>
      )}

      {/* Form link block */}
      {needsForm && (
        <div className={styles.formBlock}>
          <p className={styles.note}>
            {lang === 'en' ? t.healthNoteEn : t.healthNoteHe}
          </p>
          <a
            href={HEALTH_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bm-btn-primary"
          >
            {lang === 'en' ? t.healthFillBtnEn : t.healthFillBtnHe}
          </a>
          <button
            type="button"
            className="bm-btn-ghost"
            onClick={onDone}
          >
            {lang === 'en' ? t.healthDoneBtnEn : t.healthDoneBtnHe}
          </button>
        </div>
      )}

      {/* Skip directly */}
      {canProceedDirectly && (
        <div className={styles.formBlock}>
          <button
            type="button"
            className="bm-btn-primary"
            onClick={onDone}
          >
            {lang === 'en' ? t.healthSkipBtnEn : t.healthSkipBtnHe}
          </button>
        </div>
      )}
    </div>
  );
}
