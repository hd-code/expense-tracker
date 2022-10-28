import React from "react";
import { Expense } from "./domain/Expense";
import { useExpenses } from "./state/ExpensesState";
import Table from "./ui/Table";

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

const App: React.FC = () => {
    const {expenses, updateCell} = useExpenses(sampleExpenses);
    return (
        <>
            <h1>Lebenshaltungskosten</h1>
            <Table
                expenses={expenses}
                onChange={updateCell}
                interval={12}
            />
        </>
    );
};
export default App;
