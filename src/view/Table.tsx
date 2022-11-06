import React from "react";
import { Expense, Settings } from "../domain";
import { ExpensesState } from "./ExpensesState";
import { TableBody } from "./TableBody";
import { TableFooter } from "./TableFooter";

interface TableProps {
    expenses: Expense[];
    setExpenses: React.Dispatch<Expense[]>;
    settings: Settings;
}

export const Table: React.FC<TableProps> = ({
    expenses,
    setExpenses,
    settings,
}) => {
    const state = new ExpensesState(expenses, setExpenses, settings.interval);
    return (
        <table>
            <TableBody {...{ state, settings }} />
            <TableFooter {...{ state, settings }} />
        </table>
    );
};
