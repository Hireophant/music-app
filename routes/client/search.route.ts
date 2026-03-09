import { Router } from "express";
import * as controller from "../../controllers/client/search.controller";
const router: Router = Router();

// [Get] /search
router.get("/:type", controller.result);



export default router;