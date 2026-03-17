import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024 }, //5 MB
    fileFilter: ( req, file, cb ) => {
        if(
            file.mimetype === "application/pdf" || 
            file.mimetype === 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ){
            cb(null, true);
        } else {
            cb(new Error("Only PDF or DOCX allowed"), false);
        }
    },
});