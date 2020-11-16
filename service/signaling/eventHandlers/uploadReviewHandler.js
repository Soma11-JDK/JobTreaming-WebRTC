import { main } from "../../io";
import EVENT from "../../event";
import request from "request";

const uploadReviewHandler = (socket, data) => {
    const options = {
        url: 'http://117.16.136.156:8085/review/add',
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": data.Authorization
        },
        body: {
            "lecture": data.lecture,
            "contents": data.contents,
            "rating": data.rating
        },
        json: true
    };
    console.log(options);
    request.post(options, function (error, response, body) {
        console.log(error, response.statusCode);
    }
    );
}

const uploadExpertHandler = (socket, data) => {
    const options = {
        url: 'http://117.16.136.156:8085/evaluation/add',
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": data.Authorization
        },
        body: {
            "expertId": data.expertId,
            "evaluation": data.evaluation
        },
        json: true
    };
    console.log(options);
    request.post(options, function (error, response, body) {
        console.log(error, response.statusCode);
    }
    );
}

module.exports = { uploadReviewHandler, uploadExpertHandler };
