// src/api.js
const API_BASE = "http://192.168.1.10:4000";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).message || "เกิดข้อผิดพลาด";
    throw new Error(msg);
  }

  return res.json();
}

export { API_BASE };
