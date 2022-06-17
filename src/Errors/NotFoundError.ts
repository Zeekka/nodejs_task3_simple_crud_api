export default class NotFoundError extends Error {

    private context: string;

    constructor(message: string, context: string) {
        super(message);
        this.context = context;
    }

    getContext(): string {
        return `Context ${this.context} not found`;
    }
}