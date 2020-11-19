import express from "express"; //for Routing
import request from "request";
import cryptoJS from 'crypto-js';
import { roomInfo } from './db';

const streamingRouter = express.Router();

const getStreaming = (req, res) => {
    //lectureId, password, jwt 받음.
    if (req.query.lectureId && req.query.jwt) {
        const lectureId = req.query.lectureId;
        const jwt = req.query.jwt;

        const password = makePassword(lectureId);
        var headers = { 'Authorization': jwt };
        var options = {
            url: 'http://117.16.136.156:8085/lecture/join',
            method: 'GET',
            headers: headers,
            qs: { 'password': password, 'lectureId': lectureId }
        };
        request(options, function (error, response, body) {
            if (error) console.log(error);
            else if (!error && response.statusCode == 200) {
                console.log('200');
                body = JSON.parse(body);
                const { name, expert, expertId } = body;
                request(`http://117.16.136.156:8085/lecture/${lectureId}`, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        body = JSON.parse(body);
                        let { title, category, startedAt, endedAt, expertName } = body;
                        startedAt = startedAt.substring(11, 16);
                        endedAt = endedAt.substring(11, 16);
                        if (expert) {
                            res.render("streamer", { userName: name, roomName: lectureId, expertId, jwt, streamer: true, title, category, startedAt, endedAt, expertName });
                        } else {
                            res.render("viewer", { userName: name, roomName: lectureId, expertId, jwt, streamer: false, title, category, startedAt, endedAt, expertName });
                        }
                    }
                });
            }
            else {
                //강연참여자가 아님
                console.log('500');
                res.status(500);
            }
        });
    }
}

streamingRouter.get("/", getStreaming);


const getJoin = (req, res) => res.render("join");
const postJoin = (req, res) => {
    // console.log(req.body.id, req.body.room);
    // let id = req.body.id;
    // let room = req.body.room;

    // //check id, room
    // if (isStreamer(id, room)) {
    //     res.render("streamer", { userName: id, roomName: room, streamer: true });
    // } else if (isViewer(id, room)) {
    //     res.render("viewer", { userName: id, roomName: room, streamer: false });
    // } else {
    //     console.log("incorrect");
    //     res.render("join");
    //     //not member
    //     // res.json({ alertmsg: "incorrect id" });
    // }

    const lectureId = req.body.lectureId;
    const jwt = req.body.jwt;

    const password = makePassword(lectureId);
    var headers = { 'Authorization': jwt };
    var options = {
        url: 'http://117.16.136.156:8085/lecture/join',
        method: 'GET',
        headers: headers,
        qs: { 'password': password, 'lectureId': lectureId }
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else if (!error && response.statusCode == 200) {
            console.log('200');
            body = JSON.parse(body);
            const { name, expert, expertId } = body;
            request(`http://117.16.136.156:8085/lecture/${lectureId}`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    let { title, category, startedAt, endedAt, expertName } = body;
                    startedAt = startedAt.substring(11, 16);
                    endedAt = endedAt.substring(11, 16);
                    if (expert) {
                        res.render("streamer", { userName: name, roomName: lectureId, expertId, jwt, streamer: true, title, category, startedAt, endedAt, expertName });
                    } else {
                        res.render("viewer", { userName: name, roomName: lectureId, expertId, jwt, streamer: false, title, category, startedAt, endedAt, expertName });
                    }
                }
            });
        }
        else {
            //강연참여자가 아님
            console.log('500');
            res.status(500);
        }
    });
}

streamingRouter.get("/join", getJoin);
streamingRouter.post("/join", postJoin);

export default streamingRouter;

function makePassword(accessKey = '', password = 'ThisIsA_SecretKeyForLivExpert_SW11_JDK!@') {
    let hash = cryptoJS.HmacSHA256(accessKey, password);
    return cryptoJS.enc.Base64.stringify(hash);
}

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
