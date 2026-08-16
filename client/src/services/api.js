import { getLocalIssues } from './mockData';

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

  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (endpoint.includes('/issues')) {
        const issuesList = getLocalIssues();
        return { issues: issuesList, issue: issuesList[0], comments: [] };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return data;
  } catch (err) {
    if (endpoint.includes('/issues')) {
      const issuesList = getLocalIssues();
      return { issues: issuesList, issue: issuesList[0], comments: [] };
    }
    throw err;
  }
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
