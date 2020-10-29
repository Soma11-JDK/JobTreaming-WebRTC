const { main } = require('../../io');
import EVENT from "../../event";

const uploadStartHandler = (uploader, fileInfo) => {
    console.log('Start uploading');
    console.log(fileInfo);
}

const uploadStreamHandler = (uploader, fileInfo) => {
    console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
}

const uploadCompleteHandler = (uploader, fileInfo) => {
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
}

const uploadErrorHandler = (uploader, err) => {
    console.log('Error!', err);
}

const uploadAbortHandler = (uploader, fileInfo) => {
    console.log('Aborted: ', fileInfo);
}

module.exports = { uploadStartHandler, uploadStreamHandler, uploadCompleteHandler, uploadErrorHandler, uploadAbortHandler };
