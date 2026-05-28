"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { Sheet } from "@/components/Sheet/Sheet";
import { PersonForm } from "@/features/people/PersonForm/PersonForm";
import { TransactionForm } from "@/features/transactions/TransactionForm/TransactionForm";
import { ConfirmDialog } from "@/features/shared/ConfirmDialog/ConfirmDialog";

export const ModalHost = () => {
  const modal = useUIStore((s) => s.modal);
  const closeModal = useUIStore((s) => s.closeModal);

  const [session, setSession] = useState({ modal, key: 0 });
  useEffect(() => {
    if (modal) setSession((s) => ({ modal, key: s.key + 1 }));
  }, [modal]);

  const cached = session.modal;
  const formKey = session.key;

  return (
    <>
      <Sheet
        open={modal?.type === "person"}
        onClose={closeModal}
        icon="user"
        tone="accent"
        title={cached?.type === "person" && cached.personId ? "Edit borrower" : "New borrower"}
        description={
          cached?.type === "person" && cached.personId
            ? undefined
            : "Add someone you have lent money to."
        }
      >
        {cached?.type === "person" && (
          <PersonForm key={formKey} personId={cached.personId} onDone={closeModal} />
        )}
      </Sheet>

      <Sheet
        open={modal?.type === "transaction"}
        onClose={closeModal}
        icon="wallet"
        tone="primary"
        title={cached?.type === "transaction" && cached.transactionId ? "Edit transaction" : "New transaction"}
        description={
          cached?.type === "transaction" && cached.transactionId
            ? undefined
            : "Record money lent or a repayment received."
        }
      >
        {cached?.type === "transaction" && (
          <TransactionForm
            key={formKey}
            personId={cached.personId}
            transactionId={cached.transactionId}
            defaultType={cached.defaultType}
            onDone={closeModal}
          />
        )}
      </Sheet>

      <ConfirmDialog
        open={modal?.type === "confirm"}
        title={cached?.type === "confirm" ? cached.title : ""}
        message={cached?.type === "confirm" ? cached.message : ""}
        confirmLabel={cached?.type === "confirm" ? cached.confirmLabel : undefined}
        onConfirm={cached?.type === "confirm" ? cached.onConfirm : () => {}}
        onClose={closeModal}
      />
    </>
  );
};
