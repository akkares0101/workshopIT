// src/api.js

// ฐาน URL ของ backend (ตอนนี้รันที่เครื่องเราเอง)
export const API_BASE = "http://localhost:4000";


// ---- จัดการ token ----
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

// ---- ฟังก์ชันเรียก API กลาง ----
export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = options.headers ? { ...options.headers } : {};

  // ถ้าไม่ได้ส่ง FormData ให้ใส่ Content-Type เป็น JSON ให้เอง
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // แนบ token ถ้ามี
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.message || "เกิดข้อผิดพลาด";
    throw new Error(msg);
  }

  return res.json();
}
