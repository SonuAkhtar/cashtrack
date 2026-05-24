import { ReactNode } from "react";
import styles from "./template.module.css";

export default function Template({ children }: { children: ReactNode }) {
  return <div className={styles.template_page}>{children}</div>;
}
