import React from "react";
import { Expense } from "../domain/Expense";
import { Interval } from "../domain/Interval";
import { ExpenseUI, onChange, toExpenseUI } from "./ExpenseUI";
import TableBody from "./TableBody";
import TableFooter from "./TableFooter";

interface TableProps {
    expenses: Expense[];
    interval: Interval;
    onChange: onChange;
}

const Table: React.FC<TableProps> = ({ expenses, interval, onChange }) => {
    const expensesUI: ExpenseUI[] = expenses.map((exp) =>
        toExpenseUI(exp, interval)
    );

    return (
        <table>
            <TableBody expenses={expensesUI} onChange={onChange} />
            <TableFooter expenses={expensesUI} />
        </table>
    );
};

export default Table;
