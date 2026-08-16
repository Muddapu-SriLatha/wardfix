// HTTP API Service Module leveraging Vite proxies (/api and /ai)

const getToken = () => localStorage.getItem('civicfix_token');

export async function fetchApi(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Auto handle JSON bodies unless FormData is passed
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

export async function fetchAiClassification(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await fetch('/ai/classify', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('AI classification request failed');
  }

  return response.json();
}
