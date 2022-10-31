import { Expense, Interval } from "../domain";
import { ExpensesState } from "./ExpensesState";
import { TableBody } from "./TableBody";
import { TableFooter } from "./TableFooter";
import React from "react";

interface TableProps {
    expenses: Expense[];
    setExpenses: React.Dispatch<Expense[]>;
    interval: Interval;
}

export const Table: React.FC<TableProps> = ({
    expenses,
    setExpenses,
    interval,
}) => {
    const state = new ExpensesState(expenses, setExpenses, interval);
    return (
        <table>
            <TableBody state={state} />
            <TableFooter state={state} />
        </table>
    );
};
