socket.emit(EVENT.JOINROOM, { userName, roomName });

window.onunload = window.onbeforeunload = () => {
    socket.close();
};