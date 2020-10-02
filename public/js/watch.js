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

const socket = io.connect('https://192.168.43.130:8080');
const video = document.querySelector("video");
const enableAudioButton = document.querySelector("#enable-audio");

enableAudioButton.addEventListener("click", enableAudio)

//offer들어오면
socket.on("offer", (id, description) => {
    //pc만들고
    peerConnection = new RTCPeerConnection(config);
    //answer보내기
    peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            socket.emit("answer", id, peerConnection.localDescription);
        });
    //ontrack설정
    peerConnection.ontrack = event => {
        video.srcObject = event.streams[0];
    };
    //onicecandidate설정
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("candidate", id, event.candidate);
        }
    };
});


socket.on("candidate", (id, candidate) => {
    peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
});

socket.on("connect", () => {
    socket.emit("watcher");
});

socket.on("broadcaster", () => {
    socket.emit("watcher");
});

socket.on("disconnectPeer", () => {
    peerConnection.close();
});

window.onunload = window.onbeforeunload = () => {
    socket.close();
};

function enableAudio() {
    console.log("Enabling audio")
    video.muted = false;
}