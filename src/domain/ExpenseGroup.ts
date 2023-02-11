import { Expense } from "./Expense";

export class ExpenseGroup {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly expenses: Expense[],
    ) {}

    get monthlyCost(): number {
        return this.expenses.reduce((sum, e) => sum + e.monthlyCost, 0);
    }

    setName(name: string): ExpenseGroup {
        return new ExpenseGroup(this.id, name, this.expenses);
    }
    setExpenses(expenses: Expense[]): ExpenseGroup {
        return new ExpenseGroup(this.id, this.name, expenses);
    }

    getExpense(id: number): Expense {
        for (let i = 0, ie = this.expenses.length; i < ie; i++) {
            if (this.expenses[i].id === id) {
                return this.expenses[i];
            }
        }
        throw new Error("unknown Expense.id: " + id);
    }
    setExpense(expense: Expense): ExpenseGroup {
        for (let i = 0, ie = this.expenses.length; i < ie; i++) {
            if (this.expenses[i].id === expense.id) {
                return this.setExpenses([
                    ...this.expenses.slice(0, i),
                    expense,
                    ...this.expenses.slice(i + 1),
                ]);
            }
        }
        return this.setExpenses(this.expenses.concat(expense));
    }
    removeExpense(id: number): ExpenseGroup {
        for (let i = 0, ie = this.expenses.length; i < ie; i++) {
            if (this.expenses[i].id === id) {
                return this.setExpenses([
                    ...this.expenses.slice(0, i),
                    ...this.expenses.slice(i + 1),
                ]);
            }
        }
        throw new Error("unknown Expense.id: " + id);
    }

    getHighestExpenseId(): number {
        return Math.max(...this.expenses.map((e) => e.id));
    }
}
