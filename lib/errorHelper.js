export const StatusError = (code, msg) => {
    const error = new Error(msg);
    error.statusCode = code;
    return error;
}