const API_BASES = ['/api', 'http://127.0.0.1:8080/api', 'http://localhost:8080/api'];

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('quiz_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let lastError = null;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const errorMsg = (data && data.message) || response.statusText || 'Request failed';
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      lastError = err;
      // If it's an HTTP error with a message from backend (e.g. invalid credentials), don't retry other bases
      if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError') && !err.message.includes('fetch')) {
        throw err;
      }
    }
  }

  throw new Error(lastError?.message === 'Failed to fetch' 
    ? 'Unable to connect to the backend server. Please make sure the Spring Boot backend is running on port 8080.' 
    : (lastError?.message || 'Connection failed'));
}

export const authApi = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getMe: () => apiRequest('/auth/me'),
};

export const categoryApi = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`),
  create: (data) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/categories/${id}`, {
    method: 'DELETE'
  }),
};

export const quizApi = {
  getActive: () => apiRequest('/quizzes/active'),
  getByCategory: (catId) => apiRequest(`/quizzes/category/${catId}`),
  getForTaking: (id) => apiRequest(`/quizzes/${id}/take`),
  getAdminAll: () => apiRequest('/quizzes/admin/all'),
  getAdminById: (id) => apiRequest(`/quizzes/admin/${id}`),
  create: (data) => apiRequest('/quizzes', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/quizzes/${id}`, {
    method: 'DELETE'
  }),
  addQuestion: (quizId, data) => apiRequest(`/quizzes/${quizId}/questions`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateQuestion: (questionId, data) => apiRequest(`/quizzes/questions/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteQuestion: (questionId) => apiRequest(`/quizzes/questions/${questionId}`, {
    method: 'DELETE'
  }),
};

export const attemptApi = {
  submit: (submission) => apiRequest('/attempts/submit', {
    method: 'POST',
    body: JSON.stringify(submission)
  }),
  getById: (id) => apiRequest(`/attempts/${id}`),
  getMyHistory: () => apiRequest('/attempts/my-history'),
  getLeaderboard: () => apiRequest('/attempts/leaderboard'),
};

export const adminApi = {
  getStats: () => apiRequest('/admin/stats'),
  getAllAttempts: () => apiRequest('/admin/attempts'),
};
