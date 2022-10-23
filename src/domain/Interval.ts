export const intervals = Object.freeze({
    1: "jährlich",
    2: "halbjährlich",
    4: "quartalsweise",
    6: "2-monatlich",
    12: "monatlich",
    26: "2-wöchentlich",
    52: "wöchentlich",
    365.25: "täglich",
});

export type Interval = keyof typeof intervals;
