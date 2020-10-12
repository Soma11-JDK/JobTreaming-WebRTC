const { io } = require('../../io');
import EVENT from "../../event";

const sendOfferDescriptionHandler = (socket, id, description) => {
  socket.to(id).emit(EVENT.OFFER, socket.id, description);
}

const sendAnswerDescriptionHandler = (socket, id, description) => {
  socket.to(id).emit(EVENT.ANSWER, socket.id, description);
}

module.exports = { sendOfferDescriptionHandler, sendAnswerDescriptionHandler };
