"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/utils/cn";
import styles from "./Onboarding.module.scss";

interface Step {
  key: "name" | "email" | "phone";
  title: string;
  subtitle: string;
  placeholder: string;
  type: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
}

const steps: Step[] = [
  {
    key: "name",
    title: "What should we call you?",
    subtitle: "We'll use this on your dashboard greeting.",
    placeholder: "Your name",
    type: "text",
    inputMode: "text",
    autoComplete: "given-name",
  },
  {
    key: "email",
    title: "Add your email",
    subtitle: "Used for backups and reminders. You can change it later.",
    placeholder: "you@example.com",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  },
  {
    key: "phone",
    title: "Your phone number",
    subtitle: "Helps you sync between devices in the future.",
    placeholder: "+91 98765 43210",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
  },
];

export const Onboarding = () => {
  const setProfile = useSettingsStore((s) => s.setProfile);
  const complete = useSettingsStore((s) => s.completeOnboarding);

  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<Step["key"], string>>({
    name: "",
    email: "",
    phone: "",
  });

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const value = values[step.key];
  const canProceed = value.trim().length > 0;

  const writeValue = (key: Step["key"], next: string) =>
    setValues((prev) => ({ ...prev, [key]: next }));

  const finish = (final: Record<Step["key"], string>) => {
    setProfile({
      name: final.name.trim() || "CashTrack User",
      email: final.email.trim(),
      phone: final.phone.trim(),
    });
    complete();
  };

  const advance = () => {
    if (isLast) finish(values);
    else setStepIndex((i) => i + 1);
  };

  const next = () => {
    if (!canProceed) return;
    advance();
  };

  const skip = () => {
    const cleared = { ...values, [step.key]: "" };
    setValues(cleared);
    if (isLast) finish(cleared);
    else setStepIndex((i) => i + 1);
  };

  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.progress}>
        {steps.map((s, i) => (
          <span
            key={s.key}
            className={cn(
              styles.progress__seg,
              i <= stepIndex && styles["progress__seg--on"]
            )}
          />
        ))}
      </div>

      <motion.div
        key={step.key}
        className={styles.body}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className={styles.title}>{step.title}</h1>
        <p className={styles.subtitle}>{step.subtitle}</p>

        <input
          key={step.key}
          autoFocus
          className={styles.input}
          type={step.type}
          inputMode={step.inputMode}
          autoComplete={step.autoComplete}
          value={value}
          onChange={(e) => writeValue(step.key, e.target.value)}
          placeholder={step.placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canProceed) next();
          }}
        />
      </motion.div>

      <div className={styles.footer}>
        <button type="button" className={styles.skip} onClick={skip}>
          Skip
        </button>
        <button
          type="button"
          className={styles.next}
          onClick={next}
          disabled={!canProceed}
        >
          {isLast ? "Get started" : "Next"}
        </button>
      </div>
    </motion.div>
  );
};
