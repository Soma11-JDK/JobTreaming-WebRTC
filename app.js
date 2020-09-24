import express from "express";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import streamingRouter from "./streamingRouter";
import service from "./service";

const app = express();

app.use(helmet());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use('/streaming', streamingRouter);
app.use((req, res) => { res.redirect('/streaming'); });

app.service = service;

export default app; 