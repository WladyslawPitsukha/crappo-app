import React, { type FormEvent, type ReactNode } from "react";

export type TransactionFormProps = { onSubmit: (event: FormEvent<HTMLFormElement>) => void; children: ReactNode };

export default function TransactionForm({ onSubmit, children }: TransactionFormProps) {
    return <form className="mt-5 space-y-4" onSubmit={onSubmit}>{children}</form>;
}
