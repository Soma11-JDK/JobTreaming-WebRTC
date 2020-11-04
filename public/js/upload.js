uploader.on(EVENT.UPLOAD_READY, function () {
    console.log('SocketIOFile ready to go!');
});
uploader.on(EVENT.UPLOAD_LOADSTART, function () {
    console.log('Loading file to browser before sending...');
});
uploader.on(EVENT.UPLOAD_PROGRESS, function (progress) {
    console.log('Loaded ' + progress.loaded + ' / ' + progress.total);
});
uploader.on(EVENT.UPLOAD_START, function (fileInfo) {
    console.log('Start uploading', fileInfo);
});
uploader.on(EVENT.UPLOAD_STREAM, function (fileInfo) {
    console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});
uploader.on(EVENT.UPLOAD_COMPLETE, function (fileInfo) {
    console.log('Upload Complete', fileInfo);
});
uploader.on(EVENT.UPLOAD_ERROR, function (err) {
    console.log('Error!', err);
});
uploader.on(EVENT.UPLOAD_ABORT, function (fileInfo) {
    console.log('Aborted: ', fileInfo);
});