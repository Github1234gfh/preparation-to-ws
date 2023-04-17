export const Instance = (url, method, token = null, body = null) =>
    fetch(`http://localhost:8000/2/api-cart/${url}`,
        {
            method: method,
            headers: { 'Content-type': 'application/json', 'Authorization': token && `Bearer ${token}` },
            body: body && JSON.stringify(body)
        }
    )