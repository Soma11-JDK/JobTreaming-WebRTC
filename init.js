import server from "./app";

const PORT = 8080;
const handleListening = () => { console.log(`socket IO server listening on port ${PORT}`); }

server.listen(PORT, handleListening);