import React from "react";
import { Table } from "./view/Table";
import { Expense, Settings } from "./domain";

export const App: React.FC = () => {
    const [expenses, setExpenses] = useLocalState("expenses", sampleExpenses);
    const [settings, setSettings] = useLocalState("settings", defaultSettings);

    return (
        <div className="d-f jc-c">
            <div>
                <h1>Lebenshaltungskosten</h1>
                <Table {...{ expenses, setExpenses, settings }} />
            </div>
        </div>
    );
};

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

const defaultSettings: Settings = {
    currency: "€",
    decimals: 2,
    interval: 12,
};

function useLocalState<T>(key: string, init: T): [T, React.Dispatch<T>] {
    const [state, setState] = React.useState(() => {
        const dataString = window.localStorage.getItem(key);
        if (dataString) {
            const data = JSON.parse(dataString);
            // check data for validity
            return data as T;
        }
        return init;
    });

    React.useEffect(() => {
        const data = JSON.stringify(state);
        window.localStorage.setItem(key, data);
    }, [state]);

    return [state, setState];
}
