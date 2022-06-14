import dotenv from 'dotenv';
import http from 'http';
import UserRepositorySingleton from './Repository/UserRepositorySingleton.js';
import User from './User/User.js';
import UserDTO from './types/UserDTO.js';
import { validateUserInput, requiredUserFields } from './utils/validateUserInput.js';
import InvalidInputError from './Errors/InvalidInputError.js';
import { response200, response201, response400, response500 } from './utils/responses.js';

dotenv.config();

const server: http.Server = http.createServer(async (request, response) => {
    if (request.url === '/api/users' && request.method === 'GET') {
        response200(
            response,
            {
                'Content-Type': 'application/json'
            },
            JSON.stringify(UserRepositorySingleton.getInstance().users)
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
                response400(response, 'Invalid user data provided');
            } else {
                response500(response, 'Internal error occurred :<');
            }
        }
    } else {
        response.writeHead(404, {
            'Content-Type': 'text/html'
        });

        response.write('Url not found :<');
        response.end();
    }
});

const applicationPort: number = process.env.APPLICATION_PORT ? Number(process.env.APPLICATION_PORT) : 80;

server.listen(applicationPort, () => {
    console.log(`Application is running on port ${applicationPort}`);
});
