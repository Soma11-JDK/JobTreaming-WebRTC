import EVENT from "../event";

import {
    joinRoomHandler,
    disconnectHandler,
    startCaptureHandler,
    stopCaptureHandler
} from "./eventHandlers";

module.exports = socket => {
    socket.on(EVENT.JOINROOM, joinRoomHandler.bind(null, socket));
    socket.on(EVENT.DISCONNECT, disconnectHandler.bind(null, socket));
    socket.on('startCapture', startCaptureHandler.bind(null, socket));
    socket.on('stopCapture', stopCaptureHandler.bind(null, socket));
};