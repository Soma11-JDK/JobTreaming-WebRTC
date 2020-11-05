const chattingInput = document.querySelector(".chatting-form__input");
const chattingButton = document.querySelector(".chatting-form__button");
const fileSelect = document.querySelector(".chatting-form__file");
const chattingContents = document.querySelector('.chatting-contents');

function makeChat(sender, time, contents) {
    const messageRow = document.createElement('div');
    messageRow.classList.add('message-row');
    if (sender == userName) {
        messageRow.classList.add('message-row--own');
        messageRow.innerHTML = `
            <div class="message-row__content">
                <div class="message__info">
                    <div class="message__bubble">
                        ${contents}
                    </div>
                    <span class="message__time">${time}</span>
                </div>
            </div>`;
    } else {
        messageRow.innerHTML = `
            <div class="message-row__content">
                <span class="message__author">${sender}</span>
                <div class="message__info">
                    <div class="message__bubble">
                        ${contents}
                    </div>
                    <span class="message__time">${time}</span>
                </div>
            </div>`;
    }
    chattingContents.appendChild(messageRow);
    chattingContents.scrollTop = chattingContents.scrollHeight;
}

socket.on(EVENT.NOTICE, (msg) => {
    const div = document.createElement('div');
    div.classList.add('chat__notice');
    div.textContent = msg;
    chattingContents.appendChild(div);
    chattingContents.scrollTop = chattingContents.scrollHeight;
});

socket.on(EVENT.CHAT, (data) => {
    const contents = `<span>${data.text}</span>`;
    makeChat(data.userName, data.time.substring(11, 16), contents);

});

socket.on(EVENT.CHAT_DOCUMENT, (data) => {
    const contents = `
    <div class="message__document">
        <div class="document__text">
            <span class="document__text__name">${data.documentName}</span>
            <span>${data.size}bytes</span>
        </div>
        <a href="${data.document}" download>
            <i class="document__icon far fa-arrow-alt-circle-down"></i>
        </a>
    </div>`;

    makeChat(data.userName, data.time.substring(11, 16), contents);
});

socket.on(EVENT.CHAT_IMAGE, (data) => {

    const contents = `
        <a href="${data.image}" download="${data.image}"> 
            <img class="message__image" src="${data.image}">
            </img>
        </a>
    `;
    makeChat(data.userName, data.time.substring(11, 16), contents);
});
const chattingSubmitHandler = () => {
    if (chattingInput.value) {
        const text = chattingInput.value;
        socket.emit(EVENT.CHAT, { userName, roomName, text });
        chattingInput.value = '';
    }
};

const fileChangeHandler = (e) => {
    e.preventDefault();
    uploader.upload(fileSelect.files, { data: { userName, roomName } });
}
chattingInput.addEventListener('keypress', (e) => { if (e.which == 13) { chattingSubmitHandler(); } });
chattingButton.addEventListener('click', chattingSubmitHandler);
fileSelect.addEventListener('change', fileChangeHandler);
