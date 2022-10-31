import { Interval } from "./Interval";

export type Expense = {
    category: string;
    name: string;
    amount: string;
    interval: Interval;
};

export function parseAmount(amount: string): number {
    const float = parseFloat((""+amount).replace(",", "."));
    return isNaN(float) ? 0 : float;
}

export function calcCost(expense: Expense, interval: Interval): number {
    return (parseAmount(expense.amount) * expense.interval) / interval;
}
