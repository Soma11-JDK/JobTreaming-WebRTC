import { io, main, rehearsal, SocketIOFile } from "./io";
import EVENT from "./event";
import registerConnectingEvents from "./connecting/registerConnectingEvents";
import registerSignalingEvents from "./signaling/registerSignalingEvents";
import registerUploadingEvents from "./uploading/registerUploadingEvents";
import registerChattingEvents from "./chatting/registerChattingEvents";

main.on(EVENT.CONNECTION, socket => {

    //signaling
    registerSignalingEvents(socket);

    //connecting
    registerConnectingEvents(socket);

    //chatting
    registerChattingEvents(socket);

    //uploading
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
    registerUploadingEvents(uploader);
});

export default io;