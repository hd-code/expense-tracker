import { Dispatch } from "react";
import { Expense, Interval, calcCost } from "../domain";

export type TableRow = {
    type: "group" | "expense";
    name: string;
    amount: string;
    interval: Interval;
    cost: number;
    row: number;
};

export class ExpensesState {
    private tableRows_: TableRow[];
    get tableRows(): TableRow[] {
        return this.tableRows_;
    }

    private sum_: number = 0;
    get sum(): number {
        return this.sum_;
    }

    constructor(
        private expenses: Expense[],
        private setExpenses: Dispatch<Expense[]>,
        private interval: Interval,
    ) {
        const categories: string[] = [];
        let expensesByCat: { [cat: string]: TableRow[] } = {};
        expenses.forEach((expense, i) => {
            const category = expense.category;
            if (!(category in expensesByCat)) {
                categories.push(category);
                expensesByCat[category] = [];
            }

            const cost = calcCost(expense, interval);
            this.sum_ += cost;

            expensesByCat[category].push({
                ...expense,
                cost,
                type: "expense",
                row: i,
            });
        });

        this.tableRows_ = categories
            .map((cat) => [
                {
                    type: "group",
                    name: cat,
                    amount: "",
                    interval: 12,
                    cost: expensesByCat[cat].reduce(
                        (sum, exp) => sum + exp.cost,
                        0,
                    ),
                    row: expensesByCat[cat][0].row,
                } as TableRow,
                ...expensesByCat[cat],
            ])
            .flat();
    }

    updateCell(row: number, column: string, value: string) {
        let rows = [row];
        if (column === "category") {
            this.expenses.forEach((expense, i) => {
                if (expense.category === this.expenses[row].category) {
                    rows.push(i);
                }
            });
        }
        const value_ = column === "interval" ? parseFloat(value) : value;
        this.setExpenses(
            this.expenses.map((expense, i) =>
                rows.includes(i) ? { ...expense, [column]: value_ } : expense,
            ),
        );
    }

    addRow(category: string) {
        let indexOfCategory = 0;
        this.expenses.forEach((expense, i) => {
            if (expense.category === category) {
                indexOfCategory = i;
            }
        });

        this.setExpenses([
            ...this.expenses.slice(0, indexOfCategory + 1),
            { category, name: "", amount: "", interval: 12 },
            ...this.expenses.slice(indexOfCategory + 1),
        ]);
    }
}
