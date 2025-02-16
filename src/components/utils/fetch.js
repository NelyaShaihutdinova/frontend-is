const API_BASE = "http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api";

let token = localStorage.getItem("token");

export const clearToken = () => {
    token = null;
    localStorage.removeItem("role");
    localStorage.removeItem("token");
};

export const getData = async (url, tokenGet) => {
    const response = await fetch(`${API_BASE}${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenGet}`,
        },
    });
    return replaceNullWithZero(await response.json());
}

export const postData = async (url, data) => {
    return await fetch(`${API_BASE}${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
}

export const deleteData = async (url) => {
    return await fetch(`${API_BASE}${url}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}

export function replaceNullWithZero(obj) {
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

export function buildUrl(url, filterColumn, filter, sorted, page) {
    const queryParams = new URLSearchParams();

    if (filterColumn && filterColumn.value) {
        queryParams.append('filter-column', filterColumn.value);
    }
    if (filter && filter.value) {
        queryParams.append('filter-value', filter.value);
    }
    if (sorted && sorted.value) {
        queryParams.append('sorted', sorted.value);
    }
    if (page) {
        queryParams.append('page', page)
    }
    return `${url}?${queryParams.toString()}`;
}

export const fetchData = async (url, filterColumnRef, filterRef, sortedRef, page, token) => {
    const filterColumn = filterColumnRef.current.value;
    const filter = filterRef.current.value;
    const sorted = sortedRef.current.value;
    const buildedUrl = buildUrl(url, filterColumn, filter, sorted, page);
    return getData(buildedUrl, token);
}
