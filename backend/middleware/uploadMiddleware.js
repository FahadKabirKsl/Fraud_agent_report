import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../frontend/public/uploads/"));
  },
  filename: function (req, file, cb) {
    /*Appending extension with original name*/
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
export default upload