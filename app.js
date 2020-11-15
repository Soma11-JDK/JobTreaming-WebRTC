import express from "express";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import streamingRouter from "./streamingRouter";
import service from "./service";
import cors from "cors";

const app = express();

app.use(helmet());
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({credentials: true, withCredentials: true}));

app.get('/socket.io.js', (req, res, next) => {
    return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});
app.get('/socket.io-file-client.js', (req, res, next) => {
    return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});
app.get('/socket.io.js.map', (req, res) => {
    return res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js.map');
});

app.use('/', streamingRouter);

//app.service == socket.io
app.service = service;

export default app; 
