import { Settings } from "../domain";
import { ExpensesState } from "./ExpensesState";

interface TableFooterProps {
    state: ExpensesState;
    settings: Settings;
}

export const TableFooter: React.FC<TableFooterProps> = ({
    state,
    settings,
}) => (
    <tfoot>
        <tr>
            <th className="ta-e" colSpan={3}>
                Summe:
            </th>
            <th>
                {state.sum.toFixed(settings.decimals)}
                {settings.currency}
            </th>
        </tr>
    </tfoot>
);
