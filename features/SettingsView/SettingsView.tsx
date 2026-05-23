"use client";

import { motion } from "framer-motion";
import classnames from "classnames";
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineCloudArrowUp,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { Card } from "@/components/Card/Card";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { Toggle } from "@/components/Toggle/Toggle";
import { Button } from "@/components/Button/Button";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import type { AppPreferences } from "@/types";
import styles from "./SettingsView.module.css";

const THEME_OPTIONS: {
  value: AppPreferences["theme"];
  label: string;
  hint: string;
  Icon: typeof HiOutlineSun;
}[] = [
  { value: "light", label: "Light", hint: "Daytime clarity", Icon: HiOutlineSun },
  { value: "dark", label: "Dark", hint: "Easier on the eyes", Icon: HiOutlineMoon },
];

export const SettingsView = () => {
  const { theme, notifications, profile, setTheme, toggleNotification } =
    usePreferencesStore();

  return (
    <motion.div
      className={styles.settings_root}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      <header className={styles.settings_header}>
        <h1 className={styles.settings_title}>Settings</h1>
        <p className={styles.settings_subtitle}>
          Manage your preferences
        </p>
      </header>

      <Card variant="raised" className={styles.settings_profile}>
        <div className={styles.settings_profileTop}>
          <Avatar name={profile.name} color="#34d399" size="xl" />
          <div className={styles.settings_profileMeta}>
            <span className={styles.settings_profileName}>{profile.name}</span>
            <span className={styles.settings_profileEmail}>{profile.email}</span>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          Edit profile
        </Button>
      </Card>

      <Card variant="raised" className={styles.settings_section}>
        <SectionHeader title="Appearance" subtitle="Choose your preferred theme" />
        <div
          className={styles.settings_themeSwitch}
          role="radiogroup"
          aria-label="Theme"
        >
          {THEME_OPTIONS.map(({ value, label, hint, Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(value)}
                className={classnames(styles.settings_themeOption, {
                  [styles["settings_themeOption-active"]]: active,
                })}
              >
                {active && (
                  <motion.span
                    layoutId="settings-theme-pill"
                    className={styles.settings_themePill}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden
                  />
                )}
                <span className={styles.settings_themeIcon} aria-hidden>
                  <Icon />
                </span>
                <span className={styles.settings_themeMeta}>
                  <span className={styles.settings_themeLabel}>{label}</span>
                  <span className={styles.settings_themeHint}>{hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card variant="raised" className={styles.settings_section}>
        <SectionHeader title="Notifications" subtitle="Stay on top of repayments" />
        <div className={styles.settings_toggleStack}>
          <Toggle
            label="Due date reminders"
            description="Get notified before a payment is due"
            checked={notifications.dueReminders}
            onChange={() => toggleNotification("dueReminders")}
          />
          <Toggle
            label="Weekly digest"
            description="Summary of activity every Monday"
            checked={notifications.weeklyDigest}
            onChange={() => toggleNotification("weeklyDigest")}
          />
          <Toggle
            label="Payment received"
            description="Confirm when a repayment is logged"
            checked={notifications.paymentReceived}
            onChange={() => toggleNotification("paymentReceived")}
          />
        </div>
      </Card>

      <Card variant="raised" className={styles.settings_section}>
        <SectionHeader
          title="Data"
          subtitle="Export, import, and backup options"
        />
        <div className={styles.settings_dataGrid}>
          <Button
            variant="secondary"
            iconLeft={<HiOutlineArrowDownTray aria-hidden />}
            block
          >
            Export data
          </Button>
          <Button
            variant="secondary"
            iconLeft={<HiOutlineArrowUpTray aria-hidden />}
            block
          >
            Import data
          </Button>
          <Button
            variant="ghost"
            iconLeft={<HiOutlineCloudArrowUp aria-hidden />}
            block
          >
            Cloud backup
          </Button>
        </div>
        <p className={styles.settings_dataHint}>
          Backend sync will be available in a future update.
        </p>
      </Card>

      <footer className={styles.settings_footer}>
        <span className={styles.settings_version}>CashTrack v0.1.0</span>
      </footer>
    </motion.div>
  );
};
