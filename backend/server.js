// backend/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;
const JWT_SECRET = "super-secret-key"; // ให้เปลี่ยนในโปรเจกต์จริง

// ====== CONFIG BASIC ======
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// สร้างโฟลเดอร์ data สำหรับเก็บไฟล์ฐานข้อมูลแบบง่าย ๆ
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const worksheetsFile = path.join(dataDir, "worksheets.json");

// เสิร์ฟไฟล์แบบ static
app.use("/uploads", express.static(uploadDir));

// ====== ข้อมูลผู้ใช้จำลอง (ยังเก็บในหน่วยความจำอยู่ได้) ======
const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "ครู A",
    email: "teacher@example.com",
    password: "teacher123",
    role: "teacher",
  },
  {
    id: 3,
    name: "ผู้ปกครอง B",
    email: "parent@example.com",
    password: "parent123",
    role: "parent",
  },
  {
    id: 4,
    name: "ผู้ใช้งานคนที่1",
    email: "akkares.gr@gmail.com",
    password: "2546",
    role: "parent",
  },
];

// ====== ใบงาน + ฟังก์ชันโหลด/บันทึกลงไฟล์ ======
let worksheets = [
  {
    id: 1,
    title: "แบบฝึกหัดนับเลข 1–10",
    subject: "คณิตศาสตร์",
    grade: "อนุบาล 3-4 ปี",  // 
    description: "ฝึกนับเลขง่าย ๆ พร้อมรูปภาพ",
    difficulty: "ง่าย",
    pages: 2,
    fileUrl: "",
    originalName: "",
    uploadedBy: 2,
    uploaderName: "ครู A",
    createdAt: new Date(),
  },
];
function loadWorksheets() {
  try {
    if (!fs.existsSync(worksheetsFile)) {
      // ยังไม่มีไฟล์ => ใช้ตัวอย่างเริ่มต้น แล้วเซฟไฟล์ให้เลย
      saveWorksheets();
      console.log("สร้างไฟล์ worksheets.json ใหม่ พร้อมตัวอย่าง 1 รายการ");
      return;
    }
    const raw = fs.readFileSync(worksheetsFile, "utf8") || "[]";
    const parsed = JSON.parse(raw);

    // แปลง createdAt กลับเป็น Date (ถ้าต้องใช้เป็น Date จริง ๆ)
    worksheets = parsed.map((w) => ({
      ...w,
      createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
    }));

    console.log("โหลดใบงานจากไฟล์:", worksheets.length, "รายการ");
  } catch (err) {
    console.error("โหลดไฟล์ worksheets.json ไม่ได้:", err);
    worksheets = [];
  }
}

function saveWorksheets() {
  try {
    // เวลาเซฟ เราเซฟเป็น string ธรรมดา (createdAt จะเป็น ISO string)
    const plain = worksheets.map((w) => ({
      ...w,
      createdAt: w.createdAt ? new Date(w.createdAt).toISOString() : null,
    }));
    fs.writeFileSync(worksheetsFile, JSON.stringify(plain, null, 2), "utf8");
    // console.log("บันทึกใบงานลงไฟล์แล้ว:", plain.length, "รายการ");
  } catch (err) {
    console.error("บันทึกไฟล์ worksheets.json ไม่ได้:", err);
  }
}

// โหลดข้อมูลจากไฟล์ตอนเริ่มรันเซิร์ฟเวอร์
loadWorksheets();

// ====== Helper ฟังก์ชัน ======
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// middleware เช็ค token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "ไม่ได้ล็อกอิน" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ message: "ผู้ใช้ไม่พบ" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "โทเค็นไม่ถูกต้อง" });
  }
}

// middleware เช็ค role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "ไม่มีสิทธิ์เข้าถึง (ต้องเป็น " + roles.join(", ") + ")" });
    }
    next();
  };
}

// ====== Multer สำหรับอัปโหลดไฟล์ ======
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage });

// ====== ROUTES ======

// ทดสอบ
app.get("/", (req, res) => {
  res.send("Worksheet backend running");
});

// ----- Auth -----
// login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  }
  const token = generateToken(user);
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
});

// ข้อมูล user ปัจจุบัน
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const { password, ...safeUser } = req.user;
  res.json(safeUser);
});

