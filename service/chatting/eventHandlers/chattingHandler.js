import { main } from "../../io";
import EVENT from "../../event";
import Comment from "../../../models/Comment";

const chatHandler = async (socket, data) => {

    try {
        const newComment = await Comment.create({
            room: data.roomName,
            writer: data.userName,
            context: data.text
        });
        main.in(data.roomName).emit(EVENT.CHAT, { userName: data.userName, text: data.text, time: newComment.time });
        console.log('chat', data, newComment.time);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { chatHandler };
