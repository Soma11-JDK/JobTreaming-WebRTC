import EVENT from "../event";
import { chatHandler, questionHandler, likeUpHandler, likeDownHandler, questionCommentHandler, questionAllHandler } from "./eventHandlers";

module.exports = socket => {
    //첫번째 인수만 고정
    socket.on(EVENT.CHAT, chatHandler.bind(null, socket));
    socket.on('question', questionHandler.bind(null, socket));
    socket.on('likeUp', likeUpHandler.bind(null, socket));
    socket.on('likeDown', likeDownHandler.bind(null, socket));
    socket.on('questionComment', questionCommentHandler.bind(null, socket));
    socket.on('questionAll', questionAllHandler.bind(null, socket));
};