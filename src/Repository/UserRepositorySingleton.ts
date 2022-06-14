import User from '../User/User.js';
import DuplicateEntryError from '../Errors/DuplicateEntryError.js';

export default class UserRepositorySingleton {
    private static instance?: UserRepositorySingleton;

    private _users: User[] = [];

    static getInstance(): UserRepositorySingleton {
        if (UserRepositorySingleton.instance !== undefined) {
            return UserRepositorySingleton.instance;
        } else {
            return UserRepositorySingleton.instance = new UserRepositorySingleton();
        }
    }

    get users(): User[] {
        return this._users;
    }

    addUser(newUser: User): void | never {
        this._users.forEach((user) => {
            if (newUser.uuid === user.uuid) {
                throw new DuplicateEntryError('User already exists', newUser);
            }
        });

        this._users.push(newUser);
    }

    getUser(uuid: string): User {
        let requestedUser: User;

        this._users.forEach((user) => {
            if (uuid === user.uuid) {
                requestedUser = user;
            }
        });

        return requestedUser;
    }

    deleteUser(uuid: string): void {
        this._users = this._users.filter((user) => user.uuid !== uuid);
    }
}
