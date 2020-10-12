const { io } = require('../../io');

const sendIceCandidateHandler = (socket, id, iceCandidate) => {
  socket.to(id).emit("candidate", socket.id, iceCandidate);
};

module.exports = sendIceCandidateHandler;
