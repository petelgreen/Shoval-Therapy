import { BOOKING_MODAL } from '../../../data/content';
import styles from './DepositStep.module.css';

const BIT_PHONE = import.meta.env.VITE_BIT_PHONE || '';
const PAYMENT_LINK_CC = import.meta.env.VITE_PAYMENT_LINK_CC || '';

export default function DepositStep({ lang, onPaid }) {
  const t = BOOKING_MODAL;
  const isHe = lang !== 'en';

  return (
    <div className={styles.root}>
      <div className={styles.amountBlock}>
        <h2 className="bm-step-title">
          {isHe ? t.depositTitleHe : t.depositTitleEn}
        </h2>
        <div className={styles.amountRow}>
          <span className={styles.amountLabel}>
            {isHe ? t.depositSubHe : t.depositSubEn}
          </span>
          <span className={styles.amount}>
            {isHe ? t.depositAmountHe : t.depositAmountEn}
          </span>
        </div>
      </div>

      {/* Cancellation policy */}
      <div className={styles.policyCard}>
        <p className={styles.policyTitle}>
          {isHe ? t.depositPolicyTitleHe : t.depositPolicyTitleEn}
        </p>
        <ul className={styles.policyList}>
          <li>{isHe ? t.depositPolicy1He : t.depositPolicy1En}</li>
          <li>{isHe ? t.depositPolicy2He : t.depositPolicy2En}</li>
          <li>{isHe ? t.depositPolicy3He : t.depositPolicy3En}</li>
        </ul>
      </div>

      {/* Payment options */}
      <div className={styles.options}>
        {/* Bit — QR code */}
        <div className={styles.optionCard}>
          <div className={styles.optionHeader}>
            <span className={styles.optionIcon}>
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" width="32" height="32">
                <circle cx="20" cy="20" r="20" fill="#005AC3"/>
                <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">bit</text>
              </svg>
            </span>
            <span className={styles.optionTitle}>
              {isHe ? t.depositBitTitleHe : t.depositBitTitleEn}
            </span>
          </div>
          <p className={styles.optionNote}>
            {isHe ? t.depositBitNoteHe : t.depositBitNoteEn}
          </p>
          {BIT_PHONE && (
            <p className={styles.phoneDisplay}>{BIT_PHONE}</p>
          )}
        </div>

        {/* Credit card */}
        {PAYMENT_LINK_CC && (
          <div className={styles.optionCard}>
            <div className={styles.optionHeader}>
              <span className={styles.optionIcon}>
                <svg viewBox="0 0 32 24" fill="none" aria-hidden="true" width="32" height="24">
                  <rect width="32" height="24" rx="4" fill="#1a1a2e"/>
                  <rect y="6" width="32" height="6" fill="#e63946"/>
                  <rect x="4" y="16" width="8" height="3" rx="1" fill="#ffd166"/>
                </svg>
              </span>
              <span className={styles.optionTitle}>
                {isHe ? t.depositCardTitleHe : t.depositCardTitleEn}
              </span>
            </div>
            <p className={styles.optionNote}>
              {isHe ? t.depositCardNoteHe : t.depositCardNoteEn}
            </p>
            <a
              href={PAYMENT_LINK_CC}
              target="_blank"
              rel="noopener noreferrer"
              className="bm-btn-ghost"
            >
              {isHe ? t.depositCardBtnHe : t.depositCardBtnEn}
            </a>
          </div>
        )}
      </div>

      {/* Confirm button */}
      <div className={styles.footer}>
        <button
          type="button"
          className="bm-btn-primary"
          onClick={() => onPaid()}
        >
          {isHe ? t.depositConfirmBtnHe : t.depositConfirmBtnEn}
        </button>
        <p className={styles.verifyNote}>
          {isHe ? t.depositVerifyNoteHe : t.depositVerifyNoteEn}
        </p>
      </div>
    </div>
  );
}
