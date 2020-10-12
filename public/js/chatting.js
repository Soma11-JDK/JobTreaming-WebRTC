const chattingContents = document.querySelector('.chatting-contents');
const chattingInput = document.querySelector(".chatting-form__input");
const chattingButton = document.querySelector(".chatting-form__button");
const fileSelect = document.querySelector(".chatting-form__file");

socket.on(EVENT.NOTICE, (msg) => {
    console.log(msg);
    var div = document.createElement('div');
    div.textContent = msg;
    div.classList.add('chat__notice');
    chattingContents.appendChild(div);
    chattingContents.scrollTop = chattingContents.scrollHeight;
});

socket.on(EVENT.CHAT, (data) => {

    console.log(data.text);
    var div = document.createElement('div');
    var inDiv = document.createElement('div');
    var ininDiv = document.createElement('div');
    var textSpan = document.createElement('span');
    var timeSpan = document.createElement('span');

    div.classList.add('message-row');
    inDiv.classList.add('message-row__content');
    ininDiv.classList.add('message__info');
    textSpan.classList.add('message__bubble');
    timeSpan.classList.add('message__time');

    textSpan.textContent = data.text;
    timeSpan.textContent = data.time;

    div.appendChild(inDiv);
    inDiv.appendChild(ininDiv);
    ininDiv.appendChild(textSpan);
    ininDiv.appendChild(timeSpan);


    if (data.userName == userName) {
        div.classList.add('message-row--own');
    } else {
        var userNameSpan = document.createElement('span');
        userNameSpan.classList.add('message__author');
        userNameSpan.textContent = data.userName;
        inDiv.insertBefore(userNameSpan, inDiv.firstChild);
    }

    chattingContents.appendChild(div);
    chattingContents.scrollTop = chattingContents.scrollHeight;
});

function chattingSubmitHandler() {
    // e.preventDefault();
    let now = new Date();
    const time = now.getHours() + ":" + now.getMinutes();
    const text = chattingInput.value;
    socket.emit(EVENT.CHAT, { userName, roomName, text, time });
    chattingInput.value = '';
};

chattingInput.addEventListener('keypress', (e) => { if (e.which == 13) { chattingSubmitHandler(); } });
chattingButton.addEventListener('click', chattingSubmitHandler);


fileSelect.addEventListener('change', () => {
    const files = fileSelect.files;

    for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
    }
});