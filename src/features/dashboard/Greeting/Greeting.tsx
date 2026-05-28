"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { useSettingsStore } from "@/store/settingsStore";
import styles from "./Greeting.module.scss";

interface GreetingMeta {
  label: string;
  icon: IconName;
}

const resolveGreeting = (hour: number): GreetingMeta => {
  if (hour < 5) return { label: "Good night", icon: "moon" };
  if (hour < 12) return { label: "Good morning", icon: "sun" };
  if (hour < 17) return { label: "Good afternoon", icon: "sun" };
  if (hour < 21) return { label: "Good evening", icon: "moon" };
  return { label: "Good night", icon: "moon" };
};

const firstName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed || trimmed === "CashTrack User") return "there";
  return trimmed.split(/\s+/)[0];
};

interface GreetingProps {
  date: string;
}

export const Greeting = ({ date }: GreetingProps) => {
  const profileName = useSettingsStore((s) => s.profileName);
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  const meta = resolveGreeting(hour ?? 9);
  const name = firstName(profileName);

  return (
    <motion.div
      className={styles.greeting}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className={styles.title}>
        {meta.label}, <span className={styles.name}>{name}</span>
      </h1>
      <span className={styles.meta}>
        <span className={styles.badgeIcon} data-icon={meta.icon}>
          <Icon name={meta.icon} size={15} strokeWidth={2.1} />
        </span>
        {date}
      </span>
    </motion.div>
  );
};
