const { main } = require('../../io');
import EVENT from "../../event";
import Comment from "../../../models/Comment";
import File from "../../../models/File";

const uploadStartHandler = (uploader, fileInfo) => {
    console.log('Start uploading');
}

const uploadStreamHandler = (uploader, fileInfo) => {
    console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
}

const uploadCompleteHandler = async (uploader, fileInfo) => {
    console.log('Upload Complete.');

    const userName = fileInfo.data.userName;
    const roomName = fileInfo.data.roomName;
    //이미지면
    if (fileInfo.mime.match('image/*')) {
        const newFile = await File.create({
            fileName: fileInfo.name,
            fileSize: fileInfo.size,
            fileType: 'image',
            fileURL: '/upload/' + fileInfo.name,
            room: roomName
        });
        const newComment = await Comment.create({
            room: roomName,
            writer: userName,
            file: newFile
        });
        main.in(fileInfo.data.roomName).emit(EVENT.CHAT_IMAGE, {
            userName,
            roomName,
            image: newFile.fileURL,
            imageName: newFile.fileName,
            time: newComment.time
        });
    }
    else {//파일이면
        const newFile = await File.create({
            fileName: fileInfo.name,
            fileSize: fileInfo.size,
            fileType: 'file',
            fileURL: '/upload/' + fileInfo.name,
            room: roomName
        });
        const newComment = await Comment.create({
            room: roomName,
            writer: userName,
            file: newFile
        });
        main.in(fileInfo.data.roomName).emit(EVENT.CHAT_DOCUMENT, {
            userName,
            roomName,
            document: newFile.fileURL,
            documentName: newFile.fileName,
            time: newComment.time,
            size: newFile.fileSize
        });
    }
}

const uploadErrorHandler = (uploader, err) => {
    console.log('Error!', err);
}

const uploadAbortHandler = (uploader, fileInfo) => {
    console.log('Aborted: ', fileInfo);
}

module.exports = { uploadStartHandler, uploadStreamHandler, uploadCompleteHandler, uploadErrorHandler, uploadAbortHandler };
