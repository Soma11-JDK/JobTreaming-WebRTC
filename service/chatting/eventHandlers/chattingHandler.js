import { main } from "../../io";
import EVENT from "../../event";
import Comment from "../../../models/Comment";

const chatHandler = async (socket, data) => {

    try {
        const newComment = await Comment.create({
            room: data.roomName,
            writer: data.userName,
            time: data.time,
            context: data.text
        });
    } catch (error) {
        console.log(error);
    }
    main.in(data.roomName).emit(EVENT.CHAT, data);
    console.log('chat', data);
}

module.exports = { chatHandler };
