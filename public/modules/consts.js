export const API_URL = "http://localhost:8080/api/v1";//'http://94.139.246.134:8080/api/v1';

export const responses = (ok, body, error) => {
    return {
        ok: ok,
        body: body,
        error: error,
    }
}