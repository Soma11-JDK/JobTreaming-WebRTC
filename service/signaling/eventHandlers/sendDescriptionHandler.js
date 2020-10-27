import { main } from "../../io";
import EVENT from "../../event";

const sendOfferDescriptionHandler = (socket, data) => {
  console.log('offer');
  const { streamerDescription } = data;
  const { viewerId } = data;
  socket.to(viewerId).emit(EVENT.OFFER, { streamerId: socket.id, streamerDescription });
}

const sendAnswerDescriptionHandler = (socket, data) => {
  console.log('answer');
  const { viewerDescription } = data;
  const { streamerId } = data;
  socket.to(streamerId).emit(EVENT.ANSWER, { viewerId: socket.id, viewerDescription });
}

module.exports = { sendOfferDescriptionHandler, sendAnswerDescriptionHandler };
