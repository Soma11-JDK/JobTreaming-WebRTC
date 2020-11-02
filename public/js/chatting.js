const chattingContents = document.querySelector('.chatting-contents');
const chattingInput = document.querySelector(".chatting-form__input");
const chattingButton = document.querySelector(".chatting-form__button");
const fileSelect = document.querySelector(".chatting-form__file");

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

socket.on(EVENT.NOTICE, (msg) => {
    console.log(msg);
    const div = document.createElement('div');
    div.textContent = msg;
    div.classList.add('chat__notice');
    chattingContents.appendChild(div);
    chattingContents.scrollTop = chattingContents.scrollHeight;
});

function makeChat(sender, time, elm) {
    const div = document.createElement('div');
    const inDiv = document.createElement('div');
    const ininDiv = document.createElement('div');
    const Bubble = document.createElement('div');
    const timeSpan = document.createElement('span');

    div.classList.add('message-row');
    inDiv.classList.add('message-row__content');
    ininDiv.classList.add('message__info');
    Bubble.classList.add('message__bubble');
    timeSpan.classList.add('message__time');

    timeSpan.textContent = time;

    div.appendChild(inDiv);
    inDiv.appendChild(ininDiv);
    ininDiv.appendChild(Bubble);
    ininDiv.appendChild(timeSpan);

    Bubble.appendChild(elm);

    if (sender == userName) {
        div.classList.add('message-row--own');
    } else {
        const userNameSpan = document.createElement('span');
        userNameSpan.classList.add('message__author');
        userNameSpan.textContent = sender;
        inDiv.insertBefore(userNameSpan, inDiv.firstChild);
    }

    chattingContents.appendChild(div);
    chattingContents.scrollTop = chattingContents.scrollHeight;

    //return Bubble;
}


socket.on(EVENT.CHAT, (data) => {
    const textSpan = document.createElement('span');
    textSpan.textContent = data.text;
    makeChat(data.userName, data.time, textSpan);
});

socket.on(EVENT.CHAT_DOCUMENT, (data) => {
    var div = document.createElement('div');
    var inDiv = document.createElement('div');
    var name = document.createElement('span');
    var size = document.createElement('span');
    var a = document.createElement('a');
    var icon = document.createElement('i');

    div.classList.add('message__document');
    inDiv.classList.add('document__text');
    name.classList.add('document__text__name');
    icon.classList.add('document__icon', 'far', 'fa-arrow-alt-circle-down');

    a.href = '/upload/' + data.document;
    a.download = data.document;
    name.textContent = data.document;
    size.textContent = data.size + "bytes";

    icon.addEventListener("click", () => {
        icon.classList.remove('far');
        icon.classList.add('fas');
    });

    div.appendChild(inDiv);
    inDiv.appendChild(name);
    inDiv.appendChild(size);
    div.appendChild(a);
    a.appendChild(icon);


    makeChat(data.userName, data.time, div);
});

socket.on(EVENT.CHAT_IMAGE, (data) => {

    var a = document.createElement('a');
    var image = document.createElement('img');

    a.href = '/upload/' + data.image;
    a.download = data.image;
    image.classList.add('message__image');
    image.src = '/upload/' + data.image;

    a.appendChild(image);

    makeChat(data.userName, data.time, a);
});

function chattingSubmitHandler() {
    if (chattingInput.value) {
        const time = Date.now;
        const text = chattingInput.value;
        socket.emit(EVENT.CHAT, { userName, roomName, text, time });
        chattingInput.value = '';
    }
};

chattingInput.addEventListener('keypress', (e) => { if (e.which == 13) { chattingSubmitHandler(); } });
chattingButton.addEventListener('click', chattingSubmitHandler);

fileSelect.addEventListener('change', function (ev) {
    ev.preventDefault();
    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes();
    uploader.upload(fileSelect.files, { data: { userName, roomName, time } });
});

