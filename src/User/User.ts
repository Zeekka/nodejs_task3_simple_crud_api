import UserDTO from '../types/UserDTO';
import { v4 as uuidv4 } from 'uuid';

export default class User {
    private _uuid: string;
    private _username: string;
    private _age: number;
    private _hobbies: string[];

    constructor(user: UserDTO) {
        this._uuid = uuidv4();
        this._username = user.username;
        this._age = user.age;
        this._hobbies = user.hobbies;
    }

    get uuid(): string {
        return this._uuid;
    }

    get username(): string {
        return this._username;
    }

    get age(): number {
        return this._age;
    }

    get hobbies(): string[] {
        return this._hobbies;
    }

    update(newData: UserDTO): User {
        this._username = newData.username;
        this._age = newData.age;
        this._hobbies = newData.hobbies;

        return this;
    }
}
