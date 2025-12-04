// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { API_BASE, apiRequest } from "./api";
import logoMT from "./assets/mdt.png";
import { AlertContainer, useAlert } from "./AlertContext";

// ================== Component ป้องกันหน้า (PrivateRoute) ==================
function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-center">กำลังโหลด...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="p-6 text-center text-red-500">ไม่มีสิทธิ์เข้าถึง</div>
    );
  }
  return children;
}

// ================== Navbar ==================
// ====== Navbar (แทนของเดิมได้เลย) ======
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-30 bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* โลโก้ + ชื่อระบบ */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-white/30 blur-sm" />
            <img
              src={logoMT}
              alt="Media & Training logo"
              className="relative h-10 w-10 rounded-2xl object-contain border border-white/70 shadow-md bg-white"
            />
          </div>
          <div className="leading-tight">
            <Link
              to="/"
              className="block font-semibold tracking-tight text-sm sm:text-base"
            >
              Media &amp; Training
            </Link>
            <p className="text-[11px] text-sky-50/90">
              สื่อการสอน &amp; ใบงานสำหรับเด็กอนุบาลและประถม
            </p>
          </div>
        </div>

        {/* เมนูด้านขวา */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {user && (
            <>
              <Link
                to="/worksheets"
                className="hidden sm:inline-flex items-center rounded-full px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 transition"
              >
                📚 ใบงานนักเรียน
              </Link>
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center rounded-full px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 transition"
              >
                🧑‍🏫 สำหรับครู/ผู้ปกครอง
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center rounded-full px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 transition"
                >
                  🛠️ Admin
                </Link>
              )}
            </>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px]">
                {user.name} • {user.role}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="inline-flex items-center gap-1 rounded-full bg-white text-slate-800 px-3 py-1.5 text-xs font-semibold shadow hover:bg-slate-100"
              >
                🚪 ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1 rounded-full bg-white text-slate-900 px-3 py-1.5 text-xs sm:text-sm font-semibold shadow hover:bg-slate-100"
            >
              🔑 เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ================== หน้า Login ==================
