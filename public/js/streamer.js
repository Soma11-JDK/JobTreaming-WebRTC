const userName = document.querySelector(".userName").textContent;
const roomName = document.querySelector(".roomName").textContent;

// const EVENT = require('./event');



// const peerConnections = {};
// const config = {
//     iceServers: [
//         {
//             "urls": "stun:stun.l.google.com:19302",
//         },
//         // { 
//         //   "urls": "turn:TURN_IP?transport=tcp",
//         //   "username": "TURN_USERNAME",
//         //   "credential": "TURN_CREDENTIALS"
//         // }
//     ]
// };

const socket = io.connect('/main');

//room에 join
socket.emit(EVENT.ROOMJOIN, { userName, roomName });

// .message-row
//     .message-row__content
//         span.message__author 김성영
//         .message__info
//             span.message__bubble 안녕하세용!
//             span.message__time 21:27



// //socketid의 description 저장
// socket.on("answer", (id, description) => {
//     peerConnections[id].setRemoteDescription(description);
// });

// //새로운 와처가 들어옴
// socket.on("watcher", id => {
//     //socketid의 pc를 만듦
//     const peerConnection = new RTCPeerConnection(config);
//     peerConnections[id] = peerConnection;

//     //비디오소스를 스트림에 넣고, pc에 addTrack을 한다. 
//     let stream = videoElement.srcObject;
//     stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

//     //onicecandidate설정
//     peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//             socket.emit("candidate", id, event.candidate);
//         }
//     };

//     //offer를 socketid에게 전송
//     peerConnection
//         .createOffer()
//         .then(sdp => peerConnection.setLocalDescription(sdp))
//         .then(() => {
//             socket.emit("offer", id, peerConnection.localDescription);
//         });
// });

// socket.on("candidate", (id, candidate) => {
//     peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
// });

// socket.on("disconnectPeer", id => {
//     peerConnections[id].close();
//     delete peerConnections[id];
// });

//윈도우가 닫히면 소켓닫기
window.onunload = window.onbeforeunload = () => {
    socket.close();
};



// // Get camera and microphone
// const videoElement = document.querySelector("video");
// const audioSelect = document.querySelector("select#audioSource");
// const videoSelect = document.querySelector("select#videoSource");

// //핸들러 등록
// audioSelect.onchange = getStream;
// videoSelect.onchange = getStream;

// //1.getStream
// getStream().then(getDevices).then(gotDevices);

// function getDevices() {
//     return navigator.mediaDevices.enumerateDevices();
// }

// function gotDevices(deviceInfos) {
//     window.deviceInfos = deviceInfos;
//     for (const deviceInfo of deviceInfos) {
//         const option = document.createElement("option");
//         option.value = deviceInfo.deviceId;
//         if (deviceInfo.kind === "audioinput") {
//             option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
//             audioSelect.appendChild(option);
//         } else if (deviceInfo.kind === "videoinput") {
//             option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
//             videoSelect.appendChild(option);
//         }
//     }
// }

// //
// function getStream() {
//     if (window.stream) {
//         window.stream.getTracks().forEach(track => {
//             track.stop();
//         });
//     }
//     const audioSource = audioSelect.value;
//     const videoSource = videoSelect.value;
//     const constraints = {
//         audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
//         video: { deviceId: videoSource ? { exact: videoSource } : undefined }
//     };
//     return navigator.mediaDevices
//         .getUserMedia(constraints)
//         .then(gotStream)
//         .catch(handleError);
// }

// function gotStream(stream) {
//     window.stream = stream;
//     audioSelect.selectedIndex = [...audioSelect.options].findIndex(
//         option => option.text === stream.getAudioTracks()[0].label
//     );
//     videoSelect.selectedIndex = [...videoSelect.options].findIndex(
//         option => option.text === stream.getVideoTracks()[0].label
//     );
//     videoElement.srcObject = stream;
//     //socket.emit("broadcaster");
// }

// function handleError(error) {
//     console.error("Error: ", error);
// }