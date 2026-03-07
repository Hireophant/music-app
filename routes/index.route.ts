import { Express } from "express";
import topicRoutes from "./client/topic.route";
import songRoutes from "./client/song.route";

const clientRoutes = (app: Express) => {
    app.use("/topics", topicRoutes);
    app.use("/songs", songRoutes);
};


export default clientRoutes;
