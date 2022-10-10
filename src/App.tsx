import React from "react";

const intervals = {
    1: "jährlich",
    4: "quartalsweise",
    12: "monatlich",
    52: "wöchentlich",
    365.25: "täglich",
};

function IntervalChooser(props: {
    name: string;
    value: keyof typeof intervals;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) {
    const pairs = Object.entries(intervals);
    return (
        <select {...props} onChange={props.onChange}>
            {pairs.map(([value, name]) => (
                <option key={value} value={value}>
                    {name}
                </option>
            ))}
        </select>
    );
}

function exp(
    category: string,
    name: string,
    cost: number,
    interval: keyof typeof intervals
) {
    return {
        category,
        name,
        cost,
        interval,
    };
}

const sampleExpenses = [
    exp("Wohnung", "Miete", 478.95, 12),
    exp("Wohnung", "Nebenkosten", 77.53, 12),
    exp("Wohnung", "GEZ", 55.08, 4),
    exp("Versicherungen", "Berufsunfähigkeit", 74.95, 12),
    exp("Versicherungen", "Haftpflicht", 49.95, 1),
];

function App() {
    const [expenses, setExpenses] = React.useState(sampleExpenses);

    const onChange = (
        ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        ev.preventDefault();

        const value = ev.target.value;
        const [col, rowS] = ev.target.name.split("-");
        const row = parseInt(rowS);

        switch (col) {
            case "name":
            case "cost":
            case "interval":
                setExpenses(
                    expenses.map((exp, i) =>
                        row != i ? exp : { ...exp, [col]: value }
                    )
                );
                break;
        }
    };

    let sum = 0;
    const categories = expenses.reduce((categories, expense) => {
        const currentSum = categories[expense.category] || 0;
        const mthCost = (expense.cost * expense.interval) / 12;
        sum += mthCost;
        return { ...categories, [expense.category]: currentSum + mthCost };
    }, {} as { [category: string]: number });

    let category = "";

    return (
        <table>
            {expenses.map((expense, i) => (
                <>
                    {category !== expense.category &&
                        (category = expense.category) && (
                            <tr>
                                <th className="text-left" colSpan={3}>
                                    {expense.category}
                                </th>
                                <th className="text-right">
                                    {categories[expense.category]
                                        .toFixed(2)
                                        .replace(".", ",")}{" "}
                                    €
                                </th>
                            </tr>
                        )}
                    <tr key={i}>
                        <td>
                            <input
                                type="text"
                                name={`name-${i}`}
                                value={expense.name}
                                onChange={onChange}
                            />
                        </td>
                        <td className="text-right">
                            <input
                                type="number"
                                className="text-right"
                                name={`cost-${i}`}
                                value={expense.cost}
                                onChange={onChange}
                            />
                            €
                        </td>
                        <td>
                            <IntervalChooser
                                name={`interval-${i}`}
                                value={expense.interval}
                                onChange={onChange}
                            />
                        </td>
                        <td className="text-right">
                            {((expense.cost * expense.interval) / 12)
                                .toFixed(2)
                                .replace(".", ",")}{" "}
                            €
                        </td>
                    </tr>
                </>
            ))}
            <tfoot>
                <tr>
                    <td colSpan={2}></td>
                    <td>Summe:</td>
                    <td className="text-right">
                        {sum.toFixed(2).replace(".", ",")} €
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}

export default App;
