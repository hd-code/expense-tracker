import { IntervalSelect } from "../components";
import { Settings } from "../domain";
import { ExpensesState, TableRow } from "./ExpensesState";

interface TableBodyProps {
    state: ExpensesState;
    settings: Settings;
}

export const TableBody: React.FC<TableBodyProps> = ({ state, settings }) => {
    const onChange_: React.ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement
    > = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        const [column, rowString] = name.split("-");
        state.updateCell(parseInt(rowString), column, value);
    };

    return (
        <tbody>
            {state.tableRows.map((row, i) => (
                <tr key={i}>
                    <TableRow_
                        row={row}
                        onChange={onChange_}
                        settings={settings}
                    />
                </tr>
            ))}
        </tbody>
    );
};

type TableRowProps = {
    row: TableRow;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
    settings: Settings;
};

const TableRow_: React.FC<TableRowProps> = ({ row, onChange, settings }) => {
    if (row.type === "group") {
        return (
            <>
                <th className="ta-s" colSpan={3}>
                    <input
                        type="text"
                        name={`category-${row.row}`}
                        value={row.name}
                        onChange={onChange}
                    />
                </th>
                <th className="ta-e">
                    {row.cost.toFixed(settings.decimals)} €
                </th>
            </>
        );
    } else {
        return (
            <>
                <td>
                    <input
                        type="text"
                        name={`name-${row.row}`}
                        value={row.name}
                        onChange={onChange}
                        placeholder="Miete, Strom, Internet, ..."
                    />
                </td>
                <td className="ta-e whs-nw">
                    <input
                        type="text"
                        name={`amount-${row.row}`}
                        value={row.amount}
                        onChange={onChange}
                        placeholder="z.B. 19,99"
                        className="w-6em"
                    />
                    {settings.currency}
                </td>
                <td>
                    <IntervalSelect
                        name={`interval-${row.row}`}
                        value={row.interval}
                        onChange={onChange}
                    />
                </td>
                <td className="ta-e whs-nw">
                    {row.cost.toFixed(settings.decimals)}
                    {settings.currency}
                </td>
            </>
        );
    }
};