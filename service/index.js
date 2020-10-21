import { io, SocketIOFile } from "./io";
import EVENT, { UPLOAD_STREAM, UPLOAD_COMPLETE, UPLOAD_ERROR, UPLOAD_ABORT } from "./event";
const registerSignalingEvents = require('./signaling/registerSignalingEvents');

//namespace
const main = io.of('/main');
const rehearsal = io.of('/rehearsal');

//main
main.on(EVENT.CONNECTION, socket => {

    var count = 0;
    var uploader = new SocketIOFile(socket, {
        uploadDir: 'public/upload',
        // accepts: ['image/*', 'audio/mp3'],
        maxFileSize: 4194304,
        chunkSize: 10240,
        transmissionDelay: 0,
        overwrite: false,
        // rename: function (filename) {
        //     var split = filename.split('.');	// split filename by .(extension)
        //     var fname = split[0];	// filename without extension
        //     var ext = split[1];

        //     return `${fname}_${count++}.${ext}`;
        // }
    });

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

    uploader.on(EVENT.UPLOAD_START, (fileInfo) => {
        console.log('Start uploading');
        console.log(fileInfo);
    });
    uploader.on(UPLOAD_STREAM, (fileInfo) => {
        console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
    });
    uploader.on(UPLOAD_COMPLETE, (fileInfo) => {
        console.log('Upload Complete.');
        console.log(fileInfo);
        console.log(fileInfo.data);
        const data = fileInfo.data;
        //이미지면
        if (fileInfo.mime.match('image/*')) {
            const userName = data.userName;
            const roomName = data.roomName;
            const image = fileInfo.name;
            const time = data.time;
            main.in(fileInfo.data.roomName).emit(EVENT.CHAT_IMAGE, { userName, roomName, image, time })
        }
        else {//문서면
            const userName = data.userName;
            const roomName = data.roomName;
            const document = fileInfo.name;
            const size = fileInfo.size;
            const time = data.time;
            main.in(fileInfo.data.roomName).emit(EVENT.CHAT_DOCUMENT, { userName, roomName, document, time, size })
        }

    });
    uploader.on(UPLOAD_ERROR, (err) => {
        console.log('Error!', err);
    });
    uploader.on(UPLOAD_ABORT, (fileInfo) => {
        console.log('Aborted: ', fileInfo);
    });
});


//rehearsal

export default io;