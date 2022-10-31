import { ExpensesState } from "./ExpensesState";

interface TableFooterProps {
    state: ExpensesState;
}

export const TableFooter: React.FC<TableFooterProps> = ({ state }) => (
    <tfoot>
        <tr>
            <th className="ta-e" colSpan={3}>
                Summe:
            </th>
            <th>{state.sum.toFixed(2)} €</th>
        </tr>
    </tfoot>
);
