import express from "express"; //for Routing
import request from "request";
import cryptoJS from 'crypto-js';

const streamingRouter = express.Router();

const getStreaming = (req, res) => {
    //lectureId, password, jwt 받음.
    if (req.query.lectureId && req.query.jwt){
        const lectureId = req.query.lectureId;
        const jwt = req.query.jwt;

        const password = makePassword(lectureId);
        var headers = { 'Authorization':  jwt };
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
                const { name, expert } = body;
                request(`http://117.16.136.156:8085/lecture/${lectureId}`, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        body = JSON.parse(body);
                        let { title, category, startedAt, endedAt } = body;
                        startedAt = startedAt.substring(11, 16);
                        endedAt = endedAt.substring(11, 16);
                        if (expert) {
                            res.render("streamer", { userName: name, roomName: lectureId, streamer: true, title, category, startedAt, endedAt });
                        } else {
                            res.render("viewer", { userName: name, roomName: lectureId, streamer: false, title, category, startedAt, endedAt });
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

export default streamingRouter;

function makePassword(accessKey = '', password = 'ThisIsA_SecretKeyForLivExpert_SW11_JDK!@') {
    let hash = cryptoJS.HmacSHA256(accessKey, password);
    return cryptoJS.enc.Base64.stringify(hash);
}
