import { main } from "../../io";
import EVENT from "../../event";

const chatHandler = (socket, data) => {
    main.in(data.roomName).emit(EVENT.CHAT, data);
    console.log('chat', data);
}

module.exports = { chatHandler };
