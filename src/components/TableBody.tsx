import { Expense, ExpenseGroup, ExpenseGroups } from "../domain";

interface TableBodyProps {
    expenseGroups: ExpenseGroups;
    addExpenseGroup: React.Dispatch<string>;
    removeExpenseGroup: React.Dispatch<number>;
    addExpensesToGroup: React.Dispatch<number>;
    removeExpense: React.Dispatch<number>;
}
export const TableBody: React.FC<TableBodyProps> = ({
    expenseGroups,
    addExpenseGroup,
    removeExpenseGroup,
    addExpensesToGroup,
    removeExpense,
}) => (
    <tbody>
        {expenseGroups.groups.map((expenseGroup) => (
            <TableGroup
                key={expenseGroup.id}
                {...{
                    expenseGroup,
                    addExpensesToGroup,
                    removeExpenseGroup,
                    removeExpense,
                }}
            />
        ))}
        <tr className="bgc-grey">
            <th colSpan={5}>
                <button type="button" onClick={() => addExpenseGroup("")}>
                    + Kategorie hinzufügen
                </button>
            </th>
        </tr>
    </tbody>
);

interface TableGroupProps {
    expenseGroup: ExpenseGroup;
    addExpensesToGroup: React.Dispatch<number>;
    removeExpenseGroup: React.Dispatch<number>;
    removeExpense: React.Dispatch<number>;
}
const TableGroup: React.FC<TableGroupProps> = ({
    expenseGroup,
    addExpensesToGroup,
    removeExpenseGroup,
    removeExpense,
}) => (
    <>
        <tr className="bgc-grey">
            <th className="ta-l" colSpan={3}>
                <input
                    className="w-100p"
                    defaultValue={expenseGroup.name}
                    name={`category-${expenseGroup.id}`}
                />
            </th>
            <th className="ta-r">{expenseGroup.monthlyCost.toFixed(2)} €</th>
            <td>
                <button
                    type="button"
                    onClick={() => removeExpenseGroup(expenseGroup.id)}
                >
                    X
                </button>
            </td>
        </tr>
        {expenseGroup.expenses.map((expense) => (
            <TableRow key={expense.id} {...{ expense, removeExpense }} />
        ))}
        <tr className="ta-c">
            <td colSpan={5}>
                <button
                    type="button"
                    onClick={() => addExpensesToGroup(expenseGroup.id)}
                >
                    + Zeilen hinzufügen
                </button>
            </td>
        </tr>
    </>
);

interface TableRowProps {
    expense: Expense;
    removeExpense: React.Dispatch<number>;
}
const TableRow: React.FC<TableRowProps> = ({ expense, removeExpense }) => (
    <tr key={expense.id}>
        <td>
            <input
                className="w-8em"
                defaultValue={expense.name}
                name={`name-${expense.id}`}
            />
        </td>
        <td className="ta-r">
            <input
                className="w-6em ta-r"
                type="number"
                defaultValue={expense.cost}
                name={`cost-${expense.id}`}
            />
            {" €"}
        </td>
        <td>
            <select
                defaultValue={expense.frequency}
                name={`frequency-${expense.id}`}
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
        <td className="ta-r">{expense.monthlyCost.toFixed(2)} €</td>
        <td>
            <button type="button" onClick={() => removeExpense(expense.id)}>
                X
            </button>
        </td>
    </tr>
);
