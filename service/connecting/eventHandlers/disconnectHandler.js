import { main } from "../../io";
import EVENT from "../../event";

const disconnectHandler = (socket) => {
    const roomName = socket.roomName;
    socket.leave(roomName);
    main.in(roomName).emit(EVENT.DISCONNECTPEER, { id: socket.id, roomName });
    main.in(roomName).emit(EVENT.NOTICE, `[${socket.userName}] 님이 퇴장하셨습니다.`);
    if (main.adapter.rooms.hasOwnProperty(roomName)) {
        let joinusers = main.adapter.rooms[roomName].sockets;
        main.in(roomName).emit('joinusers', joinusers);
    }
}

module.exports = { disconnectHandler };