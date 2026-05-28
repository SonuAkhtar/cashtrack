"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/utils/cn";
import styles from "./Onboarding.module.scss";

interface Option {
  id: string;
  label: string;
  icon: IconName;
  tone: string;
}

interface Step {
  key: string;
  kind: "text" | "multi";
  title: string;
  placeholder?: string;
  options?: Option[];
}

const steps: Step[] = [
  {
    key: "name",
    kind: "text",
    title: "First up, what should we call you?",
    placeholder: "Your name",
  },
  {
    key: "track",
    kind: "multi",
    title: "Who do you mainly lend to?",
    options: [
      { id: "Personal", label: "Personal", icon: "user", tone: "primary" },
      { id: "Business", label: "Business", icon: "wallet", tone: "success" },
      { id: "Family", label: "Family", icon: "people", tone: "accent" },
      { id: "Friends", label: "Friends", icon: "star", tone: "warning" },
    ],
  },
  {
    key: "focus",
    kind: "multi",
    title: "What matters most to you?",
    options: [
      { id: "On-time repayments", label: "On-time repayments", icon: "check-circle", tone: "success" },
      { id: "Payment reminders", label: "Payment reminders", icon: "bell", tone: "primary" },
      { id: "Clear records", label: "Clear records", icon: "archive", tone: "accent" },
      { id: "Spending insights", label: "Spending insights", icon: "trend-up", tone: "info" },
    ],
  },
];

export const Onboarding = () => {
  const setProfile = useSettingsStore((s) => s.setProfile);
  const setProfileFocus = useSettingsStore((s) => s.setProfileFocus);
  const complete = useSettingsStore((s) => s.completeOnboarding);

  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("");
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const canProceed = step.kind === "text" ? name.trim().length > 0 : true;

  const toggleOption = (stepKey: string, id: string) =>
    setSelections((prev) => {
      const current = prev[stepKey] ?? [];
      const nextValues = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...prev, [stepKey]: nextValues };
    });

  const finish = () => {
    setProfile({ name: name.trim() || "CashTrack User", email: "" });
    setProfileFocus([...(selections.track ?? []), ...(selections.focus ?? [])]);
    complete();
  };

  const next = () => {
    if (!canProceed) return;
    if (isLast) finish();
    else setStepIndex((i) => i + 1);
  };

  return (
    <motion.div className={styles.screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className={styles.progress}>
        {steps.map((s, i) => (
          <span key={s.key} className={cn(styles.progress__seg, i <= stepIndex && styles["progress__seg--on"])} />
        ))}
      </div>

      <motion.div
        key={step.key}
        className={styles.body}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className={styles.title}>{step.title}</h1>

        {step.kind === "text" ? (
          <input
            autoFocus
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={step.placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") next();
            }}
          />
        ) : (
          <div className={styles.options}>
            {step.options!.map((opt) => {
              const selected = (selections[step.key] ?? []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={styles.option}
                  onClick={() => toggleOption(step.key, opt.id)}
                >
                  <span className={cn(styles.option__avatar, styles[`option__avatar--${opt.tone}`])}>
                    <Icon name={opt.icon} size={20} />
                  </span>
                  <span className={cn(styles.option__label, selected && styles["option__label--on"])}>
                    {opt.label}
                  </span>
                  <span className={cn(styles.option__check, selected && styles["option__check--on"])}>
                    {selected && <Icon name="check" size={14} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      <div className={styles.footer}>
        <button className={styles.next} onClick={next} disabled={!canProceed}>
          {isLast ? "Get started" : "Next"}
        </button>
      </div>
    </motion.div>
  );
};
