const API_URL = '/api';

class ApiService {
    static getHeaders() {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }

    static async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: this.getHeaders()
        };
        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'API Error');
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Auth
    static login(email, password) { return this.request('/auth/login', 'POST', { email, password }); }
    static register(data) { return this.request('/auth/register', 'POST', data); }

    // Food
    static addFood(data) { return this.request('/food', 'POST', data); }
    static getAvailableFood() { return this.request('/food', 'GET'); }
    static getMyFood() { return this.request('/food/mine', 'GET'); }

    // Requests
    static createRequest(foodId) { return this.request('/requests', 'POST', { foodId }); }
    static getMyRequests() { return this.request('/requests/mine', 'GET'); }
    static getIncomingRequests() { return this.request('/requests/incoming', 'GET'); }
    static updateRequestStatus(id, status) { return this.request(`/requests/${id}/status`, 'PUT', { status }); }
}
