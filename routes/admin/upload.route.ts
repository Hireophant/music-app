import { Router } from "express";
import multer from "multer";
const upload = multer();
const router: Router = Router();

import * as controller from "../../controllers/admin/upload.controller";
import * as uploadCloud from "../../middleware/uploadCloud.middleware"


router.post("/",upload.single("file"), uploadCloud.uploadSingle, controller.index);
export default router;

    