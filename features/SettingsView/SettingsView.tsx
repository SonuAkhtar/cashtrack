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
import styles from "./SettingsView.module.css";

export const SettingsView = () => {
  const { theme, notifications, profile, setTheme, toggleNotification } =
    usePreferencesStore();

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <motion.div
      className={styles.settings_root}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
    >
      <header className={styles.settings_header}>
        <h1 className={styles.settings_title}>Settings</h1>
        <p className={styles.settings_subtitle}>Manage your preferences</p>
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

      <Card variant="raised" className={styles.settings_section}>
        <SectionHeader title="Appearance" subtitle="Switch between light and dark" />
        <div className={styles.settings_themeRow}>
          <div className={styles.settings_themeText}>
            <span className={styles.settings_themeLabel}>
              {isDark ? "Dark mode" : "Light mode"}
            </span>
            <span className={styles.settings_themeHint}>
              {isDark ? "Easier on the eyes at night" : "Daytime clarity"}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={classnames(styles.settings_themeSwitch, {
              [styles["settings_themeSwitch-on"]]: isDark,
            })}
          >
            <HiOutlineSun
              aria-hidden
              className={`${styles.settings_themeSwitchIcon} ${styles["settings_themeSwitchIcon-sun"]}`}
            />
            <HiOutlineMoon
              aria-hidden
              className={`${styles.settings_themeSwitchIcon} ${styles["settings_themeSwitchIcon-moon"]}`}
            />
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className={styles.settings_themeSwitchKnob}
              aria-hidden
            >
              {isDark ? <HiOutlineMoon /> : <HiOutlineSun />}
            </motion.span>
          </button>
        </div>
      </Card>

      <footer className={styles.settings_footer}>
        <span className={styles.settings_version}>CashTrack v0.1.0</span>
      </footer>
    </motion.div>
  );
};
