import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import styles from "./offline/offline.module.scss";

export default function NotFound() {
  return (
    <div className={styles.screen}>
      <span className={styles.icon}>
        <Icon name="search" size={36} />
      </span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you are looking for does not exist or has moved.</p>
      <Link href="/" className={styles.text} style={{ color: "var(--primary)", fontWeight: 600 }}>
        Back to overview
      </Link>
    </div>
  );
}
