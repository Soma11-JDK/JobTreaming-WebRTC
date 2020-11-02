import http from "http";
import app from "./app";
import "./mongodb";
import "./models/Comment";
import "./models/Question";
import "./models/QuestionComment";

const PORT = 80;
const handleListening = () => { console.log(`socket IO server listening on port ${PORT}`); }

const server = http.createServer(app);
//httpServer의 engineIO instance 에 socket.io를 바인딩.
app.service.attach(server);
server.listen(PORT, handleListening);