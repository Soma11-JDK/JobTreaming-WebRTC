import EVENT from "../event";
import {
    sendOfferDescriptionHandler,
    sendAnswerDescriptionHandler,
    sendIceCandidateHandler,
    readyStreamerHandler,
    readyViewerHandler
} from "./eventHandlers";

module.exports = socket => {
    socket.on(EVENT.OFFER, sendOfferDescriptionHandler.bind(null, socket));
    socket.on(EVENT.ANSWER, sendAnswerDescriptionHandler.bind(null, socket));
    socket.on(EVENT.CANDIDATE, sendIceCandidateHandler.bind(null, socket));
    socket.on(EVENT.STREAMER_READY, readyStreamerHandler.bind(null, socket));
    socket.on(EVENT.VIEWER_READY, readyViewerHandler.bind(null, socket));
};