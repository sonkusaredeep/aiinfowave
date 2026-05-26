const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── File filter (shared) ──────────────────────────────────
// Strictly allow PDF, DOC, DOCX only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'), false);
  }
};

// ── Helper: resolve format from mimetype ─────────────────
const resolveFormat = (mimetype) => {
  if (mimetype === 'application/msword') return 'doc';
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  return 'pdf';
};

// ── Internship resume storage (folder: internship_resumes) ──
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'internship_resumes',
    format: resolveFormat(file.mimetype),
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`
  }),
});

// ── Job application resume storage (folder: job_resumes) ──
const jobStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'job_resumes',
    format: resolveFormat(file.mimetype),
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`
  }),
});

// ── Multer instances (2 MB limit) ──────────────────────────
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

const uploadJobResume = multer({
  storage: jobStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = { cloudinary, upload, uploadJobResume };
