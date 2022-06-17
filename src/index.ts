import dotenv from 'dotenv';
import http from 'http';
import UserRepositorySingleton from './Repository/UserRepositorySingleton.js';
import User from './User/User.js';
import UserDTO from './types/UserDTO.js';
import { validateUserInput, requiredUserFields } from './utils/validateUserInput.js';
import InvalidInputError from './Errors/InvalidInputError.js';
import { validate } from 'uuid';
import { response200, response201, response400, response404, response500, response204 } from './utils/responses.js';
import NotFoundError from './Errors/NotFoundError.js';
import cluster from 'cluster';
import os from 'os';

dotenv.config();

const server: http.Server = http.createServer(async (request, response) => {
    if (isVerboseMode) {
        console.log(`Application pid: ${process.pid} got request :: ${request.method} ${request.url}`);
    }

    try {
        let responseContent!: User | User[];
        if (request.url?.startsWith('/api/users') && request.method === 'GET') {
            if (request.url?.split('/').length === 4) {
                const uuid: string = request.url?.split('/').pop() as string;
                if (!validate(uuid)) {
                    throw new InvalidInputError('Invalid uuid provided', uuid);
                }

                try {
                    responseContent = UserRepositorySingleton.getInstance().getUser(uuid) as User;
                } catch (err) {
                    if (err instanceof NotFoundError) {
                        throw err;
                    }
                }
            } else {
                responseContent = UserRepositorySingleton.getInstance().users;
            }

            response200(
                response,
                {
                    'Content-Type': 'application/json'
                },
                JSON.stringify(responseContent)
            );
        } else if (request.url === '/api/users' && request.method === 'POST') {
            try {
                const buffers = [];

                for await (const chunk of request) {
                    buffers.push(chunk);
                }

                const requestBodyContent: string = Buffer.concat(buffers).toString();
                const requestPayload: UserDTO = JSON.parse(requestBodyContent);

                if (!validateUserInput(requestPayload, requiredUserFields)) {
                    throw new InvalidInputError('Invalid input', requestBodyContent);
                }

                const newUser: User = new User(requestPayload);
                UserRepositorySingleton.getInstance().addUser(newUser);

                response201(response,
                    {
                        'Content-Type': 'application/json',
                    },
                    JSON.stringify(newUser)
                );
            } catch (err) {
                if (err instanceof InvalidInputError) {
                    throw err;
                } else {
                    response500(response, 'Internal error occurred :<');
                }
            }
        } else if (request.url?.startsWith('/api/users') && request.method === 'DELETE') {
            const uuid: string = request.url?.split('/').pop() as string;
            if (!validate(uuid)) {
                throw new InvalidInputError('Invalid uuid provided', uuid);
            }

            UserRepositorySingleton.getInstance().getUser(uuid)
            UserRepositorySingleton.getInstance().deleteUser(uuid);

            response204(response, {'Content-Type': 'text/html'}, 'OK');
        } else if (request.url?.startsWith('/api/users') && request.method === 'PUT') {
            const uuid: string = request.url?.split('/').pop() as string;
            if (!validate(uuid)) {
                throw new InvalidInputError('Invalid uuid provided', uuid);
            }

            const user: User = UserRepositorySingleton.getInstance().getUser(uuid)

            const buffers = [];

            for await (const chunk of request) {
                buffers.push(chunk);
            }

            const requestBodyContent: string = Buffer.concat(buffers).toString();
            const requestPayload: UserDTO = JSON.parse(requestBodyContent);

            if (!validateUserInput(requestPayload, requiredUserFields)) {
                throw new InvalidInputError('Invalid input', requestBodyContent);
            }

            user.update(requestPayload);

            response200(response,
                {
                    'Content-Type': 'application/json',
                },
                JSON.stringify(user)
            );
        } else {
            throw new NotFoundError('Url not found :<', request.url ?? '');
        }
    } catch (err) {
        if (err instanceof InvalidInputError) {
            response400(response, err.message);
        } else if (err instanceof NotFoundError) {
            response404(response, err.message);
        } else {
            response500(response, 'Internal server error :< ');
        }
    }
});

const cpusNumber: number = os.cpus().length;
const isClusterMode: boolean = process.argv.includes('--cluster');
const isVerboseMode: boolean = process.argv.includes('--verbose');
const applicationPort: number = process.env.APPLICATION_PORT ? Number(process.env.APPLICATION_PORT) : 80;

if (cluster.isPrimary && isClusterMode) {
    for (let i = 0; i < cpusNumber; i++) {
        cluster.fork();
    }
} else {
    server.listen(applicationPort, () => {
        console.log(`Application pid: ${process.pid} is running on port ${applicationPort}`);
    });
}
