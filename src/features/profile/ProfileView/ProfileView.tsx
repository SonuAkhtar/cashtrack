"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Card } from "@/components/Card/Card";
import { Avatar } from "@/components/Avatar/Avatar";
import { Button } from "@/components/Button/Button";
import { Sheet } from "@/components/Sheet/Sheet";
import { Field, Input } from "@/components/Field/Field";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { Toggle } from "@/features/profile/Toggle/Toggle";
import { APP_VERSION } from "@/constants";
import { useDashboardData } from "@/hooks/useLedgers";
import { useCurrency } from "@/hooks/useCurrency";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/hooks/useToast";
import { useUIStore } from "@/store/uiStore";
import { exportData, importData, resetData } from "@/services/backupService";
import { useQueryClient } from "@tanstack/react-query";
import { createBackup, downloadBackup, parseBackup } from "@/utils/backup";
import styles from "./ProfileView.module.scss";

export const ProfileView = () => {
  const { resolved, setTheme } = useTheme();
  const pinEnabled = useSettingsStore((s) => s.pinEnabled);
  const togglePin = useSettingsStore((s) => s.togglePin);
  const biometricEnabled = useSettingsStore((s) => s.biometricEnabled);
  const toggleBiometric = useSettingsStore((s) => s.toggleBiometric);
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const toggleReminders = useSettingsStore((s) => s.toggleReminders);
  const profileName = useSettingsStore((s) => s.profileName);
  const profileEmail = useSettingsStore((s) => s.profileEmail);
  const profilePhoto = useSettingsStore((s) => s.profilePhoto);
  const setProfile = useSettingsStore((s) => s.setProfile);
  const setProfilePhoto = useSettingsStore((s) => s.setProfilePhoto);

  const { summary } = useDashboardData();
  const { format: money } = useCurrency();

  const toast = useToast();
  const client = useQueryClient();
  const openModal = useUIStore((s) => s.openModal);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profileName);
  const [email, setEmail] = useState(profileEmail);

  const startEditing = () => {
    setName(profileName);
    setEmail(profileEmail);
    setEditing(true);
  };

  const handlePhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 320;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setProfilePhoto(canvas.toDataURL("image/jpeg", 0.82));
        toast.success("Photo updated");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Name can't be empty");
      return;
    }
    setProfile({ name: trimmed, email: email.trim() });
    setEditing(false);
    toast.success("Profile updated");
  };

  const handleExport = async () => {
    const { people, transactions } = await exportData();
    if (people.length === 0 && transactions.length === 0) {
      toast.error("Nothing to export yet");
      return;
    }
    downloadBackup(createBackup(people, transactions));
    toast.success("Backup downloaded");
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const backup = parseBackup(text);
      await importData(backup, true);
      await client.invalidateQueries();
      toast.success(`Imported ${backup.people.length} borrowers`);
    } catch {
      toast.error("Invalid backup file");
    }
  };

  const confirmReset = () =>
    openModal({
      type: "confirm",
      title: "Reset all data?",
      message: "This permanently deletes every borrower and transaction on this device.",
      confirmLabel: "Reset",
      onConfirm: async () => {
        await resetData();
        await client.invalidateQueries();
        toast.success("All data cleared");
      },
    });

  return (
    <div className={styles.page}>
      <PageHeader
        icon="user"
        tone="primary"
        title="Profile"
        subtitle="Your account, data & app preferences"
        stats={[
          {
            label: "Borrowers",
            value: String(summary.activeBorrowers),
            icon: "people",
            tone: "neutral",
          },
          {
            label: "Lent",
            value: money(Math.round(summary.totalLent), { compact: true }),
            icon: "wallet",
            tone: "neutral",
          },
          {
            label: "Recovered",
            value: `${Math.round(summary.recoveryRate)}%`,
            icon: "trend-up",
            tone: "success",
          },
        ]}
      />

      <Card className={styles.hero} padding="lg">
        <div className={styles.hero__avatar}>
          <Avatar name={profileName || "User"} color="var(--primary)" src={profilePhoto || undefined} size="xl" />
          <button
            type="button"
            className={styles.hero__camera}
            onClick={() => photoRef.current?.click()}
            aria-label="Upload profile photo"
          >
            <Icon name="camera" size={14} />
          </button>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhoto(file);
              e.target.value = "";
            }}
          />
        </div>
        <div className={styles.hero__info}>
          <strong className={styles.hero__name}>{profileName || "Your name"}</strong>
          <span className={styles.hero__email}>{profileEmail || "Add your email"}</span>
          <Button variant="secondary" size="sm" icon="edit" className={styles.hero__edit} onClick={startEditing}>
            Edit profile
          </Button>
        </div>
      </Card>

      <Sheet
        open={editing}
        onClose={() => setEditing(false)}
        icon="user"
        tone="primary"
        title="Edit profile"
        description="Update your name and email."
        footer={
          <>
            <Button variant="ghost" fullWidth onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button fullWidth icon="check" onClick={saveProfile}>
              Save changes
            </Button>
          </>
        }
      >
        <div className={styles.editForm}>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoFocus />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
        </div>
      </Sheet>

      <Section title="Security">
        <Row icon="lock" label="PIN lock" hint="Require a PIN to open the app">
          <Toggle checked={pinEnabled} onChange={togglePin} label="PIN lock" />
        </Row>
        <Row icon="fingerprint" label="Biometric unlock" hint="Use Face ID or fingerprint">
          <Toggle checked={biometricEnabled} onChange={toggleBiometric} label="Biometric unlock" />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row icon="bell" label="Payment reminders" hint="Get notified about upcoming due dates">
          <Toggle checked={remindersEnabled} onChange={toggleReminders} label="Reminders" />
        </Row>
      </Section>

      <Section title="Data">
        <button className={styles.action} onClick={handleExport}>
          <span className={styles.action__icon}>
            <Icon name="download" size={18} />
          </span>
          <span className={styles.action__text}>
            <strong>Export backup</strong>
            <span>Download all data as a JSON file</span>
          </span>
          <Icon name="chevron-right" size={16} className={styles.action__chevron} />
        </button>

        <button className={styles.action} onClick={() => fileRef.current?.click()}>
          <span className={styles.action__icon}>
            <Icon name="upload" size={18} />
          </span>
          <span className={styles.action__text}>
            <strong>Import backup</strong>
            <span>Restore from a JSON file</span>
          </span>
          <Icon name="chevron-right" size={16} className={styles.action__chevron} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = "";
          }}
        />

        <button className={`${styles.action} ${styles["action--danger"]}`} onClick={confirmReset}>
          <span className={styles.action__icon}>
            <Icon name="trash" size={18} />
          </span>
          <span className={styles.action__text}>
            <strong>Reset data</strong>
            <span>Delete everything on this device</span>
          </span>
          <Icon name="chevron-right" size={16} className={styles.action__chevron} />
        </button>
      </Section>

      <Section title="Appearance">
        <Row label="App Theme">
          <Toggle
            checked={resolved === "dark"}
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
            label="App Theme"
            iconOff="sun"
            iconOn="moon"
          />
        </Row>
      </Section>

      <p className={styles.version}>CashTrack v{APP_VERSION}</p>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className={styles.section}>
    <h2 className={styles.section__title}>{title}</h2>
    <Card padding="none" className={styles.section__card}>
      {children}
    </Card>
  </section>
);

const Row = ({
  icon,
  label,
  hint,
  children,
}: {
  icon?: IconName;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className={styles.row}>
    {icon && (
      <span className={styles.row__icon}>
        <Icon name={icon} size={18} />
      </span>
    )}
    <span className={styles.row__text}>
      <strong>{label}</strong>
      {hint && <span>{hint}</span>}
    </span>
    <span className={styles.row__control}>{children}</span>
  </div>
);
