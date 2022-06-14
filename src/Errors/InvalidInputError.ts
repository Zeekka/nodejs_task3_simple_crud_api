export default class InvalidInputError extends Error {

    private input: string;

    constructor(message: string, input: string) {
        super(message);
        this.input = input;
    }

    getContext(): string {
        return `Got invalid input: ${this.input}`;
    }
}
