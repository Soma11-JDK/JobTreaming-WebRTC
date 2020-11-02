import EVENT from "../event";
import { chatHandler, questionHandler } from "./eventHandlers";

module.exports = socket => {
    //첫번째 인수만 고정
    socket.on(EVENT.CHAT, chatHandler.bind(null, socket));
    socket.on('question', questionHandler.bind(null, socket));
};