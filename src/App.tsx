import React from "react";
import { Expense, expense as exp } from "./domain/Expenses";
import { IntervalChooser } from "./ui/IntervalChooser";

const sampleExpenses: Expense[] = [
    exp("Wohnung", "", 0, 12),
    exp("Wohnung", "", 0, 12),
    exp("Wohnung", "", 0, 12),
    exp("Wohnung", "", 0, 12),
    exp("Wohnung", "", 0, 12),
    exp("Wohnung", "", 0, 12),
    exp("Tiere", "", 0, 12),
    exp("Tiere", "", 0, 12),
    exp("Tiere", "", 0, 12),
    exp("Tiere", "", 0, 12),
    exp("Tiere", "", 0, 12),
    exp("Tiere", "", 0, 12),
    exp("Versicherungen", "", 0, 12),
    exp("Versicherungen", "", 0, 12),
    exp("Versicherungen", "", 0, 12),
    exp("Versicherungen", "", 0, 12),
    exp("Versicherungen", "", 0, 12),
    exp("Versicherungen", "", 0, 12),
    exp("sonstiges", "", 0, 12),
    exp("sonstiges", "", 0, 12),
    exp("sonstiges", "", 0, 12),
    exp("sonstiges", "", 0, 12),
    exp("sonstiges", "", 0, 12),
    exp("sonstiges", "", 0, 12),
    exp("sonstiges", "", 0, 12),
    exp("sonstiges", "", 0, 12),
];

function App() {
    const [expenses, setExpenses] = React.useState(() => {
        const expensesValue = window.localStorage.getItem("expenses");
        if (expensesValue) {
            const expensesLoaded: Expense[] = JSON.parse(expensesValue);
            return expensesLoaded;
        }
        return sampleExpenses;
    });
    const [settings, setSettings] = React.useState({ currency: "€" });

    // Save to LocalStorage on changes
    React.useEffect(() => {
        window.localStorage.setItem("expenses", JSON.stringify(expenses));
        window.localStorage.setItem("settings", JSON.stringify(settings));
    }, [expenses, settings]);

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
                        row !== i ? exp : { ...exp, [col]: value }
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
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Kosten</th>
                    <th>Interval</th>
                    <th>mtl. Kosten</th>
                </tr>
            </thead>

            <tbody>
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
                                            .replace(".", ",")}
                                        {" " + settings.currency}
                                    </th>
                                </tr>
                            )}
                        <tr key={i}>
                            <td>
                                <input
                                    type="text"
                                    name={`name-${i}`}
                                    value={expense.name}
                                    placeholder="Miete, Strom, Internet, ..."
                                    onChange={onChange}
                                />
                            </td>
                            <td className="text-right">
                                <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    className="text-right w-6em"
                                    name={`cost-${i}`}
                                    value={
                                        expense.cost > 0
                                            ? expense.cost
                                            : undefined
                                    }
                                    placeholder="z.B. 19,99"
                                    onChange={onChange}
                                />
                                {" " + settings.currency}
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
                                    .replace(".", ",")}
                                {" " + settings.currency}
                            </td>
                        </tr>
                    </>
                ))}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan={2}></td>
                    <td>
                        <strong>Summe:</strong>
                    </td>
                    <td className="text-right">
                        <strong>{sum.toFixed(2).replace(".", ",")} €</strong>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}

export default App;