// ----- Worksheets -----
// ดึงใบงานทั้งหมด (นักเรียน / ใครก็ได้เรียกดู)
app.get("/api/worksheets", (req, res) => {
  const { subject, grade, search } = req.query;

  let result = [...worksheets];

  if (subject && subject !== "ทั้งหมด") {
    result = result.filter((w) => w.subject === subject);
  }
  if (grade && grade !== "ทั้งหมด") {
    result = result.filter((w) => w.grade === grade);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        (w.description || "").toLowerCase().includes(q)
    );
  }

  res.json(result.sort((a, b) => b.id - a.id));
});

// ดึงใบงานที่อัปโหลดโดยผู้ใช้คนนี้
app.get("/api/worksheets/mine", authMiddleware, (req, res) => {
  const myWorksheets = worksheets.filter((w) => w.uploadedBy === req.user.id);
  res.json(myWorksheets.sort((a, b) => b.id - a.id));
});

// อัปโหลดใบงาน (ครู หรือ admin เท่านั้น)
app.post(
  "/api/worksheets",
  authMiddleware,
  requireRole("teacher", "admin"),
  upload.single("file"), // ชื่อ field = "file"
  (req, res) => {
    try {
      const { title, subject, grade, description, difficulty, pages } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "กรุณาแนบไฟล์ใบงาน" });
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      const newWorksheet = {
        id: Date.now(),
        title: title || req.file.originalname,
        subject,
        grade,
        description: description || "",
        difficulty: difficulty || "ง่าย",
        pages: pages ? Number(pages) : undefined,
        fileUrl,
        originalName: req.file.originalname,
        uploadedBy: req.user.id,
        uploaderName: req.user.name,
        createdAt: new Date(),
      };

      worksheets.push(newWorksheet);
      saveWorksheets(); // ⬅ สำคัญ: บันทึกลงไฟล์ทุกครั้งที่เพิ่ม

      res.status(201).json(newWorksheet);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปโหลด" });
    }
  }
);

// ลบใบงาน (admin เท่านั้น)
app.delete(
  "/api/worksheets/:id",
  authMiddleware,
  requireRole("admin"),
  (req, res) => {
    const id = Number(req.params.id);
    const index = worksheets.findIndex((w) => w.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "ไม่พบใบงาน" });
    }

    // ลบไฟล์จริงด้วย
    const filePath = worksheets[index].fileUrl
      ? worksheets[index].fileUrl.split("/uploads/")[1]
      : null;
    if (filePath) {
      const fullPath = path.join(uploadDir, filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    worksheets.splice(index, 1);
    saveWorksheets(); // ⬅ บันทึกลงไฟล์หลังลบ

    res.json({ message: "ลบใบงานเรียบร้อย" });
  }
);
// แก้ไขใบงาน (admin เท่านั้น)
app.put(
  "/api/worksheets/:id",
  authMiddleware,
  requireRole("admin"),
  (req, res) => {
    const id = Number(req.params.id);

    console.log("รับคำขอแก้ไขใบงาน id =", id);
    console.log("ids ที่มีอยู่ตอนนี้ =", worksheets.map((w) => w.id));

    const worksheet = worksheets.find((w) => w.id === id);

    if (!worksheet) {
      return res.status(404).json({ message: "ไม่พบใบงาน" });
    }

    const { title, subject, grade, description, difficulty, pages } = req.body;

    if (title !== undefined) worksheet.title = title;
    if (subject !== undefined) worksheet.subject = subject;
    if (grade !== undefined) worksheet.grade = grade;
    if (description !== undefined) worksheet.description = description;
    if (difficulty !== undefined) worksheet.difficulty = difficulty;

    if (pages !== undefined) {
      if (pages === "" || pages === null) {
        worksheet.pages = undefined;
      } else {
        const num = Number(pages);
        worksheet.pages = Number.isNaN(num) ? worksheet.pages : num;
      }
    }

    // ⬅ สำคัญ: บันทึกลงไฟล์ทุกครั้งที่มีการแก้ไข
    saveWorksheets();

    return res.json({
      message: "อัปเดตใบงานเรียบร้อยแล้ว",
      worksheet,
    });
  }
);




// ----- Admin Routes -----
app.get(
  "/api/admin/users",
  authMiddleware,
  requireRole("admin"),
  (req, res) => {
    const safe = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
    res.json(safe);
  }
);

app.get(
  "/api/admin/worksheets",
  authMiddleware,
  requireRole("admin"),
  (req, res) => {
    res.json(worksheets.sort((a, b) => b.id - a.id));
  }
);

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
