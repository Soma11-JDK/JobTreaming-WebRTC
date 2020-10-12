import express from "express"; //for Routing
import { roomInfo } from './db';

const streamingRouter = express.Router();

const getStreaming = (req, res) => res.render("join");
const postStreaming = (req, res) => {
    console.log(req.body.id, req.body.room);
    let id = req.body.id;
    let room = req.body.room;

    //check id, room
    if (isStreamer(id, room)) {
        res.render("streamer", { userName: id, roomName: room });
    } else if (isViewer(id, room)) {
        res.render("viewer", { userName: id, roomName: room });
    } else {
        console.log("incorrect");
        res.render("join");
        //not member
        // res.json({ alertmsg: "incorrect id" });
    }

}

streamingRouter.get("/", getStreaming);
streamingRouter.post("/", postStreaming);

export default streamingRouter;

function isStreamer(id, room) {
    for (let i = 0; i < roomInfo.length; i++) {
        if (room == roomInfo[i].roomName) {
            if (id == roomInfo[i].streamerId) {
                return true;
            }
            return false;
        }
    }
    return false;
}

function isViewer(id, room) {
    for (let i = 0; i < roomInfo.length; i++) {
        if (room == roomInfo[i].roomName) {
            for (let j = 0; j < roomInfo[i].membersId.length; j++) {
                if (id == roomInfo[i].membersId[j]) {
                    return true;
                }
            }
            return false;
        }
    }
    return false;
}