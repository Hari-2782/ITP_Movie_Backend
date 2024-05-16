// paymentfilecontroller.js
const path = require('path');
const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/payment'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true); // Accept all files
    }
}).single('file');

const FileUpload = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Error uploading file' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filename = req.file.originalname;
        res.status(200).json({ msg: 'File Uploaded!', fileName: filename });
    });
};

module.exports = { FileUpload };
