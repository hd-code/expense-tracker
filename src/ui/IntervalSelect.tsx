import React from "react";
import { intervals } from "../domain/Interval";

type SelectProps = React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
>;

const IntervalSelect: React.FC<SelectProps> = (props) => (
    <select {...props}>
        {Object.entries(intervals).map(([value, text], i) => (
            <option key={i} value={value}>
                {text}
            </option>
        ))}
    </select>
);

export default IntervalSelect;
