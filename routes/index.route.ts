import { Express } from "express";
import topicRoutes from "./client/topic.route";

const clientRoutes = (app: Express) => {
  app.use("/topics", topicRoutes);
};


export default clientRoutes;
