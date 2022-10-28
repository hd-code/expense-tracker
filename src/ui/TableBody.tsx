import { ExpenseUI } from "./ExpenseUI";
import IntervalSelect from "./IntervalSelect";

interface TableBodyProps {
    expenses: ExpenseUI[];
    onChange: (row: number, column: string, value: string) => void;
}

const TableBody: React.FC<TableBodyProps> = ({ expenses, onChange }) => {
    const onChange_: React.ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement
    > = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        const [column, rowString] = name.split("-");
        onChange(parseInt(rowString), column, value);
    };

    let categories: { [cat: string]: number } = {};
    expenses.forEach((expense) => {
        if (!(expense.category in categories)) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.cost;
    });

    let category = "";

    return (
        <tbody>
            {expenses.map((expense, i) => (
                <>
                    {category !== expense.category &&
                        (category = expense.category) && (
                            <tr key={i + "G"}>
                                <th className="ta-s" colSpan={3}>
                                    <input
                                        type="text"
                                        name={`category-${i}`}
                                        value={category}
                                        onChange={onChange_}
                                    />
                                </th>
                                <th className="ta-e">
                                    {categories[category].toFixed(2)} €
                                </th>
                            </tr>
                        )}

                    <tr key={i}>
                        <td>
                            <input
                                type="text"
                                name={`name-${i}`}
                                value={expense.name}
                                onChange={onChange_}
                            />
                        </td>
                        <td className="ta-e whs-nw">
                            <input
                                type="text"
                                name={`amount-${i}`}
                                value={expense.amount}
                                onChange={onChange_}
                                className="w-6em"
                            />
                            €
                        </td>
                        <td>
                            <IntervalSelect
                                name={`interval-${i}`}
                                value={expense.interval}
                                onChange={onChange_}
                            />
                        </td>
                        <td className="ta-e whs-nw">
                            {expense.cost.toFixed(2)} €
                        </td>
                    </tr>
                </>
            ))}
        </tbody>
    );
};

export default TableBody;
