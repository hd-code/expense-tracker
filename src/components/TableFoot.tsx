import * as React from "react";
import { ExpenseGroups } from "../domain";

interface TableFootProps {
    readonly expenseGroups: ExpenseGroups;
    setMarkup: React.Dispatch<number>;
}
export const TableFoot: React.FC<TableFootProps> = ({
    expenseGroups,
    setMarkup,
}) => (
    <tfoot className="bdt-1px ta-r">
        <tr>
            <th colSpan={3}>Summe:</th>
            <th>{expenseGroups.monthlySum.toFixed(2)} €</th>
            <th></th>
        </tr>
        <tr>
            <th colSpan={3}>
                {"+ "}
                <input
                    type="number"
                    className="w-3em"
                    value={expenseGroups.markup}
                    onChange={(ev) => setMarkup(parseInt(ev.target.value))}
                />
                {" % Puffer:"}
            </th>
            <th>{expenseGroups.monthlyMarkup.toFixed(2)} €</th>
            <th></th>
        </tr>
        <tr>
            <th colSpan={3}>gesamt:</th>
            <th>{expenseGroups.monthlyCost.toFixed(2)} €</th>
            <th></th>
        </tr>
    </tfoot>
);
