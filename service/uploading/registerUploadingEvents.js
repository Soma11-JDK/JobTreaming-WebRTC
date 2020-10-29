const EVENT = require('../event');
const {
    uploadStartHandler,
    uploadStreamHandler,
    uploadCompleteHandler,
    uploadErrorHandler,
    uploadAbortHandler
} = require('./eventHandlers');

module.exports = uploader => {
    uploader.on(EVENT.UPLOAD_START, uploadStartHandler.bind(null, uploader));
    uploader.on(EVENT.UPLOAD_STREAM, uploadStreamHandler.bind(null, uploader));
    uploader.on(EVENT.UPLOAD_COMPLETE, uploadCompleteHandler.bind(null, uploader));
    uploader.on(EVENT.UPLOAD_ERROR, uploadErrorHandler.bind(null, uploader));
    uploader.on(EVENT.UPLOAD_ABORT, uploadAbortHandler.bind(null, uploader));
};