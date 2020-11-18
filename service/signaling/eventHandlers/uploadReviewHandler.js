import { main } from "../../io";
import EVENT from "../../event";
import request from "request";

const uploadReviewHandler = (socket, data) => {
    let lecture = data.lecture;
    lecture *= 1;

    const options = {
        url: 'http://117.16.136.156:8085/review/add',
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": data.Authorization
        },
        body: {
            "lecture": lecture,
            "contents": data.contents,
            "rating": data.rating
        },
        json: true
    };
    request.post(options, function (error, response, body) {
        console.log(error, response.statusCode);
    }
    );
}

const uploadExpertHandler = (socket, data) => {
    let expert = data.expertId;
    expert *= 1;

    const options = {
        url: 'http://117.16.136.156:8085/evaluation/add',
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": data.Authorization
        },
        body: {
            "expert": expert,
            "evaluation": data.evaluation
        },
        json: true
    };

    request.post(options, function (error, response, body) {
        console.log(error, response.statusCode);
    }
    );
}

module.exports = { uploadReviewHandler, uploadExpertHandler };
