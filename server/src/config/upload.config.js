import path from 'path'
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export const uploadConfig = {
    root: UPLOAD_ROOT,
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 10,
    allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ],
}
