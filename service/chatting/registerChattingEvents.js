import EVENT from "../event";
import { chatHandler } from "./eventHandlers";

module.exports = socket => {
    //첫번째 인수만 고정
    socket.on(EVENT.CHAT, chatHandler.bind(null, socket));
};