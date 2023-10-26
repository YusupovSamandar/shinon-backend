// multerConfig.js

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        switch (req.baseUrl) {
            case "/api/users":
                cb(null, 'uploads/users');
                break;
            case "/api/patients":
                if (file.fieldname === 'patientPicture') {
                    cb(null, 'uploads/patients');
                } else {
                    cb(null, 'uploads/passports');
                }
                break;
            default:
                cb(null, 'uploads/');
                break;
        }
    },
    filename: (req, file, cb) => {
        switch (req.baseUrl) {
            case "/api/users": {
                const fileExtension = path.extname(file.originalname);
                const userLogin = req.body.login;
                const uniqueFilename = `${userLogin}${fileExtension}`;
                cb(null, uniqueFilename);
                break;
            }
            case "/api/patients": {
                const fileExtension = path.extname(file.originalname);
                const patientName = req.body.fullName;
                const uniqueFilename = `${patientName}${fileExtension}`;
                cb(null, uniqueFilename);
                break;
            }
            default:
                cb(null, file.originalname);
                break;
        }

    },
});

const upload = multer({ storage: storage });

const remoteStorage = multer.memoryStorage();
const remoteUpload = multer({ storage: remoteStorage })

module.exports = {
    upload,
    remoteUpload
};
