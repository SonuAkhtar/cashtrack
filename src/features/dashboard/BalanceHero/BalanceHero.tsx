"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/Icon/Icon";
import { useCurrency } from "@/hooks/useCurrency";
import { useUIStore } from "@/store/uiStore";
import styles from "./BalanceHero.module.scss";

interface BalanceHeroProps {
  balance: number;
  recovered: number;
  lent: number;
  recoveredDelta: number;
  lentDelta: number;
}

const formatDelta = (value: number): string => `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}%`;

export const BalanceHero = ({ balance, recovered, lent, recoveredDelta, lentDelta }: BalanceHeroProps) => {
  const { symbol, currency, format } = useCurrency();
  const openModal = useUIStore((s) => s.openModal);

  const whole = Math.floor(balance).toLocaleString("en-US");
  const cents = (balance - Math.floor(balance)).toFixed(2).slice(1);

  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.top}>
        <div>
          <span className={styles.label}>Total outstanding</span>
          <p className={styles.balance}>
            {symbol}
            {whole}
            <span className={styles.cents}>{cents}</span>
          </p>
        </div>
        <span className={styles.currency} aria-label={`Currency: ${currency}`}>
          {symbol}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles["btn--collect"]}`}
          onClick={() => openModal({ type: "transaction", defaultType: "repayment" })}
        >
          <Icon name="arrow-down" size={20} strokeWidth={2.4} />
          Collect
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles["btn--lend"]}`}
          onClick={() => openModal({ type: "transaction", defaultType: "lend" })}
        >
          <Icon name="arrow-up" size={20} strokeWidth={2.4} />
          Lend
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.stat__head}>
            <span className={styles.stat__label}>Recovered</span>
            <span className={`${styles.stat__icon} ${styles["stat__icon--in"]}`}>
              <Icon name="arrow-down" size={16} />
            </span>
          </div>
          <strong className={styles.stat__value}>{format(recovered)}</strong>
          <span className={`${styles.stat__delta} ${styles["stat__delta--up"]}`}>{formatDelta(recoveredDelta)}</span>
        </div>

        <div className={styles.stat}>
          <div className={styles.stat__head}>
            <span className={styles.stat__label}>Lent</span>
            <span className={`${styles.stat__icon} ${styles["stat__icon--out"]}`}>
              <Icon name="arrow-up" size={16} />
            </span>
          </div>
          <strong className={styles.stat__value}>{format(lent)}</strong>
          <span className={`${styles.stat__delta} ${styles["stat__delta--down"]}`}>{formatDelta(lentDelta)}</span>
        </div>
      </div>
    </motion.section>
  );
};
