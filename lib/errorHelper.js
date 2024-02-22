export const StatusError = (code, msg) => { //Funzione che mi aiuta nella gestione dello StatusError
    const error = new Error(msg);
    error.statusCode = code;
    return error;
}