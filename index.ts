import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";

import { systemConfig } from "./config/config";
import path from "path";
import bodyParser  from   "body-parser";
 
dotenv.config();

database.connect();


const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.set("views", "./views");
app.set("view engine", "pug");

// Client routes
clientRoutes(app);

// Admin routes
adminRoutes(app);

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce")),
);
// End TinyMCE


// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});