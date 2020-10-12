const {
    sendOfferDescriptionHandler,
    sendAnswerDescriptionHandler,
    sendIceCandidateHandler,
} = require('./eventHandlers');

module.exports = socket => {
    //첫번째 인수만 고정
    socket.on('offer', sendOfferDescriptionHandler.bind(null, socket));
    socket.on('answer', sendAnswerDescriptionHandler.bind(null, socket));
    socket.on('candidate', sendIceCandidateHandler.bind(null, socket));
};