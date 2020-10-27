//roomName,userName을 변경하지 못하도록 다른방법으로 가져올수있는지 조사해보기
const userName = document.querySelector(".userName").textContent;
const roomName = document.querySelector(".roomName").textContent;
const videoElement = document.querySelector("video");
const audioSelect = document.querySelector("select#audioSource");
const videoSelect = document.querySelector("select#videoSource");
const peerConnections = {};
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

//서버에 소켓연결
const socket = io.connect('/main');
var uploader = new SocketIOFileClient(socket);

//room에 join
socket.emit(EVENT.JOINROOM, { userName, roomName });
socket.on('join-success', () => {
    console.log('join-suceess');
})

//새로운 viewer가 들어옴
socket.on(EVENT.VIEWER_READY, viewerId => {
    //새로운 viewer의 PeerConnection를 만듦
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[viewerId] = peerConnection;

    //비디오소스를 스트림에 넣고, pc에 addTrack을 한다.
    //const stream = videoElement.srcObject;
    const stream = window.stream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    //onicecandidate설정
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            const { candidate } = event;
            socket.emit(EVENT.CANDIDATE, { id: viewerId, candidate });
            console.log('sending candidate');
        }
    };

    //offer를 socketid에게 전송
    peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            const streamerDescription = peerConnection.localDescription;
            socket.emit(EVENT.OFFER, { viewerId, streamerDescription });
            console.log('sending offer');
        });
});

//socketid의 description 저장
socket.on(EVENT.ANSWER, (data) => {
    console.log('received answer');
    const { viewerDescription } = data;
    const { viewerId } = data;
    peerConnections[viewerId].setRemoteDescription(viewerDescription);
});

socket.on(EVENT.CANDIDATE, (data) => {
    console.log('received candidate');
    peerConnections[data.id].addIceCandidate(new RTCIceCandidate(data.candidate));
});

socket.on(EVENT.DISCONNECTPEER, (id) => {
    if (peerConnections[id] !== undefined) {
        console.log('delete');
        peerConnections[id].close();
        delete peerConnections[id];
    }
});

//윈도우가 닫히면 소켓닫기
window.onunload = window.onbeforeunload = () => {
    socket.close();
};

//핸들러 등록
audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

//처음한번만 select 옵션등록.
getStream().then(getDevices).then(gotDevices);


function getDevices() {
    //이 메서드는 사용(또는 접근)이 가능한 미디어 입력장치나 출력장치들의 리스트를 가져온다.
    //예를 들면 마이크, 카메라, 헤드셋 등의 미디어 입/출력 장치 리스트를 불러온다. 
    return navigator.mediaDevices.enumerateDevices();
}

//select의 옵션 설정하기
function gotDevices(deviceInfos) {
    window.deviceInfos = deviceInfos;
    for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        //label이 없으면 microphone(camera) index로 지정 
        if (deviceInfo.kind === "audioinput") {
            option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
            audioSelect.appendChild(option);
        } else if (deviceInfo.kind === "videoinput") {
            option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        }
    }
}

function getStream() {
    //window.stream에 있던 track들을 모두 stop 시킨다.
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    //생성할 로컬 MediaStream의 input을 지정한다. 
    //audioSelect와 videoSelect의 value가 있으면 value에 해당하는 mediastream이 input으로 지정되고,
    //value가 undefined일 때도 audio와 video의 boolean은 true이므로 기본적인 audio와 video가 input으로 지정됩니다.
    const audioSource = audioSelect.value;
    const videoSource = videoSelect.value;
    const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    };
    console.log(Boolean(constraints.audio), Boolean(constraints.video));
    //여러개의 MediaStreamTrack으로 구성되는 로컬 MediaStream 객체 생성.
    return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
}

function gotStream(stream) {
    //window.stream에 로컬 MediaStream객체 저장.
    window.stream = stream;
    console.log(stream);
    console.log(stream.getAudioTracks());
    console.log(stream.getVideoTracks());
    //로컬 MediaStream의 video와 audio를 selected한다.
    audioSelect.selectedIndex = [...audioSelect.options].findIndex(
        option => option.text === stream.getAudioTracks()[0].label
    );
    videoSelect.selectedIndex = [...videoSelect.options].findIndex(
        option => option.text === stream.getVideoTracks()[0].label
    );
    //로컬비디오에도 스트림을 등록시킨다.
    videoElement.srcObject = stream;
    //스트리머는 스트림을 주고받을 준비가 완료됨.
    socket.emit(EVENT.STREAMER_READY, roomName);
}

function handleError(error) {
    console.error("Error: ", error);
}