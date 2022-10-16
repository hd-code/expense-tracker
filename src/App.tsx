import React from "react";
import { Interval } from "./domain/Interval";
import { IntervalChooser } from "./ui/IntervalChooser";

function exp(category: string, name: string, cost: number, interval: Interval) {
    return { category, name, cost, interval };
}

const sampleExpenses = [
    exp("Wohnung", "Miete warm", 300, 12),
    exp("Wohnung", "Strom", 96 / 3, 12),
    exp("Wohnung", "GEZ", 55.08 / 3, 4),
    exp("Wohnung", "Internet", 45.99 / 3, 12),
    exp("Wohnung", "", 0, 12),
    exp("Tiere", "Futter Schildkröte", 30, 2),
    exp("Tiere", "Futter Schlange", 1, 52),
    exp("Tiere", "", 0, 12),
    exp("Versicherungen", "Haftpflicht", 3.45, 12),
    exp("Versicherungen", "Moped", 57, 1),
    exp("Versicherungen", "E-Bike", 80, 1),
    exp("Versicherungen", "", 0, 12),
    exp("sonstiges", "Essen", 70, 12),
    exp("sonstiges", "Essen gehen", 100, 12),
    exp("sonstiges", "ÖPNV-Tickets", 10.5, 52),
    exp("sonstiges", "", 0, 12),
];

const startExpenses = [
    exp("Wohnung", "", 0, 12),
    exp("Mobilität", "", 0, 12),
    exp("Versicherungen", "", 0, 12),
    exp("Internet, Handy, Streaming", "", 0, 12),
    exp("sonstiges", "", 0, 12),
];

function App() {
    const [expenses, setExpenses] = React.useState(sampleExpenses);
    const [settings, setSettings] = React.useState({ currency: "€" });

    // Save to LocalStorage on changes
    React.useEffect(() => {
        window.localStorage.setItem("expenses", JSON.stringify(expenses));
        window.localStorage.setItem("settings", JSON.stringify(settings));
    }, [expenses, settings]);

    // Load from LocalStorage
    React.useEffect(() => {
        const expensesValue = window.localStorage.getItem("expenses");
        if (expensesValue) {
            const expensesLoaded = JSON.parse(expensesValue);
            setExpenses(expensesLoaded);
        }

        const settingsValue = window.localStorage.getItem("settings");
        if (settingsValue) {
            const settingsLoaded = JSON.parse(settingsValue);
            setSettings(settingsLoaded);
        }
    }, []);

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
