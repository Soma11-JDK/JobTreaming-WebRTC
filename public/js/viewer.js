const userName = document.querySelector(".userName").textContent;
const roomName = document.querySelector(".roomName").textContent;
const video = document.querySelector("video");
const enableAudioButton = document.querySelector("#enable-audio");

let peerConnection;
const config = {
    iceServers: [
        {
            "urls": "stun:stun.l.google.com:19302",
        },
        // { 
        //   "urls": "turn:TURN_IP?transport=tcp",
        //   "username": "TURN_USERNAME",
        //   "credential": "TURN_CREDENTIALS"
        // }
    ]
};

const socket = io.connect('/main');
var uploader = new SocketIOFileClient(socket);

socket.emit(EVENT.JOINROOM, { userName, roomName });

socket.on('join-success', () => {
    socket.emit(EVENT.VIEWER_READY, roomName);
});

enableAudioButton.addEventListener("click", enableAudio)

socket.on(EVENT.OFFER, (data) => {
    console.log('receive offer');
    const { streamerId } = data;
    const { streamerDescription } = data;

    //pc만들고
    peerConnection = new RTCPeerConnection(config);
    //answer보내기
    peerConnection
        .setRemoteDescription(streamerDescription)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            const viewerDescription = peerConnection.localDescription;
            socket.emit(EVENT.ANSWER, { streamerId, viewerDescription });
            console.log('sending answer');
        });
    //ontrack설정
    peerConnection.ontrack = event => {
        video.srcObject = event.streams[0];
    };
    //onicecandidate설정
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            const { candidate } = event;
            socket.emit(EVENT.CANDIDATE, { id: streamerId, candidate });
            console.log('sending candidate');
        }
    };
});


socket.on(EVENT.CANDIDATE, (data) => {
    console.log('recived candidate');
    peerConnection
        .addIceCandidate(new RTCIceCandidate(data.candidate))
        .catch(e => console.error(e));
});

socket.on(EVENT.STREAMER_READY, () => {
    socket.emit(EVENT.VIEWER_READY, roomName);
});

window.onunload = window.onbeforeunload = () => {
    socket.close();
};

function enableAudio() {
    video.muted = false;
}