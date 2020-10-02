import http from "http";
import app from "./app";

const PORT = 443;
const handleListening = () => { console.log(`socket IO server listening on port ${PORT}`); }

const server = http.createServer(app);
app.service.attach(server);
server.listen(PORT, handleListening);