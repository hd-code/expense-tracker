import { calcCost, Expense, parseAmount } from "../domain/Expense";
import { Interval } from "../domain/Interval";

export type ExpenseUI = {
    category: string;
    name: string;
    amount: number;
    interval: Interval;
    cost: number;
};

export function toExpenseUI(expense: Expense, interval: Interval): ExpenseUI {
    return {
        ...expense,
        amount: parseAmount(expense.amount),
        cost: calcCost(expense, interval),
    };
}

export type onChange = (row: number, column: string, value: string) => void;
