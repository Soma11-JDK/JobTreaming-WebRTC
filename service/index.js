// const registerSignalingEvents = require('./signaling/registerSignalingEvents');
import { io } from "./io";

// io.on("connection", socket => {
//     registerSignalingEvents(socket);
// });

let broadcaster;
//클라이언트가 서버로 에러메세지를 보내면 콘솔로 출력하기
io.sockets.on("error", e => console.log(e));

//클라이언트의 connection이 올 때
io.sockets.on("connection", socket => {
    //브로드캐스터의 socketid를 저장. 브로드캐스터에게 브로드캐스터라고 알림
    socket.on("broadcaster", () => {
        broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
    });
    //브로드캐스터에게 watcher의 socketid를 전송
    socket.on("watcher", () => {
        socket.to(broadcaster).emit("watcher", socket.id);
    });
    //socketid가 id에게 offer보냄
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });
    //socketid가 id에게 answer보냄
    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });
    //socketid가 id에게 candiate보냄
    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
    //브로드캐스터에게 socketid가 disconnect됬음을 알림
    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });
});

export default io;