import type { CSSProperties } from "react";
import {
  Home,
  Users,
  Activity,
  Settings,
  CreditCard,
  User,
  Plus,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Star,
  Pencil,
  Trash2,
  Archive,
  Filter,
  ArrowUpDown,
  Sun,
  Moon,
  Phone,
  Mail,
  Tag,
  Download,
  Upload,
  Lock,
  Bell,
  Fingerprint,
  Command,
  RefreshCw,
  MoreVertical,
  Send,
  ArrowLeftRight,
  Camera,
  Shield,
  Sparkles,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "home"
  | "people"
  | "activity"
  | "settings"
  | "emi"
  | "user"
  | "plus"
  | "search"
  | "close"
  | "chevron-right"
  | "chevron-down"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "trend-up"
  | "trend-down"
  | "wallet"
  | "check"
  | "check-circle"
  | "alert"
  | "clock"
  | "calendar"
  | "star"
  | "star-filled"
  | "edit"
  | "trash"
  | "archive"
  | "filter"
  | "sort"
  | "sun"
  | "moon"
  | "phone"
  | "mail"
  | "tag"
  | "download"
  | "upload"
  | "lock"
  | "bell"
  | "fingerprint"
  | "command"
  | "refresh"
  | "more"
  | "send"
  | "swap"
  | "camera"
  | "shield"
  | "sparkles"
  | "offline";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

const icons: Record<IconName, LucideIcon> = {
  home: Home,
  people: Users,
  activity: Activity,
  settings: Settings,
  emi: CreditCard,
  user: User,
  plus: Plus,
  search: Search,
  close: X,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "trend-up": TrendingUp,
  "trend-down": TrendingDown,
  wallet: Wallet,
  check: Check,
  "check-circle": CheckCircle2,
  alert: AlertTriangle,
  clock: Clock,
  calendar: Calendar,
  star: Star,
  "star-filled": Star,
  edit: Pencil,
  trash: Trash2,
  archive: Archive,
  filter: Filter,
  sort: ArrowUpDown,
  sun: Sun,
  moon: Moon,
  phone: Phone,
  mail: Mail,
  tag: Tag,
  download: Download,
  upload: Upload,
  lock: Lock,
  bell: Bell,
  fingerprint: Fingerprint,
  command: Command,
  refresh: RefreshCw,
  more: MoreVertical,
  send: Send,
  swap: ArrowLeftRight,
  camera: Camera,
  shield: Shield,
  sparkles: Sparkles,
  offline: WifiOff,
};

export const Icon = ({ name, size = 22, className, strokeWidth = 1.9, style }: IconProps) => {
  const LucideGlyph = icons[name];
  const filled = name === "star-filled";
  return (
    <LucideGlyph
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      {...(filled ? { fill: "currentColor" } : {})}
    />
  );
};
