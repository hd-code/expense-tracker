import { Expense } from "./Expense";
import { ExpenseGroup } from "./ExpenseGroup";

export class ExpenseGroups {
    constructor(readonly markup: number, readonly groups: ExpenseGroup[]) {}

    get monthlySum(): number {
        return this.groups.reduce((sum, e) => sum + e.monthlyCost, 0);
    }
    get monthlyMarkup(): number {
        return (this.monthlySum * this.markup) / 100;
    }
    get monthlyCost(): number {
        return this.monthlySum + this.monthlyMarkup;
    }

    setMarkup(markup: number): ExpenseGroups {
        return new ExpenseGroups(markup, this.groups);
    }
    setGroups(groups: ExpenseGroup[]): ExpenseGroups {
        return new ExpenseGroups(this.markup, groups);
    }

    getGroup(id: number): ExpenseGroup {
        for (let i = 0, ie = this.groups.length; i < ie; i++) {
            if (this.groups[i].id === id) {
                return this.groups[i];
            }
        }
        throw new Error("unknown ExpenseGroup.id: " + id);
    }
    setGroup(group: ExpenseGroup): ExpenseGroups {
        for (let i = 0, ie = this.groups.length; i < ie; i++) {
            if (this.groups[i].id === group.id) {
                return this.setGroups([
                    ...this.groups.slice(0, i),
                    group,
                    ...this.groups.slice(i + 1),
                ]);
            }
        }
        return this.setGroups(this.groups.concat(group));
    }
    removeGroup(id: number): ExpenseGroups {
        for (let i = 0, ie = this.groups.length; i < ie; i++) {
            if (this.groups[i].id === id) {
                return this.setGroups([
                    ...this.groups.slice(0, i),
                    ...this.groups.slice(i + 1),
                ]);
            }
        }
        throw new Error("unknown ExpenseGroup.id: " + id);
    }

    getExpense(id: number): Expense {
        for (let i = 0, ie = this.groups.length; i < ie; i++) {
            try {
                return this.groups[i].getExpense(id);
            } catch (_) {}
        }
        throw new Error("unknown Expense.id: " + id);
    }
    setExpense(expense: Expense): ExpenseGroups {
        for (let i = 0, ie = this.groups.length; i < ie; i++) {
            try {
                this.groups[i].getExpense(expense.id);
                const modifiedGroup = this.groups[i].setExpense(expense);
                return this.setGroups([
                    ...this.groups.slice(0, i),
                    modifiedGroup,
                    ...this.groups.slice(i + 1),
                ]);
            } catch (_) {}
        }
        throw new Error("unknown Expense.id: " + expense.id);
    }
    removeExpense(id: number): ExpenseGroups {
        for (let i = 0, ie = this.groups.length; i < ie; i++) {
            try {
                const modifiedGroup = this.groups[i].removeExpense(id);
                return this.setGroups([
                    ...this.groups.slice(0, i),
                    modifiedGroup,
                    ...this.groups.slice(i + 1),
                ]);
            } catch (_) {}
        }
        throw new Error("unknown Expense.id: " + id);
    }

    getHighestExpenseId(): number {
        return Math.max(...this.groups.map((e) => e.getHighestExpenseId()));
    }
    getHighestExpenseGroupId(): number {
        return Math.max(...this.groups.map((e) => e.id));
    }

    toRecords() {
        return {
            markup: this.markup,
            expenses: this.groups.flatMap((g) =>
                g.expenses.map((e) => ({ category: g.name, ...e.toRecord() })),
            ),
        };
    }
    static fromRecords(records: { [key: string]: any }): ExpenseGroups {
        const groups: { [category: string]: Expense[] } = {};
        (records["expenses"] as any[]).forEach((e, i) => {
            const cat = e["category"];
            if (!(cat in groups)) {
                groups[cat] = [];
            }
            groups[cat].push(
                new Expense(i, e["name"], e["cost"], e["frequency"]),
            );
        });

        return new ExpenseGroups(
            records["markup"],
            Object.entries(groups).map(
                ([cat, exps], i) => new ExpenseGroup(i, cat, exps),
            ),
        );
    }
}
