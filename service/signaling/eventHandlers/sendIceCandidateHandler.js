import { main } from "../../io";
import EVENT from "../../event";

const sendIceCandidateHandler = (socket, data) => {
  console.log('candidate');
  socket.to(data.id).emit(EVENT.CANDIDATE, { id: socket.id, candidate: data.candidate });
};

module.exports = sendIceCandidateHandler;