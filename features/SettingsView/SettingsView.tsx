"use client";

import classnames from "classnames";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBell,
  HiOutlineBuildingLibrary,
  HiOutlineChevronRight,
  HiOutlineLockClosed,
  HiOutlineMoon,
  HiOutlinePencil,
  HiOutlineQuestionMarkCircle,
  HiOutlineShare,
  HiOutlineUser,
} from "react-icons/hi2";
import { Avatar } from "@/components/Avatar/Avatar";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import styles from "./SettingsView.module.css";

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ "aria-hidden"?: boolean }>;
  badge?: boolean;
}

const menuItems: MenuItem[] = [
  { label: "Personal Info", icon: HiOutlineUser },
  { label: "Security & PIN", icon: HiOutlineLockClosed },
  { label: "Bank Accounts", icon: HiOutlineBuildingLibrary },
  { label: "Export Ledger (CSV)", icon: HiOutlineShare },
  { label: "Notifications", icon: HiOutlineBell, badge: true },
  { label: "Help & Support", icon: HiOutlineQuestionMarkCircle },
];

export const SettingsView = () => {
  const { theme, profile, setTheme } = usePreferencesStore();
  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <div className={styles.settings_root}>
      <section className={styles.settings_profile}>
        <div className={styles.settings_avatarRing}>
          <Avatar name={profile.name} color="var(--emerald-900)" size="xl" />
          <button
            type="button"
            aria-label="Edit profile photo"
            className={styles.settings_avatarEdit}
          >
            <HiOutlinePencil aria-hidden />
          </button>
        </div>
        <h1 className={styles.settings_name}>{profile.name}</h1>
        <span className={styles.settings_premiumBadge}>
          <span className={styles.settings_premiumDot} aria-hidden />
          Verified Member
        </span>
      </section>

      <section className={styles.settings_themeCard}>
        <div className={styles.settings_themeIcon} aria-hidden>
          <HiOutlineMoon />
        </div>
        <div className={styles.settings_themeText}>
          <span className={styles.settings_themeLabel}>Dark Mode</span>
          <span className={styles.settings_themeHint}>Switch theme</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label="Toggle dark mode"
          onClick={toggleTheme}
          className={classnames(styles.settings_switch, {
            [styles["settings_switch-on"]]: isDark,
          })}
        >
          <span className={styles.settings_switchKnob} aria-hidden />
        </button>
      </section>

      <nav className={styles.settings_menu} aria-label="Settings">
        <ul className={styles.settings_menuList}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button type="button" className={styles.settings_menuRow}>
                  <span className={styles.settings_menuIcon} aria-hidden>
                    <Icon />
                  </span>
                  <span className={styles.settings_menuLabel}>{item.label}</span>
                  {item.badge ? (
                    <span className={styles.settings_menuBadge} aria-hidden />
                  ) : null}
                  <HiOutlineChevronRight
                    aria-hidden
                    className={styles.settings_menuChevron}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <button type="button" className={styles.settings_logout}>
        <HiOutlineArrowRightOnRectangle aria-hidden />
        Logout Account
      </button>

      <p className={styles.settings_version}>v2.4.1</p>
    </div>
  );
};
