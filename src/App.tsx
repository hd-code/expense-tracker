import * as React from "react";
import { Table } from "./components";
import { useExpenseGroupsState } from "./state";

export const App: React.FC = () => {
    const expenseGroupsState = useExpenseGroupsState();
    return (
        <div className="d-f jc-c">
            <div className="ovx-a">
                <h1 className="fs-150p ta-c">Lebenshaltungskosten berechnen</h1>
                <Table {...expenseGroupsState} />
            </div>
        </div>
    );
};
