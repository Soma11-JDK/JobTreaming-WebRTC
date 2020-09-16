import routes from '../routes';
import { roomInfo } from '../db';

export const getHome = (req, res) => res.render("home");

export const getJoin = (req, res) => res.render("join");

export const postJoin = (req, res) => {
    console.log(req.body.id, req.body.room);
    let id = req.body.id;
    let room = req.body.room;
    res.render("join");
}

export const getExit = (req, res) => {
    //room 에서 퇴장
    //home으로 redirect
    res.redirect(routes.home);
};

export const getStreamer = (req, res) => {
    //check your info
    res.render("streamer");
};

export const getViewers = (req, res) => {
    res.render("viewers");
};


function findRoom(list, room) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].roomName == room) {
            return i;
        }
    }
}