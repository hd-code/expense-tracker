import React from "react";
import { Interval, intervals } from "../domain/Interval";

export function IntervalChooser(props: {
    name: string;
    value: Interval;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) {
    const pairs = Object.entries(intervals);
    return (
        <select {...props} onChange={props.onChange}>
            {pairs.map(([value, name]) => (
                <option key={value} value={value}>
                    {name}
                </option>
            ))}
        </select>
    );
}
