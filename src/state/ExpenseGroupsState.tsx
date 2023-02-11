import * as React from "react";
import { Expense, ExpenseGroup, ExpenseGroups } from "../domain";

export interface ExpenseGroupsState {
    readonly expenseGroups: ExpenseGroups;
    setExpenseGroups: React.Dispatch<ExpenseGroups>;
    setMarkup: React.Dispatch<number>;
    addExpenseGroup: React.Dispatch<string>;
    updateExpenseGroup: React.Dispatch<ExpenseGroup>;
    removeExpenseGroup: React.Dispatch<number>;
    addExpensesToGroup: React.Dispatch<number>;
    updateExpense: React.Dispatch<Expense>;
    removeExpense: React.Dispatch<number>;
}

export function useExpenseGroupsState(): ExpenseGroupsState {
    const [expenseGroups, _setExpenseGroups] = React.useState(initState);
    const setExpenseGroups: React.Dispatch<ExpenseGroups> = (groups) => {
        setTimeout(() => saveState(groups), 1);
        _setExpenseGroups(groups);
    };

    const makeNewExpenses = () => {
        const id = expenseGroups.getHighestExpenseId();
        return [1, 2, 3].map((i) => new Expense(id + i, "", 0, 12));
    };

    return {
        expenseGroups,
        setExpenseGroups,
        setMarkup: (markup: number) => {
            setExpenseGroups(expenseGroups.setMarkup(markup));
        },
        addExpenseGroup: (name: string) => {
            const id = expenseGroups.getHighestExpenseGroupId() + 1;
            setExpenseGroups(
                expenseGroups.setGroup(
                    new ExpenseGroup(id, name, makeNewExpenses()),
                ),
            );
        },
        updateExpenseGroup: (expenseGroup: ExpenseGroup) => {
            setExpenseGroups(expenseGroups.setGroup(expenseGroup));
        },
        removeExpenseGroup: (id: number) => {
            setExpenseGroups(expenseGroups.removeGroup(id));
        },
        addExpensesToGroup: (groupId: number) => {
            const group = expenseGroups.getGroup(groupId);
            setExpenseGroups(
                expenseGroups.setGroup(
                    group.setExpenses(group.expenses.concat(makeNewExpenses())),
                ),
            );
        },
        updateExpense: (expense: Expense) => {
            setExpenseGroups(expenseGroups.setExpense(expense));
        },
        removeExpense: (id: number) => {
            setExpenseGroups(expenseGroups.removeExpense(id));
        },
    };
}

const storageKey = "living-expenses";

const defaultExpenseGroups = new ExpenseGroups(20, [
    new ExpenseGroup(0, "Wohnung", [
        new Expense(0, "Miete", 360, 12),
        new Expense(1, "GEZ", 55.08, 4),
        new Expense(2, "", 0, 12),
        new Expense(3, "", 0, 12),
    ]),
    new ExpenseGroup(1, "Versicherung", [
        new Expense(4, "Haftpflicht", 40, 1),
        new Expense(5, "", 0, 12),
        new Expense(6, "", 0, 12),
    ]),
    new ExpenseGroup(2, "sonstiges", [
        new Expense(7, "", 0, 12),
        new Expense(8, "", 0, 12),
        new Expense(9, "", 0, 12),
    ]),
]);

const initState = () => {
    try {
        const data = localStorage.getItem(storageKey);
        if (data === null) {
            throw new Error("no previous data stored in LocalStorage");
        }
        return ExpenseGroups.fromRecords(JSON.parse(data));
    } catch (e) {
        return defaultExpenseGroups;
    }
};
const saveState = (groups: ExpenseGroups) => {
    localStorage.setItem(storageKey, JSON.stringify(groups.toRecords()));
};
