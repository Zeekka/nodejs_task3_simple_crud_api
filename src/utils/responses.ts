import http from 'http';

const getResponse = (
    serverResponse: http.ServerResponse,
    code: number,
    responseHeaders: http.OutgoingHttpHeaders | http.OutgoingHttpHeader[],
    responseContent?: string
): http.ServerResponse => {
    serverResponse.writeHead(code, responseHeaders);
    serverResponse.write(responseContent);
    serverResponse.end();

    return serverResponse;
}

const response400 = (serverResponse: http.ServerResponse, message?: string): http.ServerResponse => {
    return getResponse(serverResponse, 400, {
        'Content-Type': 'text/html',
    }, message);
}

const response500 = (serverResponse: http.ServerResponse, message?: string): http.ServerResponse => {
    return getResponse(serverResponse, 500, {
        'Content-Type': 'text/html',
    }, message);
}

const response404 = (serverResponse: http.ServerResponse, message?: string): http.ServerResponse => {
    return getResponse(serverResponse, 404, {
        'Content-Type': 'text/html',
    }, message);
}

const response200 = (
    serverResponse: http.ServerResponse,
    responseHeaders: http.OutgoingHttpHeaders | http.OutgoingHttpHeader[],
    message?: string
): http.ServerResponse => {
    return getResponse(serverResponse, 200, responseHeaders, message);
}

const response201 = (
    serverResponse: http.ServerResponse,
    responseHeaders: http.OutgoingHttpHeaders | http.OutgoingHttpHeader[],
    message?: string
): http.ServerResponse => {
    return getResponse(serverResponse, 201, responseHeaders, message);
}

const response204 = (
    serverResponse: http.ServerResponse,
    responseHeaders: http.OutgoingHttpHeaders | http.OutgoingHttpHeader[],
    message?: string
): http.ServerResponse => {
    return getResponse(serverResponse, 204, responseHeaders, message);
}

export {
    response201,
    response200,
    response500,
    response400,
    response404,
    response204
}
