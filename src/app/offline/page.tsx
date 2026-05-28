import { Icon } from "@/components/Icon/Icon";
import styles from "./offline.module.scss";

export default function OfflinePage() {
  return (
    <div className={styles.screen}>
      <span className={styles.icon}>
        <Icon name="offline" size={36} />
      </span>
      <h1 className={styles.title}>You are offline</h1>
      <p className={styles.text}>
        CashTrack works offline once loaded. Reconnect to sync the latest, or keep using your saved
        data right here.
      </p>
    </div>
  );
}
