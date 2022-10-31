import { intervals } from "../domain/Interval";
import React from "react";

type SelectProps = React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
>;

export const IntervalSelect: React.FC<SelectProps> = (props) => (
    <select {...props}>
        {Object.entries(intervals).map(([value, text], i) => (
            <option key={i} value={value}>
                {text}
            </option>
        ))}
    </select>
);
