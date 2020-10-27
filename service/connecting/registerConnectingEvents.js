import EVENT from "../event";

import {
    joinRoomHandler,
    disconnectHandler
} from "./eventHandlers";

module.exports = socket => {
    socket.on(EVENT.JOINROOM, joinRoomHandler.bind(null, socket));
    socket.on(EVENT.DISCONNECT, disconnectHandler.bind(null, socket));
};