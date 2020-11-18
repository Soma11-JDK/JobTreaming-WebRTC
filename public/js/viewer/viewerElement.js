const userName = document.querySelector(".userName").textContent;
const roomName = document.querySelector(".roomName").textContent;
const jwt = document.querySelector(".jwt").textContent;
const expertId = document.querySelector(".expertId").textContent;
const videoElement = document.querySelector(".screen-video");
const video = document.querySelector("video");
const isStreamer = false;

let peerConnection;
const config = {
    iceServers: [
        {
            "urls": "stun:stun.l.google.com:19302",
        },
        // {
        //     "urls": "turn:3.35.191.156:3478?transport=tcp", "username": "wldud", "credential": "fjssj"
        // },
        // {
        //     "urls": "turn:3.35.191.156:3478?transport=udp", "username": "wldud", "credential": "fjssj"
        // },
        // {
        //     "urls": "turn:172.31.8.128:3478?transport=tcp", "username": "wldud", "credential": "fjssj"
        // },
        // {
        //     "urls": "turn:172.31.8.128:3478?transport=udp", "username": "wldud", "credential": "fjssj"
        // },
        // { 
        //   "urls": "turn:TURN_IP?transport=tcp",
        //   "username": "TURN_USERNAME",
        //   "credential": "TURN_CREDENTIALS"
        // }
    ]
};
const socket = io.connect('/main');
var uploader = new SocketIOFileClient(socket);