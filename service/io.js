const io = require('socket.io')();
const SocketIOFile = require('socket.io-file');

//connect namespace
const main = io.of('/main');
const rehearsal = io.of('/rehearsal');

module.exports = { io, main, rehearsal, SocketIOFile };