import * as React from "react";
import { download, openFile } from "./util/domfiles";
import { hasKey, isNumber } from "./util/typeguards";
import {
    Expense,
    calcRegularCostSum,
    isExpenses,
    sampleExpenses,
} from "./Expense";

export const App: React.FC = () => {
    return (
        <div className="d-f jc-c">
            <div className="ovx-a">
                <h1 className="fs-150p ta-c">Lebenshaltungskosten berechnen</h1>
                <Table />
            </div>
        </div>
    );
};

function useLocalState<T>(
    key: string,
    init: T,
    guard?: (x: unknown) => x is T,
): [T, React.Dispatch<T>] {
    const [state, setState] = React.useState(() => {
        const dataString = window.localStorage.getItem(key);
        if (dataString) {
            const data = JSON.parse(dataString);
            if (guard && !guard(data)) {
                console.error("useLocalState() loaded an invalid object");
                return init;
            }

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

const Table: React.FC = () => {
    const [buffer, setBuffer] = useLocalState("buffer", 20, isNumber);
    const [expenses, setExpenses] = useLocalState(
        "expenses",
        sampleExpenses,
        isExpenses,
    );

    const saveToFile = () => {
        const data = JSON.stringify({ buffer, expenses });
        download(data, "Lebenshaltungskosten.json");
    };

    const loadFile = () => {
        openFile().then((fileData) => {
            const data = JSON.parse(fileData);
            if (
                hasKey(data, "buffer", isNumber) &&
                hasKey(data, "expenses", isExpenses)
            ) {
                setBuffer(data.buffer);
                setExpenses(data.expenses);
            } else {
                alert("Fehler: Unbekanntes Dateiformat");
            }
        });
    };

    const addRows = (category: string) => {
        let index = expenses.length;
        expenses.forEach((expense, i) => {
            if (expense.category === category) {
                index = i;
            }
        });
        setExpenses([
            ...expenses.slice(0, index + 1),
            { category, name: "", cost: 0, frequency: 12 },
            { category, name: "", cost: 0, frequency: 12 },
            { category, name: "", cost: 0, frequency: 12 },
            ...expenses.slice(index + 1),
        ]);
    };

    const removeRows = (category: string, indexInCat: number = -1) => {
        if (indexInCat === -1) {
            setExpenses(expenses.filter((exp) => exp.category !== category));
        } else {
            const index =
                expenses.findIndex((exp) => exp.category === category) +
                indexInCat;
            setExpenses([
                ...expenses.slice(0, index),
                ...expenses.slice(index + 1),
            ]);
        }
    };

    const onChange = (ev: React.ChangeEvent<HTMLFormElement>) => {
        ev?.preventDefault();

        const [prop, category, rowS] = ev.target.name.split("-");
        const value = ev.target.value;
        let index = 0;

        switch (prop) {
            case "category":
                setExpenses(
                    expenses.map((expense) =>
                        expense.category === category
                            ? { ...expense, category: value }
                            : expense,
                    ),
                );
                break;

            case "name":
                index =
                    expenses.findIndex((exp) => exp.category === category) +
                    parseInt(rowS);
                setExpenses(
                    expenses.map((expense, i) =>
                        i === index ? { ...expense, name: value } : expense,
                    ),
                );
                break;

            case "cost":
            case "frequency":
                index =
                    expenses.findIndex((exp) => exp.category === category) +
                    parseInt(rowS);
                setExpenses(
                    expenses.map((expense, i) =>
                        i === index
                            ? { ...expense, [prop]: parseFloat(value) }
                            : expense,
                    ),
                );
                break;
        }
    };

    const sum = calcRegularCostSum(expenses);

    return (
        <form onChange={onChange}>
            <table className="whs-nw">
                <TableHead />
                <TableBody {...{ expenses, addRows, removeRows }} />
                <TableFoot {...{ sum, buffer, setBuffer }} />
            </table>

            <div className="ta-c">
                <button type="button" onClick={saveToFile}>
                    Download
                </button>
                <button type="button" onClick={loadFile}>
                    Upload
                </button>
            </div>
        </form>
    );
};

const TableHead: React.FC = () => (
    <thead className="bgc-grey">
        <tr className="bdb-1px ta-l">
            <th>Bezeichnung</th>
            <th>Kosten</th>
            <th>Frequenz</th>
            <th>mtl. Kosten</th>
            <th></th>
        </tr>
    </thead>
);

interface TableBodyProps {
    expenses: Expense[];
    addRows(category: string): void;
    removeRows(category: string, indexInCat?: number): void;
}
const TableBody: React.FC<TableBodyProps> = ({
    expenses,
    addRows,
    removeRows,
}) => {
    const categories: { [cat: string]: Expense[] } = {};
    expenses.forEach((expense) => {
        if (!(expense.category in categories)) {
            categories[expense.category] = [];
        }
        categories[expense.category].push(expense);
    });

    return (
        <tbody>
            {Object.keys(categories).map((category, i) => (
                <TableGroup
                    key={`${i}-${category[0]}`}
                    name={category}
                    sum={calcRegularCostSum(categories[category])}
                    expenses={categories[category]}
                    addRows={addRows}
                    removeRows={removeRows}
                />
            ))}
            <tr className="bgc-grey">
                <th colSpan={5}>
                    <button type="button" onClick={() => addRows("")}>
                        + Kategorie hinzufügen
                    </button>
                </th>
            </tr>
        </tbody>
    );
};

interface TableGroupProps {
    name: string;
    sum: number;
    expenses: Expense[];
    addRows(category: string): void;
    removeRows(category: string, indexInCat?: number): void;
}
const TableGroup: React.FC<TableGroupProps> = ({
    name,
    sum,
    expenses,
    addRows,
    removeRows,
}) => (
    <>
        <tr className="bgc-grey">
            <th className="ta-l" colSpan={3}>
                <input
                    className="w-100p"
                    defaultValue={name}
                    name={`category-${name}`}
                />
            </th>
            <th className="ta-r">{sum.toFixed(2)} €</th>
            <td>
                <button type="button" onClick={() => removeRows(name)}>
                    X
                </button>
            </td>
        </tr>
        {expenses.map((expense, i) => (
            <tr key={`${name}-${i}-${expenses.length}`}>
                <td>
                    <input
                        className="w-8em"
                        defaultValue={expense.name}
                        name={`name-${name}-${i}`}
                    />
                </td>
                <td className="ta-r">
                    <input
                        className="w-6em ta-r"
                        type="number"
                        defaultValue={expense.cost}
                        name={`cost-${name}-${i}`}
                    />
                    {" €"}
                </td>
                <td>
                    <select
                        defaultValue={expense.frequency}
                        name={`frequency-${name}-${i}`}
                    >
                        <option value="365.25">täglich</option>
                        <option value="52">wöchentlich</option>
                        <option value="26">2-wöchentlich</option>
                        <option value="13">4-wöchentlich</option>
                        <option value="12">monatlich</option>
                        <option value="6">2-monatlich</option>
                        <option value="4">quartalsweise</option>
                        <option value="2">halbjährlich</option>
                        <option value="1">jährlich</option>
                    </select>
                </td>
                <td className="ta-r">
                    {((expense.cost * expense.frequency) / 12).toFixed(2)} €
                </td>
                <td>
                    <button type="button" onClick={() => removeRows(name, i)}>
                        X
                    </button>
                </td>
            </tr>
        ))}
        <tr className="ta-c">
            <td colSpan={5}>
                <button type="button" onClick={() => addRows(name)}>
                    + Zeilen hinzufügen
                </button>
            </td>
        </tr>
    </>
);

interface TableFootProps {
    sum: number;
    buffer: number;
    setBuffer: React.Dispatch<number>;
}
const TableFoot: React.FC<TableFootProps> = ({ sum, buffer, setBuffer }) => (
    <tfoot className="bdt-1px ta-r">
        <tr>
            <th colSpan={3}>Summe:</th>
            <th>{sum.toFixed(2)} €</th>
            <th></th>
        </tr>
        <tr>
            <th colSpan={3}>
                {"+ "}
                <input
                    type="number"
                    className="w-3em"
                    value={buffer}
                    onChange={(ev) => setBuffer(parseInt(ev.target.value))}
                />
                {" % Puffer:"}
            </th>
            <th>{((sum * buffer) / 100).toFixed(2)} €</th>
            <th></th>
        </tr>
        <tr>
            <th colSpan={3}>gesamt:</th>
            <th>{(sum + (sum * buffer) / 100).toFixed(2)} €</th>
            <th></th>
        </tr>
    </tfoot>
);
