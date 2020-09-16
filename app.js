import express from "express";
import http from "http";
import socketIo from "socket.io";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import routes from "./routes";
import morgan from "morgan";
import helmet from "helmet";
import { localsMiddleware } from "./middlewares";
import globalRouter from "./router/globalRouter";

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
app.use(helmet());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(localsMiddleware);
app.use(routes.home, globalRouter);

export default server; 