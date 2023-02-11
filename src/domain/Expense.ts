export class Expense {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly cost: number,
        readonly frequency: number,
    ) {}

    get monthlyCost(): number {
        return (this.cost * this.frequency) / 12;
    }

    setName(name: string): Expense {
        return new Expense(this.id, name, this.cost, this.frequency);
    }
    setCost(cost: number): Expense {
        return new Expense(this.id, this.name, cost, this.frequency);
    }
    setFrequency(frequency: number): Expense {
        return new Expense(this.id, this.name, this.cost, frequency);
    }

    toRecord() {
        return {
            name: this.name,
            cost: this.cost,
            frequency: this.frequency,
        };
    }
}
