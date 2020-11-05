import { main } from "../../io";
import EVENT from "../../event";

const joinRoomHandler = (socket, data) => {
    const userName = data.userName;
    const roomName = data.roomName;
    socket.userName = userName;
    socket.roomName = roomName;
    socket.join(roomName, () => {
        socket.emit('join-success');
        main.in(roomName).emit(EVENT.NOTICE, `[${userName}] 님이 입장하셨습니다.`);
    })
    main.adapter.rooms[roomName].sockets[socket.id] = { userName }
    let joinusers = main.adapter.rooms[roomName].sockets;
    main.in(roomName).emit('joinusers', joinusers);
}



module.exports = { joinRoomHandler };