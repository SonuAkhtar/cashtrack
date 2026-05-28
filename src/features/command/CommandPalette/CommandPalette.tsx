"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { Avatar } from "@/components/Avatar/Avatar";
import { useUIStore } from "@/store/uiStore";
import { useHotkey } from "@/hooks/useHotkey";
import { usePeople } from "@/hooks/usePeople";
import { useTheme } from "@/providers/ThemeProvider";
import type { CommandAction } from "@/types";
import styles from "./CommandPalette.module.scss";

export const CommandPalette = () => {
  const open = useUIStore((s) => s.commandOpen);
  const openCommand = useUIStore((s) => s.openCommand);
  const closeCommand = useUIStore((s) => s.closeCommand);
  const openModal = useUIStore((s) => s.openModal);
  const router = useRouter();
  const { toggle } = useTheme();
  const { data: people = [] } = usePeople();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkey("k", () => (open ? closeCommand() : openCommand()), { meta: true });

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const actions = useMemo<CommandAction[]>(() => {
    const base: CommandAction[] = [
      { id: "tx-lend", label: "Record money lent", icon: "arrow-up", group: "actions", perform: () => { openModal({ type: "transaction", defaultType: "lend" }); } },
      { id: "tx-repay", label: "Record repayment", icon: "arrow-down", group: "actions", perform: () => { openModal({ type: "transaction", defaultType: "repayment" }); } },
      { id: "add-person", label: "Add borrower", icon: "people", group: "actions", perform: () => { openModal({ type: "person" }); } },
      { id: "nav-dashboard", label: "Go to Overview", icon: "home", group: "navigation", perform: () => router.push("/") },
      { id: "nav-people", label: "Go to People", icon: "people", group: "navigation", perform: () => router.push("/people") },
      { id: "nav-activity", label: "Go to Activity", icon: "activity", group: "navigation", perform: () => router.push("/transactions") },
      { id: "nav-profile", label: "Go to Profile", icon: "user", group: "navigation", perform: () => router.push("/profile") },
      { id: "toggle-theme", label: "Toggle theme", icon: "moon", group: "settings", perform: toggle },
    ];

    const peopleActions: CommandAction[] = people
      .filter((p) => p.status === "active")
      .map((p) => ({
        id: `person-${p.id}`,
        label: p.name,
        hint: "Borrower",
        icon: "people" as IconName,
        group: "people",
        keywords: p.tags,
        perform: () => router.push(`/people/${p.id}`),
      }));

    return [...base, ...peopleActions];
  }, [openModal, router, toggle, people]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }, [actions, query]);

  const run = (action: CommandAction) => {
    closeCommand();
    action.perform();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      run(filtered[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className={styles.root}>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCommand}
          />
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.search}>
              <Icon name="search" size={20} className={styles.search__icon} />
              <input
                ref={inputRef}
                className={styles.search__input}
                placeholder="Search or jump to..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
              />
              <kbd className={styles.search__kbd}>esc</kbd>
            </div>

            <div className={`${styles.results} app-scroll`}>
              {filtered.length === 0 ? (
                <p className={styles.empty}>No results for “{query}”</p>
              ) : (
                filtered.map((action, index) => {
                  const isPerson = action.id.startsWith("person-");
                  const person = isPerson ? people.find((p) => `person-${p.id}` === action.id) : null;
                  return (
                    <button
                      key={action.id}
                      className={`${styles.result} ${index === activeIndex ? styles["result--active"] : ""}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => run(action)}
                    >
                      {person ? (
                        <Avatar name={person.name} color={person.avatarColor} size="sm" />
                      ) : (
                        <span className={styles.result__icon}>
                          <Icon name={action.icon as IconName} size={18} />
                        </span>
                      )}
                      <span className={styles.result__label}>{action.label}</span>
                      {action.hint && <span className={styles.result__hint}>{action.hint}</span>}
                      <Icon name="chevron-right" size={15} className={styles.result__chevron} />
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
