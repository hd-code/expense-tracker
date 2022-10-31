import { Expense } from "./domain";
import { Table } from "./view/Table";
import React from "react";

const sampleExpenses: Expense[] = [
    { category: "Haus", name: "Miete", amount: "171,99", interval: 12 },
    { category: "Haus", name: "GEZ", amount: "52,08", interval: 4 },
    {
        category: "Versicherung",
        name: "Haftpflicht",
        amount: "56,99",
        interval: 1,
    },
    { category: "Versicherung", name: "BU", amount: "74,99", interval: 12 },
    { category: "sonstiges", name: "Lebensmittel", amount: "40", interval: 52 },
];

export const App: React.FC = () => {
    const [expenses, setExpenses] = React.useState(() => {
        const dataString = window.localStorage.getItem("expenses");
        if (dataString) {
            const data = JSON.parse(dataString);
            // check data for validity
            return data as Expense[];
        }
        return sampleExpenses;
    });

    React.useEffect(() => {
        const data = JSON.stringify(expenses);
        window.localStorage.setItem("expenses", data);
    }, [expenses]);

    return (
        <>
            <h1>Lebenshaltungskosten</h1>
            <Table
                expenses={expenses}
                setExpenses={setExpenses}
                interval={12}
            />
        </>
    );
};
