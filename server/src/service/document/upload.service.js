import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { uploadConfig } from '../../config/upload.config.js';

class UploadServices {
    createStorage(folder = "general") {
        const uploadPath = path.join(uploadConfig.root, folder);
        fs.mkdirSync(uploadPath, { recursive: true });

        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {

                const ext = path.extname(file.originalname).toLowerCase();

                const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

                cb(null, uniqueName);
            }
        });
    };

    createUploader(options = {}) {
        const {
            folder = "general",
            maxFileSize = uploadConfig.maxFileSize,
            maxFiles = uploadConfig.maxFiles,
            allowedMimeTypes = uploadConfig.allowedMimeTypes
        } = options;

        return multer({
            storage: this.createStorage(folder),
            limits: {
                fileSize: maxFileSize,
                files: maxFiles
            },
            fileFilter: (req, file, cb) => {

                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new Error(`File type ${file.mimetype} is not allowed.`),
                        false
                    );
                }

                cb(null, true);
            }
        })
    }

    // Upload single file
    single(options = {}) {

        const {
            fieldName = "file",
            ...uploadOptions
        } = options;

        return this.createUploader(uploadOptions).single(fieldName);
    }

    // Upload multiple files
    multiple(options = {}) {

        const {
            fieldName = "files",
            ...uploadOptions
        } = options;

        return this.createUploader(uploadOptions).array(
            fieldName,
            uploadOptions.maxFiles || uploadConfig.maxFiles
        );
    }

    // Upload multiple fields with different field names
    fields(fields, options = {}) {

        return this.createUploader(options).fields(fields);
    }

    deleteFile(filePath) {

        if (!filePath) return false;

        const absolutePath = path.resolve(uploadConfig.root, filePath);

        // Prevent deleting files outside uploads directory
        if (
            !absolutePath.startsWith(uploadConfig.root + path.sep)
        ) {
            throw new Error("Invalid file path.");
        }

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            return true;
        }

        return false;
    }

    // Delete multiple files
    static deleteFiles(filePaths = []) {

        return filePaths.map(filePath => this.deleteFiles(filePath));
    }
}

export const uploadService = new UploadServices();