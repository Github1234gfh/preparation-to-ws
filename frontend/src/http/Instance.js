export const Instance = (url, method, token = false, body = false) => {
    const headers = { 'Content-type': 'application/json', };
    if (token) { headers['Authorization'] = `Bearer ${token}` }
    if (method === "GET" || method === 'DELETE') 
    { return fetch(`http://localhost:8000/2/api-cart/${url}`, { method: method, headers: headers }) }
     else if (method === "POST" || method === 'PATCH') { return fetch(`http://localhost:8000/2/api-cart/${url}`, { method: method, headers: headers, body: JSON.stringify(body) },) }
}