// ====== หน้า Login (สไตล์ใหม่) ======
function LoginPage() {
  const { user, login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [email, setEmail] = useState("teacher@example.com");
  const [password, setPassword] = useState("teacher123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/worksheets");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      showAlert("ล็อกอินสำเร็จ ยินดีต้อนรับคุณครู 🌈", "success");
      navigate("/worksheets");
    } catch (err) {
      const msg = err.message || "ล็อกอินไม่สำเร็จ";
      setError(msg);
      showAlert(msg, "error");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-sky-100 via-pink-50 to-amber-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* ตุ๊กตา / ของตกแต่งลอย ๆ */}
      <div className="pointer-events-none select-none">
        <span className="hidden md:block absolute left-6 top-6 text-5xl opacity-40">
          🧸
        </span>
        <span className="hidden md:block absolute right-8 bottom-10 text-5xl opacity-40">
          ✏️
        </span>
        <span className="hidden md:block absolute left-10 bottom-6 text-4xl opacity-30">
          📚
        </span>
      </div>

      <div className="max-w-md w-full relative">
        {/* การ์ดหลัก */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-[0_18px_40px_rgba(148,163,184,0.45)] border border-slate-100 px-6 py-7">
          {/* หัวการ์ด */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-pink-400 via-amber-300 to-sky-400 flex items-center justify-center text-2xl shadow-md">
              🎓
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                เข้าสู่ระบบครู / ผู้ปกครอง
              </h1>
              <p className="text-[11px] text-slate-500">
                ใช้บัญชีตัวอย่างเพื่อทดลองระบบได้เลย
              </p>
            </div>
          </div>
          {error && (
            <div className="mb-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-2xl px-3 py-2 flex gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ฟอร์มล็อกอิน */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">อีเมล</label>
              <input
                type="email"
                className="w-full border border-slate-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                className="w-full border border-slate-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 text-white text-sm font-semibold py-2.5 shadow hover:brightness-110"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>

        {/* การ์ดเล็กข้างใต้ */}
        <div className="mt-4 text-center text-[11px] text-slate-500">
          ใช้ร่วมกับใบงานหน้าแรกสำหรับเด็ก ๆ ได้ทันที 🌈
        </div>
      </div>
    </div>
  );
}

// ================== Modal พรีวิวใบงาน ==================
function PreviewModal({ worksheet, onClose }) {
  if (!worksheet) return null;

  const url = worksheet.fileUrl;
  const lower = (url || "").toLowerCase();

  const isImage =
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".webp");

  const isPdf = lower.endsWith(".pdf");

  let createdAtText = "";
  if (worksheet.createdAt) {
    try {
      createdAtText = new Date(worksheet.createdAt).toLocaleDateString(
        "th-TH",
        { year: "numeric", month: "short", day: "numeric" }
      );
    } catch {
      createdAtText = "";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-pink-50 via-sky-50 to-violet-50 rounded-3xl max-w-2xl w-full mx-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col border border-white/70">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/70 bg-white/70 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-pink-400 via-amber-300 to-sky-400 flex items-center justify-center text-lg">
              📄
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 line-clamp-2">
                {worksheet.title}
              </h3>
              <p className="text-[11px] text-slate-500">
                {worksheet.subject} • {worksheet.grade} •{" "}
                {worksheet.difficulty || "ง่าย"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-lg leading-none px-2 rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* BODY (รายละเอียดใบงาน) */}
        <div className="px-4 pt-4 pb-3 bg-slate-50/60">
          <div className="grid gap-3 md:grid-cols-[2fr,1.4fr] items-start">
            {/* ซ้าย: เนื้อหาแบบย่อ */}
            <div className="bg-white/80 rounded-2xl border border-slate-100 p-3 sm:p-4">
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                  🎨 วิชา: {worksheet.subject}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-lime-100 text-lime-700">
                  🎒 ชั้น: {worksheet.grade}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  ⭐ ความยาก: {worksheet.difficulty || "ง่าย"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 mb-2">
                {worksheet.description && worksheet.description.trim() !== ""
                  ? worksheet.description
                  : "ใบงานนี้ช่วยให้เด็ก ๆ ได้ฝึกทักษะพื้นฐานอย่างสนุกสนาน คุณครูสามารถใช้เป็นกิจกรรมในห้องเรียนหรือการบ้านก็ได้ 😊"}
              </p>

              <ul className="text-[11px] text-slate-500 space-y-1">
                <li>• เหมาะสำหรับ: {worksheet.grade || "ระดับประถม"}</li>
                <li>
                  • จำนวนหน้า:{" "}
                  {worksheet.pages ? `${worksheet.pages} หน้า` : "ไม่ระบุ"}
                </li>
                <li>
                  • จัดทำโดย:{" "}
                  {worksheet.uploaderName || "คุณครู Media & Training"}
                </li>
                {createdAtText && <li>• ลงเมื่อ: {createdAtText}</li>}
              </ul>
            </div>

            {/* ขวา: ไอเดียการใช้ + ข้อมูลไฟล์ */}
            <div className="bg-white/80 rounded-2xl border border-slate-100 p-3 sm:p-4 text-[11px] sm:text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <p className="font-semibold text-slate-700">
                  ไอเดียการใช้ใบงาน
                </p>
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>ใช้เป็นกิจกรรมเปิดคาบเรียน ให้เด็ก ๆ ได้วอร์มอัพสมอง</li>
                <li>ให้เป็นการบ้านเสริมทบทวนบทเรียนที่เรียนไปแล้ว</li>
                <li>พิมพ์แจกหรือเปิดจากแท็บเล็ตให้เด็กดูแล้วทำตาม</li>
              </ul>

              <div className="pt-2 border-t border-dashed border-slate-200/70">
                <p className="font-semibold text-slate-700 mb-1">ข้อมูลไฟล์</p>
                <p className="text-[11px] break-all">
                  ชื่อไฟล์:{" "}
                  {worksheet.originalName || "ยังไม่มีชื่อไฟล์ที่ระบบบันทึกไว้"}
                </p>
                <p className="text-[11px]">
                  สถานะไฟล์:{" "}
                  {url ? (
                    <span className="text-emerald-600 font-semibold">
                      มีไฟล์แนบพร้อมใช้งาน ✅
                    </span>
                  ) : (
                    <span className="text-rose-500 font-semibold">
                      ยังไม่มีไฟล์แนบ ❌
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW ไฟล์จริง */}
        <div className="bg-slate-100/60 px-4 pb-4">
          {url ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {isImage && (
                <img
                  src={url}
                  alt={worksheet.title}
                  className="max-h-[40vh] w-full object-contain bg-white"
                />
              )}

              {isPdf && (
                <iframe
                  src={url}
                  title={worksheet.title}
                  className="w-full h-[40vh] bg-white"
                />
              )}

              {!isImage && !isPdf && (
                <div className="p-4 text-center text-sm text-slate-500">
                  ไม่สามารถแสดงตัวอย่างไฟล์ชนิดนี้ได้ในหน้าเว็บ
                  <br />
                  กดปุ่มด้านล่างเพื่อเปิดไฟล์เต็มจอได้เลยนะ 💾
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/80 rounded-2xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
              ใบงานนี้ยังไม่มีไฟล์แนบ คุณครูสามารถเพิ่มไฟล์จากหน้าแดชบอร์ดได้ 🧑‍🏫
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t border-slate-100/70 bg-white/80 flex justify-between items-center gap-2">
          <div className="text-[11px] text-slate-400 line-clamp-1">
            Media &amp; Training • ระบบสื่อใบงานสำหรับเด็ก
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-400 via-amber-400 to-sky-400 text-white px-3 py-1.5 font-semibold shadow-sm hover:brightness-110"
            >
              📥 ดาวน์โหลด / เปิดเต็มจอ
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
// ====== Modal แก้ไขใบงาน (เฉพาะ Admin) ======
function EditWorksheetModal({ worksheet, onClose, onSave }) {
  const [title, setTitle] = useState(worksheet.title || "");
  const [subject, setSubject] = useState(worksheet.subject || "ภาษาไทย");
  const [grade, setGrade] = useState(worksheet.grade || "อนุบาล 3-4");
  const [difficulty, setDifficulty] = useState(worksheet.difficulty || "ง่าย");
  const [pages, setPages] = useState(
    worksheet.pages != null ? String(worksheet.pages) : ""
  );
  const [description, setDescription] = useState(worksheet.description || "");

  const SUBJECT_OPTIONS = ["ภาษาไทย", "คณิตศาสตร์", "ภาษาอังกฤษ"];
  const GRADE_OPTIONS = [
    "อนุบาล 3–4 ปี",
    "อนุบาล 4–5 ปี",
    "อนุบาล 5–6 ปี",
    "ประถมต้น",
    "ประถมปลาย",
  ];
  const DIFFICULTY_OPTIONS = ["ง่าย", "ปานกลาง", "ยาก"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      subject,
      grade,
      difficulty,
      pages,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-amber-50 via-pink-50 to-sky-50 rounded-3xl max-w-lg w-full mx-4 shadow-[0_18px_45px_rgba(15,23,42,0.35)] overflow-hidden border border-white/70">
        {/* HEADER */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100/70 bg-white/80">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-amber-400 via-pink-400 to-sky-400 flex items-center justify-center text-lg">
              ✏️
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                แก้ไขใบงาน
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                ID: {worksheet.id} • โดย {worksheet.uploaderName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-lg leading-none px-2 rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* BODY: ฟอร์มแก้ไข */}
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-600 mb-1">
              ชื่อใบงาน
            </label>
            <input
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น แบบฝึกหัดบวกเลข 1–10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">
                วิชา
              </label>
              <select
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">
                ระดับชั้น
              </label>
              <select
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-600 mb-1">
                ความยาก
              </label>
              <select
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">
                จำนวนหน้า (ปล่อยว่างได้)
              </label>
              <input
                type="number"
                min="1"
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 mb-1">
              คำอธิบายใบงาน
            </label>
            <textarea
              rows={3}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น เน้นฝึกการนับเลข / ใช้เวลาประมาณ 15 นาที ฯลฯ"
            />
          </div>

          {/* FOOTER ปุ่มบันทึก / ยกเลิก */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-full border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-400 via-amber-400 to-sky-400 text-[11px] font-semibold text-white hover:brightness-110"
            >
              ✅ บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ================== Grid ใบงานสำหรับนักเรียน (หน้าแรก) ==================
// ====== Grid ใบงานสำหรับนักเรียน (แทนของเดิม) ======
function StudentWorksheetGrid() {
  const [worksheets, setWorksheets] = useState([]);
  const [subject, setSubject] = useState("ทั้งหมด");
  const [grade, setGrade] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);

  const SUBJECT_OPTIONS = ["ทั้งหมด", "ภาษาไทย", "คณิตศาสตร์", "ภาษาอังกฤษ"];
  const GRADE_OPTIONS = [
    "ทั้งหมด",
    "อนุบาล 3-4 ปี",
    "อนุบาล 4-5 ปี",
    "อนุบาล 5-6 ปี",
    "ประถมต้น",
    "ประถมปลาย",
  ];

  const loadWorksheets = async () => {
    try {
      const params = new URLSearchParams();
      if (subject !== "ทั้งหมด") params.append("subject", subject);
      if (grade !== "ทั้งหมด") params.append("grade", grade);
      if (search) params.append("search", search);

      let path = "/api/worksheets";
      const query = params.toString();
      if (query) path += `?${query}`;

      const data = await apiRequest(path);
      setWorksheets(data);
    } catch (err) {
      console.error("โหลดใบงานผิดพลาด:", err);
    }
  };

  useEffect(() => {
    loadWorksheets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadWorksheets();
  };

  const getSubjectEmoji = (subject) => {
    switch (subject) {
      case "คณิตศาสตร์":
        return "🔢";
      case "ภาษาไทย":
        return "📖";
      case "ภาษาอังกฤษ":
        return "🅰️";
      default:
        return "📚";
    }
  };

  const getSubjectBadgeClass = (subject) => {
    switch (subject) {
      case "คณิตศาสตร์":
        return "bg-amber-100 text-amber-700";
      case "ภาษาไทย":
        return "bg-pink-100 text-pink-700";
      case "ภาษาอังกฤษ":
        return "bg-sky-100 text-sky-700";
      default:
        return "bg-violet-100 text-violet-700";
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-96px)] bg-gradient-to-b from-sky-50 via-pink-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 relative">
          {/* ของตกแต่งลอย ๆ */}
          <div className="pointer-events-none select-none">
            <span className="hidden md:block absolute -left-2 top-8 text-4xl opacity-40">
              🧸
            </span>
            <span className="hidden md:block absolute -right-4 top-20 text-4xl opacity-40">
              ✏️
            </span>
            <span className="hidden md:block absolute left-10 bottom-10 text-4xl opacity-30">
              📚
            </span>
          </div>

          {/* หัวข้อสีสดใสสำหรับเด็ก */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-400 via-amber-300 to-sky-400 text-white shadow-[0_18px_40px_rgba(248,113,113,0.35)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-sky-200/30 blur-xl" />

            <div className="relative flex flex-col md:flex-row items-center gap-4 px-6 py-5">
              <div className="flex-1">
                <p className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold mb-2 shadow-sm">
                  🎓 พื้นที่เรียนรู้สำหรับเด็ก • Printable Worksheets
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-1 drop-shadow-sm">
                  มุมใบงานของหนู ๆ 👧🧒
                </h1>
                <p className="text-xs sm:text-sm text-pink-50/95 max-w-xl">
                  เลือกแบบฝึกหัดสนุก ๆ ตาม{" "}
                  <span className="font-semibold">วิชา</span> และ{" "}
                  <span className="font-semibold">ระดับชั้น</span>{" "}
                  แล้วดาวน์โหลดไปพิมพ์หรือให้เด็กทำในแท็บเล็ตได้เลย
                </p>
              </div>

              <div className="w-full md:w-52">
                <div className="bg-white/90 rounded-3xl px-4 py-3 shadow-lg border border-pink-100 flex flex-col items-center text-center">
                  <div className="text-4xl mb-1">🧮</div>
                  <p className="text-xs font-semibold text-slate-700">
                    วันนี้ลองฝึกทำใบงานสัก 1–2 แผ่นกันไหมนะ?
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ช่วยสร้างนิสัยรักการเรียนรู้ทีละนิด 🌱
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* ฟิลเตอร์ */}
          <form
            onSubmit={handleFilter}
            className="bg-white/95 backdrop-blur rounded-3xl shadow-md p-4 border border-pink-100 flex flex-col gap-3 md:flex-row md:items-end md:gap-4"
          >
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">
                🔍 ค้นหาใบงาน
              </label>
              <input
                className="w-full border border-slate-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                placeholder="เช่น นับเลข, ฝึกอ่าน, คำศัพท์สัตว์..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                🎨 วิชา
              </label>
              <select
                className="border border-slate-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                🎒 ชั้น
              </label>
              <select
                className="border border-slate-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-pink-400 to-sky-400 text-white text-sm font-semibold px-4 py-2 shadow-sm hover:brightness-110"
            >
              ค้นหาเลย ✨
            </button>
          </form>

          {/* รายการใบงาน */}
          {worksheets.length === 0 ? (
            <div className="text-center text-sm text-slate-500 bg-white/90 rounded-3xl p-6 border border-dashed border-pink-200">
              ยังไม่มีใบงานให้ดาวน์โหลดเลย 🥺
              <div className="text-[11px] text-slate-400 mt-1">
                รอคุณครูอัปโหลดใบงานก่อนนะ
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {worksheets.map((w) => (
                <article
                  key={w.id}
                  className="group bg-white/95 rounded-3xl border border-pink-100 shadow-sm hover:shadow-[0_16px_35px_rgba(248,113,113,0.35)] hover:-translate-y-1 hover:-rotate-1 transition-all duration-200 flex flex-col overflow-hidden"
                >
                  <div className="h-2 w-full bg-gradient-to-r from-pink-300 via-amber-300 to-sky-300" />

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={
                            "text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 " +
                            getSubjectBadgeClass(w.subject)
                          }
                        >
                          <span>{getSubjectEmoji(w.subject)}</span>
                          <span>{w.subject}</span>
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-lime-100 text-lime-700">
                          🎒 {w.grade}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                          ⭐ {w.difficulty || "ง่าย"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {w.pages ? `${w.pages} หน้า` : "หลายหน้า"}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold line-clamp-2 mb-1 text-slate-800">
                      {w.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-2">
                      {w.description}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-auto">
                      โดย {w.uploaderName || "คุณครูใจดี"}
                    </p>
                  </div>

                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPreview(w)}
                      className="flex-1 rounded-full border border-pink-200 text-pink-600 text-xs font-semibold py-2 hover:bg-pink-50 transition-colors disabled:opacity-40"
                      disabled={!w.fileUrl}
                    >
                      👀 ดูพรีวิว
                    </button>
                    {w.fileUrl ? (
                      <a
                        href={w.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center rounded-full bg-gradient-to-r from-amber-300 to-sky-400 text-white text-xs font-semibold py-2 hover:brightness-110 transition-colors"
                      >
                        📥 ดาวน์โหลด
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex-1 rounded-full bg-slate-200 text-slate-500 text-xs font-semibold py-2 cursor-not-allowed"
                      >
                        ไม่มีไฟล์
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* modal พรีวิว */}
      {preview && (
        <PreviewModal worksheet={preview} onClose={() => setPreview(null)} />
      )}
    </>
  );
}

// ================== ฟอร์มอัปโหลด + File Manager (แดชบอร์ดครู) ==================
// ====== ฟอร์มอัปโหลด (สำหรับครู) + File Manager (สไตล์ใหม่) ======
function TeacherDashboard() {
  const { showAlert } = useAlert();
  const { user } = useAuth();
  const [myFiles, setMyFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("ภาษาไทย");
  const [grade, setGrade] = useState("อนุบาล 3-4 ปี");
  const [difficulty, setDifficulty] = useState("ง่าย");
  const [pages, setPages] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const SUBJECT_OPTIONS = ["ภาษาไทย", "คณิตศาสตร์", "ภาษาอังกฤษ"];
  const GRADE_OPTIONS = [
    "อนุบาล 3-4 ปี",
    "อนุบาล 4-5 ปี",
    "อนุบาล 5-6 ปี",
    "ประถมต้น",
    "ประถมปลาย",
  ];

  const DIFFICULTY_OPTIONS = ["ง่าย", "ปานกลาง", "ยาก"];

  const loadMyFiles = async () => {
    const data = await apiRequest("/api/worksheets/mine");
    setMyFiles(data);
  };

  useEffect(() => {
    if (user) loadMyFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      const msg = "กรุณาเลือกไฟล์ใบงานก่อนอัปโหลดนะครับ 🥺";
      setError(msg);
      showAlert(msg, "warning");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("grade", grade);
      formData.append("difficulty", difficulty);
      formData.append("pages", pages);
      formData.append("description", description);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/worksheets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "อัปโหลดไม่สำเร็จ");
      }

      await res.json();

      setTitle("");
      setPages("");
      setDescription("");
      setFile(null);
      e.target.reset();

      await loadMyFiles();

      showAlert("อัปโหลดใบงานเรียบร้อยแล้ว 🎉", "success");
    } catch (err) {
      setError(err.message);
      showAlert(err.message || "อัปโหลดไม่สำเร็จ", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gradient-to-b from-emerald-50 via-sky-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white p-5 shadow-[0_18px_40px_rgba(16,185,129,0.35)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold mb-2">
              🧑‍🏫 โหมดสำหรับคุณครู / ผู้ปกครอง
            </p>
            <h1 className="text-2xl font-bold mb-1">
              แดชบอร์ดจัดการใบงานของฉัน
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50/90 max-w-xl">
              อัปโหลดใบงาน เก็บเป็นคลังส่วนตัว
              และให้นักเรียนดาวน์โหลดจากหน้าแรกได้เลย
            </p>
          </div>
          <div className="bg-white/95 rounded-2xl px-4 py-3 text-xs text-slate-700 shadow-md border border-emerald-100 min-w-[210px]">
            <p className="font-semibold mb-1">สรุปวันนี้ 📌</p>
            <p>
              ใบงานทั้งหมดของคุณ:{" "}
              <span className="font-bold text-emerald-600">
                {myFiles.length} แผ่น
              </span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              แนะนำให้อัปโหลดทีละน้อย แต่สม่ำเสมอ เพื่อสร้างคลังสื่อของตัวเอง 🌱
            </p>
          </div>
        </header>

        {/* ฟอร์มอัปโหลด */}
        <section className="bg-white/95 rounded-3xl shadow-md border border-slate-100 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📤</span>
            <h2 className="text-lg font-semibold text-slate-800">
              อัปโหลดใบงานใหม่
            </h2>
          </div>
          {user.role !== "teacher" && user.role !== "admin" && (
            <p className="text-xs text-orange-500 mb-2 rounded-2xl bg-orange-50 border border-orange-100 px-3 py-2">
              * บัญชีของคุณไม่ใช่ครูหรือผู้ดูแล จึงไม่สามารถอัปโหลดใบงานได้
              แต่ยังดูใบงานหน้าแรกได้ตามปกติค่ะ 🙂
            </p>
          )}

          <form onSubmit={handleUpload} className="grid gap-3 md:grid-cols-2">
            {error && (
              <div className="md:col-span-2 text-xs text-red-500 bg-red-50 border border-red-100 rounded-2xl px-3 py-2 flex gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">
                ชื่อใบงาน
              </label>
              <input
                className="w-full border rounded-2xl px-3 py-2 text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น แบบฝึกหัดบวกเลข 1–10"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">วิชา</label>
              <select
                className="w-full border rounded-2xl px-3 py-2 text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 bg-white"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                ระดับชั้น
              </label>
              <select
                className="w-full border rounded-2xl px-3 py-2 text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 bg-white"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                ความยาก
              </label>
              <select
                className="w-full border rounded-2xl px-3 py-2 text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 bg-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                จำนวนหน้า (ถ้ามี)
              </label>
              <input
                type="number"
                min="1"
                className="w-full border rounded-2xl px-3 py-2 text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">
                คำอธิบายใบงาน
              </label>
              <textarea
                rows={2}
                className="w-full border rounded-2xl px-3 py-2 text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="เช่น เน้นฝึกการนับเลข / ใช้เวลาประมาณ 15 นาที ฯลฯ"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">
                ไฟล์ใบงาน (PDF / รูปภาพ)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="w-full text-xs file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-600"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={
                  uploading ||
                  (user.role !== "teacher" && user.role !== "admin")
                }
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-sm font-semibold px-5 py-2.5 hover:brightness-110 disabled:bg-slate-300"
              >
                {uploading ? "กำลังอัปโหลด..." : "อัปโหลดใบงาน"}
              </button>
            </div>
          </form>
        </section>

        {/* File Manager */}
        <section className="bg-white/95 rounded-3xl shadow-md border border-slate-100 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h2 className="text-lg font-semibold text-slate-800">
              ใบงานที่ฉันอัปโหลด
            </h2>
          </div>
          {myFiles.length === 0 ? (
            <p className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-2xl px-3 py-4 text-center">
              ยังไม่มีใบงานที่คุณอัปโหลดเลยค่ะ
              <br />
              <span className="text-[11px] text-slate-400">
                เริ่มจากอัปโหลดใบงานแรกด้านบนก่อนนะ 🌱
              </span>
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {myFiles.map((w) => (
                <div
                  key={w.id}
                  className="border border-slate-100 rounded-2xl p-3 text-xs bg-slate-50/80 flex flex-col gap-1 hover:bg-white hover:shadow-sm transition"
                >
                  <div className="font-semibold text-slate-800 line-clamp-2">
                    {w.title}
                  </div>
                  <div className="text-slate-500">
                    {w.subject} • {w.grade}
                  </div>
                  <div className="text-slate-400">
                    หน้า: {w.pages || "-"} • ความยาก: {w.difficulty}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    {w.fileUrl && (
                      <a
                        href={w.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        เปิดไฟล์
                      </a>
                    )}
                    <span className="text-[10px] text-slate-400">
                      ID: {w.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ================== Admin Panel (สไตล์ใหม่ + modal แก้ไข) ==================
function AdminPanel() {
  const { showAlert } = useAlert();
  const [users, setUsers] = useState([]);
  const [worksheets, setWorksheets] = useState([]);
  const { user } = useAuth();
  const [editingWorksheet, setEditingWorksheet] = useState(null);

  const loadData = async () => {
    const [u, w] = await Promise.all([
      apiRequest("/api/admin/users"),
      apiRequest("/api/admin/worksheets"),
    ]);
    setUsers(u);
    setWorksheets(w);
  };

  const deleteWorksheet = async (id) => {
    if (!window.confirm("ต้องการลบใบงานนี้จริงหรือไม่?")) return;
    try {
      await apiRequest(`/api/worksheets/${id}`, { method: "DELETE" });
      await loadData();
      showAlert("ลบใบงานจากระบบเรียบร้อยแล้ว 🧹", "success");
    } catch (err) {
      showAlert(err.message || "ลบใบงานไม่สำเร็จ", "error");
    }
  };

  // ✅ ฟังก์ชันบันทึกจาก modal
  const handleSaveEdit = async (id, payload) => {
    try {
      await apiRequest(`/api/worksheets/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
       await loadData();
      setEditingWorksheet(null);
      showAlert("อัปเดตใบงานเรียบร้อยแล้ว ✏️", "success");
    } catch (err) {
      showAlert(err.message || "อัปเดตใบงานไม่สำเร็จ", "error");
    }
  };

  useEffect(() => {
    if (user) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-96px)] bg-slate-950/95">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.7)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-semibold mb-2 text-sky-200">
              🛠️ โหมดผู้ดูแลระบบ
            </p>
            <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              จัดการผู้ใช้และใบงานทั้งหมดในระบบ เพื่อให้พื้นที่หน้าเด็ก ๆ
              สะอาดและปลอดภัย
            </p>
          </div>
          <div className="bg-slate-900/80 rounded-2xl px-4 py-3 text-xs text-slate-200 border border-slate-700 min-w-[210px]">
            <p className="font-semibold mb-1">สรุประบบตอนนี้</p>
            <p>ผู้ใช้งานทั้งหมด: {users.length} คน</p>
            <p>ใบงานในระบบ: {worksheets.length} แผ่น</p>
          </div>
        </header>

        {/* Users */}
        <section className="bg-slate-900/90 rounded-3xl shadow-md border border-slate-700 p-4 sm:p-5 space-y-3 text-slate-50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            👥 ผู้ใช้ทั้งหมด
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-700">
            <table className="w-full text-xs">
              <thead className="bg-slate-900/95">
                <tr className="border-b border-slate-700 text-slate-300">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">ชื่อ</th>
                  <th className="text-left p-2">อีเมล</th>
                  <th className="text-left p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-800 last:border-0 odd:bg-slate-900/60 even:bg-slate-900/30"
                  >
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] bg-slate-800 border border-slate-600">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Worksheets */}
        <section className="bg-slate-900/90 rounded-3xl shadow-md border border-slate-700 p-4 sm:p-5 space-y-3 text-slate-50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            📄 ใบงานทั้งหมด
          </h2>
          {worksheets.length === 0 ? (
            <p className="text-sm text-slate-400">ยังไม่มีใบงานในระบบเลย</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-700">
              <table className="w-full text-xs">
                <thead className="bg-slate-900/95">
                  <tr className="border-b border-slate-700 text-slate-300">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">ชื่อใบงาน</th>
                    <th className="text-left p-2">วิชา</th>
                    <th className="text-left p-2">ชั้น</th>
                    <th className="text-left p-2">โดย</th>
                    <th className="text-left p-2">ไฟล์</th>
                    <th className="text-left p-2">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {worksheets.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-slate-800 last:border-0 odd:bg-slate-900/60 even:bg-slate-900/30"
                    >
                      <td className="p-2">{w.id}</td>
                      <td className="p-2 max-w-[220px] truncate">{w.title}</td>
                      <td className="p-2">{w.subject}</td>
                      <td className="p-2">{w.grade}</td>
                      <td className="p-2">{w.uploaderName}</td>
                      <td className="p-2">
                        {w.fileUrl ? (
                          <a
                            href={w.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-300 underline"
                          >
                            เปิด
                          </a>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingWorksheet(w)}  // ✅ เปิด modal
                            className="px-2 py-1 rounded bg-amber-500 text-white text-[11px] hover:bg-amber-600"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => deleteWorksheet(w.id)}
                            className="px-2 py-1 rounded bg-red-500 text-white text-[11px] hover:bg-red-600"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ✅ เรียกใช้ EditWorksheetModal ตรงนี้ */}
      {editingWorksheet && (
        <EditWorksheetModal
          worksheet={editingWorksheet}
          onClose={() => setEditingWorksheet(null)}
          onSave={(payload) =>
            handleSaveEdit(editingWorksheet.id, payload)
          }
        />
      )}
    </div>
  );
}




// ================== App Routes หลัก ==================

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* กล่องแสดง alert น่ารักๆ */}
      <AlertContainer />

      <Navbar />

      <Routes>
        {/* 🔹 หน้าแรก: ให้เป็นหน้าล็อกอิน */}
        <Route path="/" element={<LoginPage />} />

        {/* หน้า Login (จะซ้ำกับ / ก็ได้ เผื่อเรียกตรง ๆ */}
        <Route path="/login" element={<LoginPage />} />

        {/* ใบงานนักเรียน: ย้ายมาอยู่ /worksheets */}
        <Route path="/worksheets" element={<StudentWorksheetGrid />} />
        {/* แดชบอร์ดครู/ผู้ปกครอง */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        {/* เส้นทางอื่น ๆ ส่งกลับหน้าล็อกอิน */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <footer className="mt-auto border-t border-slate-200 py-3 text-center text-[11px] text-slate-400">
        ระบบสื่อใบงานสำหรับเด็ก • Media & Training Co., Ltd. | Trang
      </footer>
    </div>
  );
}
