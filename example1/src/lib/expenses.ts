import type { OshiExpense } from "./types";

export function calcDailyTotal(expenses: OshiExpense[], date: string): number {
  return expenses
    .filter((e) => e.date === date)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function calcMonthlyTotal(expenses: OshiExpense[], yearMonth: string): number {
  return expenses
    .filter((e) => e.date.startsWith(yearMonth))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function calcYearlyTotal(expenses: OshiExpense[], year: string): number {
  return expenses
    .filter((e) => e.date.startsWith(year))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ja-JP") + "円";
}
