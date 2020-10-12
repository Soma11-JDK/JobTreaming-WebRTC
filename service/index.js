import io from "./io";
import EVENT from "./event";
const registerSignalingEvents = require('./signaling/registerSignalingEvents');

//namespace
const main = io.of('/main');
const rehearsal = io.of('/rehearsal');

//main
main.on(EVENT.CONNECTION, socket => {

    socket.on(EVENT.ROOMJOIN, (data) => {
        const userName = data.userName;
        const roomName = data.roomName;

        socket.userName = userName;
        socket.join(roomName, () => {
            //room에 있는 모두에게 userName님이 입장했다는 알림보내기
            main.in(roomName).emit(EVENT.NOTICE, `[${userName}] 님이 입장하셨습니다.`);
        })
    })

    socket.on(EVENT.CHAT, (data) => {
        main.in(data.roomName).emit(EVENT.CHAT, data);
    })

});


//rehearsal

export default io;