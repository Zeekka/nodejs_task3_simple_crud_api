export default class NotFoundError extends Error {

    private uuid: string;

    constructor(message: string, uuid: string) {
        super(message);
        this.uuid = uuid;
    }

    getContext(): string {
        return `User with uuid: ${this.uuid} not found`;
    }
}