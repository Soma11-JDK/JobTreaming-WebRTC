import { main } from "../../io";
import EVENT from "../../event";

const disconnectHandler = (socket) => {
    main.emit(EVENT.DISCONNECTPEER, socket.id);
}

module.exports = { disconnectHandler };