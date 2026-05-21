"use client";

import { useMemo, useState } from "react";
import { calcDailyTotal, calcMonthlyTotal, calcYearlyTotal, formatCurrency } from "@/lib/expenses";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { OshiExpense, OshiExpenseCategory } from "@/lib/types";
import styles from "../oshi.module.css";

const CATEGORIES: OshiExpenseCategory[] = ["グッズ", "遠征", "配信", "その他"];

interface FormState {
  date: string;
  amount: string;
  category: OshiExpenseCategory;
  oshi: string;
  memo: string;
}

const baseForm: Omit<FormState, "date"> = {
  amount: "",
  category: "グッズ",
  oshi: "",
  memo: "",
};

export default function OshiTracker() {
  const [expenses, setExpenses] = useLocalStorage<OshiExpense[]>("oshi-expenses", []);
  const [form, setForm] = useState<FormState>(() => ({
    ...baseForm,
    date: new Date().toISOString().slice(0, 10),
  }));
  const [error, setError] = useState("");
  const [filterOshi, setFilterOshi] = useState<string | null>(null);

  const { today, thisMonth, thisYear } = useMemo(() => {
    const d = new Date().toISOString().slice(0, 10);
    return { today: d, thisMonth: d.slice(0, 7), thisYear: d.slice(0, 4) };
  }, []);

  const oshiNames = useMemo(
    () => [...new Set(expenses.map((e) => e.oshi))].sort(),
    [expenses]
  );

  const filteredExpenses = useMemo(
    () => (filterOshi ? expenses.filter((e) => e.oshi === filterOshi) : expenses),
    [expenses, filterOshi]
  );

  const dailyTotal = useMemo(() => calcDailyTotal(filteredExpenses, today), [filteredExpenses, today]);
  const monthlyTotal = useMemo(() => calcMonthlyTotal(filteredExpenses, thisMonth), [filteredExpenses, thisMonth]);
  const yearlyTotal = useMemo(() => calcYearlyTotal(filteredExpenses, thisYear), [filteredExpenses, thisYear]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.oshi.trim()) {
      setError("推しの名前を入力してください");
      return;
    }
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      setError("金額を正しく入力してください");
      return;
    }
    setError("");
    const newExpense: OshiExpense = {
      id: crypto.randomUUID(),
      date: form.date,
      amount,
      category: form.category,
      oshi: form.oshi.trim(),
      memo: form.memo.trim() || undefined,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setForm({ ...baseForm, date: new Date().toISOString().slice(0, 10) });
  }

  function handleDelete(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>推し活費用トラッカー</h1>

      {/* 集計カード */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今日</p>
          <p className={styles.summaryAmount}>{formatCurrency(dailyTotal)}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今月</p>
          <p className={styles.summaryAmount}>{formatCurrency(monthlyTotal)}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今年</p>
          <p className={styles.summaryAmount}>{formatCurrency(yearlyTotal)}</p>
        </div>
      </div>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.formTitle}>費用を記録する</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formRow}>
          <label className={styles.label}>
            日付
            <input
              type="date"
              className={styles.input}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </label>
          <label className={styles.label}>
            金額（円）
            <input
              type="number"
              className={styles.input}
              placeholder="例: 3000"
              value={form.amount}
              min={1}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </label>
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>
            推し
            <input
              type="text"
              className={styles.input}
              placeholder="推しの名前"
              value={form.oshi}
              onChange={(e) => setForm((f) => ({ ...f, oshi: e.target.value }))}
              required
            />
          </label>
          <label className={styles.label}>
            カテゴリ
            <select
              className={styles.input}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as OshiExpenseCategory }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label className={styles.label}>
          メモ（任意）
          <input
            type="text"
            className={styles.input}
            placeholder="例: ライブBD"
            value={form.memo}
            onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
          />
        </label>
        <button type="submit" className={styles.button}>追加する</button>
      </form>

      {/* 推しフィルター */}
      <div className={styles.filterTabs}>
        <button
          className={filterOshi === null ? styles.filterTabActive : styles.filterTab}
          onClick={() => setFilterOshi(null)}
        >
          すべて
        </button>
        {oshiNames.map((name) => (
          <button
            key={name}
            className={filterOshi === name ? styles.filterTabActive : styles.filterTab}
            onClick={() => setFilterOshi(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* 履歴一覧 */}
      <section className={styles.listSection}>
        <h2 className={styles.formTitle}>
          履歴{filterOshi ? `（${filterOshi}）` : ""}
        </h2>
        {filteredExpenses.length === 0 ? (
          <p className={styles.empty}>まだ記録がありません</p>
        ) : (
          <ul className={styles.list}>
            {filteredExpenses.map((expense) => (
              <li key={expense.id} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <span className={styles.listItemDate}>{expense.date}</span>
                  <span className={styles.badge}>{expense.category}</span>
                  <span className={styles.listItemOshi}>{expense.oshi}</span>
                  {expense.memo && <span className={styles.listItemMemo}>— {expense.memo}</span>}
                </div>
                <div className={styles.listItemRight}>
                  <span className={styles.listItemAmount}>{formatCurrency(expense.amount)}</span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className={styles.deleteButton}
                    aria-label="削除"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
