import { Interval } from "./Interval";

export type Expense = {
    category: string;
    name: string;
    cost: number;
    interval: Interval;
};

export function expense(category: string, name: string, cost: number, interval: Interval) {
    return { category, name, cost, interval };
}

export function calcMonthlyCost(expense: Expense): number {
    return (expense.cost * expense.interval) / 12;
}

export type Expenses = Expense[];
