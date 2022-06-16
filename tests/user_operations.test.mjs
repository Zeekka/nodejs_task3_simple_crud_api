import http, { get, request } from 'http';
import { validate } from 'uuid';
import dotenv from 'dotenv';

dotenv.config()

const options = {
    host: process.env.APPLICATION_PLATFORM === 'docker' ? 'host.docker.internal' : 'localhost',
    path: '/api/users',
    port: Number(process.env.APPLICATION_PORT) ?? 80
}

describe('User operations', () => {
    test('Get all users', () => {
        get(options, (request) => {
            const data = []
            request.on('data', (chunk) => {
                data.push(chunk)
            })

            request.on('end', () => {
                expect(JSON.parse(data.join())).toEqual([]);
            })
        });
    })

    test('Create user', () => {
        const user = {
            username: "Test",
            age: 18,
            hobbies: ["age", "hobbies"]
        }

        const requestPayload = JSON.stringify(user);

        const additionalOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestPayload),
            }
        }

        const req = request({...options, ...additionalOptions}, (request) => {
            const data = []
            request.on('data', (chunk) => {
                data.push(chunk)
            })

            request.on('end', () => {
                const newUser = JSON.parse(data.join());
                const {_username, _age, _hobbies, _uuid} = newUser;

                expect(_username).toBeDefined();
                expect(_username).toBe(user.username);

                expect(_age).toBeDefined();
                expect(_age).toBe(user.age);

                expect(_hobbies).toBeDefined();
                expect(_hobbies).toEqual(user.hobbies);

                expect(_uuid).toBeDefined();
                expect(validate(_uuid)).toBe(true);
            })
        });

        req.write(requestPayload);
        req.end()
    });

    test('Create user and get it', () => {
        const user = {
            username: "Test2",
            age: 20,
            hobbies: ["age", "hobbies"]
        }

        const requestPayload = JSON.stringify(user);

        const additionalOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestPayload),
            }
        }

        const req = request({...options, ...additionalOptions}, (request) => {
            const data = []
            request.on('data', (chunk) => {
                data.push(chunk)
            })

            request.on('end', () => {
                const newUser = JSON.parse(data.join());
                get({...options, path: options.path + "/" + newUser._uuid}, (req) => {
                    const getData = [];
                    req.on('data', (chunk) => {
                        getData.push(chunk)
                    });

                    req.on('end', () => {
                        const gotUser = JSON.parse(getData.join());
                        expect(gotUser).toEqual(newUser);
                    });
                });
            });
        });

        req.write(requestPayload);
        req.end()
    });
});
