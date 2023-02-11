import { ExpenseGroups } from "../domain";
import { ExpenseGroupsState } from "../state/ExpenseGroupsState";
import { download, openFile } from "../util/domfiles";
import { TableBody } from "./TableBody";
import { TableFoot } from "./TableFoot";
import { TableHead } from "./TableHead";

export const Table: React.FC<ExpenseGroupsState> = (expGState) => {
    const saveToFile = () => {
        const data = JSON.stringify(expGState.expenseGroups.toRecords());
        download(data, "Lebenshaltungskosten.json");
    };

    const loadFile = () => {
        openFile().then((fileData) => {
            const data = JSON.parse(fileData);
            try {
                const groups = ExpenseGroups.fromRecords(data);
                expGState.setExpenseGroups(groups);
            } catch (err) {
                console.error(err);
                alert("Fehler: Unbekanntes Dateiformat");
            }
        });
    };

    const onChange = (ev: React.ChangeEvent<HTMLFormElement>) => {
        ev?.preventDefault();

        const [field, idString] = ev.target.name.split("-");
        const id = parseInt(idString);
        const value: string = ev.target.value;

        switch (field) {
            case "category":
                const group = expGState.expenseGroups.getGroup(id);
                expGState.updateExpenseGroup(group.setName(value));
                break;
            case "name":
                const e1 = expGState.expenseGroups.getExpense(id);
                expGState.updateExpense(e1.setName(value));
                break;
            case "cost":
                const e2 = expGState.expenseGroups.getExpense(id);
                expGState.updateExpense(e2.setCost(parseFloat(value)));
                break;
            case "frequency":
                const e3 = expGState.expenseGroups.getExpense(id);
                expGState.updateExpense(e3.setFrequency(parseFloat(value)));
                break;
        }
    };

    return (
        <form onChange={onChange}>
            <table className="whs-nw">
                <TableHead />
                <TableBody {...expGState} />
                <TableFoot {...expGState} />
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
