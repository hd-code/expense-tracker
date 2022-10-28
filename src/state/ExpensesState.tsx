import React from "react";
import { Expense } from "../domain/Expense";

export type ExpensesState = {
    expenses: Expense[];
    updateCell: (row: number, column: string, value: string) => void;
};

export function useExpenses(sampleExpenses: Expense[]): ExpensesState {
    const [expenses, setExpenses] = React.useState(sampleExpenses);
    const updateCell = (row: number, column: string, value: string) => {
        let rows = [row];
        if (column === "category") {
            expenses.forEach((expense, i) => {
                if (expense.category === expenses[row].category) {
                    rows.push(i);
                }
            });
        }
        const value_ = column === "interval" ? parseFloat(value) : value;
        setExpenses(
            expenses.map((expense, i) =>
                rows.includes(i) ? { ...expense, [column]: value_ } : expense
            )
        );
    };

    return { expenses, updateCell };
}
