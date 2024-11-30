// api.js
const API_BASE = "http://localhost:9814/is-lab1-backend-1.0-SNAPSHOT/api";

let token = localStorage.getItem("token");

export const clearToken = () => {
    token = null;
    localStorage.removeItem("role");
    localStorage.removeItem("token");
};

const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

export const api = {
    get: async (url) => {
        const response = await fetch(`${API_BASE}${url}`, {
            method: "GET",
            headers: headers(),
        });
        const updatedData = replaceNullWithZero(response.json());
        return updatedData;
    },

    post: async (url, data) => {
        const response = await fetch(`${API_BASE}${url}`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(data),
        });
        const updatedData = replaceNullWithZero(response.json());
        return updatedData;
    }
};

function replaceNullWithZero(obj) {
    if (Array.isArray(obj)) {
        return obj.map((item) => replaceNullWithZero(item));
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (obj[key] === null) {
                obj[key] = 0;
            } else if (typeof obj[key] === 'object') {
                obj[key] = replaceNullWithZero(obj[key]);
            }
        }
    }
    return obj;
}