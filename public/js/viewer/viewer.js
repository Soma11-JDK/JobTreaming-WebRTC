window.onunload = window.onbeforeunload = () => {
    socket.close();
};

window.addEventListener("load", () => {
    socket.emit(EVENT.JOINROOM, { userName, roomName });
});

socket.on('join-success', () => {
    socket.emit(EVENT.VIEWER_READY, roomName);
});
