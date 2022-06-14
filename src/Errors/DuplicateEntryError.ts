export default class DuplicateEntryError <Type> extends Error {

    private _obj: Type;

    constructor(message: string, obj: Type) {
        super(message);
        this._obj = obj;
    }

    getContext(): string {
        return 'Tried to add: ' + JSON.stringify(this._obj);
    }
}
