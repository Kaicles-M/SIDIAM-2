const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const tokenFromStorage = localStorage.getItem('token');
  if (tokenFromStorage && tokenFromStorage !== 'null') {
    return tokenFromStorage;
  }

  const cookieHeader = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('token='));

  if (!cookieHeader) {
    return null;
  }

  return decodeURIComponent(cookieHeader.slice('token='.length));
};

const dispatchAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:change'));
  }
};

const setAuthSession = (token, user) => {
  if (token) {
    localStorage.setItem('token', token);
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }

  document.cookie = `token=${encodeURIComponent(token || '')}; path=/; max-age=28800; SameSite=Lax`;
  dispatchAuthChange();
};

const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  dispatchAuthChange();
};

const buildAuthHeaders = (headers = {}) => {
  const token = getStoredToken();
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const apiFetch = async (url, options = {}) => {
  const requestHeaders = buildAuthHeaders(options.headers || {});
  return fetch(url, {
    ...options,
    headers: requestHeaders,
    credentials: 'include'
  });
};

export { apiFetch, buildAuthHeaders, clearAuthSession, getStoredToken, setAuthSession };
