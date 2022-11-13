import { hasKey, isArray, isNumber, isString } from "./util/typeguards";

export type Expense = {
    category: string;
    name: string;
    cost: number;
    frequency: number;
};

export function isExpense(expense: unknown): expense is Expense {
    return (
        hasKey(expense, "category", isString) &&
        hasKey(expense, "name", isString) &&
        hasKey(expense, "cost", isNumber) &&
        hasKey(expense, "frequency", isNumber)
    );
}

export function isExpenses(expenses: unknown): expenses is Expense[] {
    return isArray(expenses, isExpense);
}

export function calcRegularCost(expense: Expense): number {
    return (expense.cost * expense.frequency) / 12;
}
export function calcRegularCostSum(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + calcRegularCost(expense), 0);
}

export const sampleExpenses: Expense[] = [
    { category: "Wohnung", name: "Miete", cost: 425, frequency: 12 },
    { category: "Wohnung", name: "GEZ", cost: 52.08, frequency: 4 },
    { category: "Wohnung", name: "", cost: 0, frequency: 12 },
    { category: "Wohnung", name: "", cost: 0, frequency: 12 },
    { category: "Wohnung", name: "", cost: 0, frequency: 12 },
    { category: "Versicherung", name: "Haftpflicht", cost: 49, frequency: 1 },
    { category: "Versicherung", name: "", cost: 0, frequency: 12 },
    { category: "Versicherung", name: "", cost: 0, frequency: 12 },
    { category: "sonstiges", name: "", cost: 0, frequency: 12 },
    { category: "sonstiges", name: "", cost: 0, frequency: 12 },
    { category: "sonstiges", name: "", cost: 0, frequency: 12 },
];
