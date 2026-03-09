import { Router } from "express";
import * as controller from "../../controllers/client/favorite-song.controller";
const router: Router = Router();

router.get("/", controller.favoriteSongs);

export default router;