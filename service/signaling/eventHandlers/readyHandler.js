import { main } from "../../io";
import EVENT from "../../event";

const readyStreamerHandler = (socket, roomName) => {
    main.adapter.rooms[roomName].streamer = socket.id;
    main.to(roomName).emit(EVENT.STREAMER_READY);
}

const readyViewerHandler = (socket, roomName) => {
    var streamerId = main.adapter.rooms[roomName].streamer;
    main.to(streamerId).emit(EVENT.VIEWER_READY, socket.id);
}

module.exports = { readyStreamerHandler, readyViewerHandler };
