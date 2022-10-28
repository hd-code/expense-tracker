import { ExpenseUI } from "./ExpenseUI";

interface TableFooterProps {
    expenses: ExpenseUI[];
}

const TableFooter: React.FC<TableFooterProps> = ({ expenses }) => {
    const sum = expenses.reduce((sum, expense) => sum + expense.cost, 0);
    return (
        <tfoot>
            <tr>
                <th className="ta-e" colSpan={3}>
                    Summe:
                </th>
                <th>{sum.toFixed(2)} €</th>
            </tr>
        </tfoot>
    );
};

export default TableFooter;
