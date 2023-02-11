import * as React from "react";

export const TableHead: React.FC = () => (
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
