"use client";

import { cn } from "@/utils/cn";
import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

export const Skeleton = ({ width, height = 16, radius = 8, className }: SkeletonProps) => (
  <span
    className={cn(styles.skeleton, className)}
    style={{
      width: typeof width === "number" ? `${width}px` : width ?? "100%",
      height: typeof height === "number" ? `${height}px` : height,
      borderRadius: typeof radius === "number" ? `${radius}px` : radius,
    }}
  />
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn(styles.card, className)}>
    <div className={styles.card__row}>
      <Skeleton width={44} height={44} radius={14} />
      <div className={styles.card__lines}>
        <Skeleton width="55%" height={14} />
        <Skeleton width="35%" height={11} />
      </div>
      <Skeleton width={60} height={20} radius={999} />
    </div>
    <Skeleton height={8} radius={999} />
  </div>
);
