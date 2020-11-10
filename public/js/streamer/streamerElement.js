const peerConnections = {};
const config = {
    iceServers: [
        {
            "urls": "stun:stun.l.google.com:19302",
        },
        // {
        //     "urls": "turn:3.35.191.156", "credential": "fjssj", "username": "wldud"
        // }
        // { 
        //   "urls": "turn:TURN_IP?transport=tcp",
        //   "username": "TURN_USERNAME",
        //   "credential": "TURN_CREDENTIALS"
        // }
    ]
};
const socket = io.connect('/main');
const uploader = new SocketIOFileClient(socket);
const userName = document.querySelector(".userName").textContent;
const roomName = document.querySelector(".roomName").textContent;
let videoEnable = false;
let audioEnable = false;
const isStreamer = true;

//select
const audioSelect = document.querySelector("select#audioSource");
const videoSelect = document.querySelector("select#videoSource");
const audioOutputSelect = document.querySelector("select#audioOutputSource");

//share scr btn
const scrnSharWrap = document.querySelector(".scrnSharWrap");
const scrnIcon = document.querySelector(".scrnIcon");

//video enable btn
const videoSelectWrap = document.querySelector(".videoSelectWrap");
const videoIcon = document.querySelector(".videoIcon");
//audio enable btn
const audioSelectWrap = document.querySelector(".audioSelectWrap");
const audioIcon = document.querySelector(".audioIcon");

//audioOutput enable btn
const audioOutputSelectWrap = document.querySelector(".audioOutputSelectWrap");
const audioOutputIcon = document.querySelector(".audioOutputIcon");

//videoElement
const videoElement = document.querySelector(".screen-video");