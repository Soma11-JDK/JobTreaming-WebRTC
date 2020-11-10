window.onunload = window.onbeforeunload = () => {
    //후기작성창 띄우기
    window.stream.getVideoTracks()[0].enabled = false;
    socket.close();
};

function handleError(error) {
    console.error("Error: ", error);
}

function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
        element.setSinkId(sinkId)
            .then(() => {
                console.log(`Success, audio output device attached: ${sinkId}`);
            })
            .catch(error => {
                let errorMessage = error;
                if (error.name === 'SecurityError') {
                    errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                }
                console.error(errorMessage);
                // Jump back to first output device in the list as it's the default.
                audioOutputSelect.selectedIndex = 0;
            });
    } else {
        console.warn('Browser does not support output device selection.');
    }
}

function changeAudioDestination() {
    const audioDestination = audioOutputSelect.value;
    attachSinkId(videoElement, audioDestination);
}

function changeVideoHandler() {
    const videoSource = videoSelect.value;
    const constraints = {
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        for (let key in peerConnections) {
            const pc = peerConnections[key]
            console.log(pc.getSenders());
            pc.getSenders().forEach((rtcrtpsender) => {
                if (rtcrtpsender.track.kind == "video") {
                    rtcrtpsender.replaceTrack(stream.getVideoTracks()[0]);
                }
            });
        }
        stream.addTrack(window.stream.getAudioTracks()[0]);
        window.stream = stream;
        videoElement.srcObject = stream;
        videoElement.classList.add('leftRightChange');
    });
}

function changeAudioHandler() {

    const audioSource = audioSelect.value;
    const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined }
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        for (let key in peerConnections) {
            const pc = peerConnections[key]
            console.log(pc.getSenders());
            pc.getSenders().forEach((rtcrtpsender) => {
                if (rtcrtpsender.track.kind == "audio") {
                    rtcrtpsender.replaceTrack(stream.getAudioTracks()[0]);
                }
            });
        }
        stream.addTrack(window.stream.getVideoTracks()[0]);
        window.stream = stream;
        videoElement.srcObject = stream;
    });
}

function videoEnableHandler(enb) {
    if (enb) {
        videoIcon.classList.add("fa-video");
        videoIcon.classList.remove("fa-video-slash");
        videoSelect.classList.remove("hidden");
        window.stream.getVideoTracks()[0].enabled = true;
    } else {
        videoIcon.classList.remove("fa-video");
        videoIcon.classList.add("fa-video-slash");
        videoSelect.classList.add("hidden");
        window.stream.getVideoTracks()[0].enabled = false;
    }
}

function audioEnableHandler(enb) {
    if (enb) {
        audioIcon.classList.add("fa-microphone");
        audioIcon.classList.remove("fa-microphone-slash");
        audioSelect.classList.remove("hidden");
        window.stream.getAudioTracks()[0].enabled = true;
    } else {
        audioIcon.classList.remove("fa-microphone");
        audioIcon.classList.add("fa-microphone-slash");
        audioSelect.classList.add("hidden");
        window.stream.getAudioTracks()[0].enabled = false;
    }
}

function getDevices() {
    return navigator.mediaDevices.enumerateDevices();
}
function gotDevices(deviceInfos) {
    audioSelect.options.length = 0;
    videoSelect.options.length = 0;
    window.deviceInfos = deviceInfos;
    for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
            option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
            audioSelect.appendChild(option);
        } else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
            audioOutputSelect.appendChild(option);
        } else if (deviceInfo.kind === "videoinput") {
            option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        }
    }
}

function getStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioSelect.value;
    const videoSource = videoSelect.value;
    console.log(audioSource, videoSource);
    const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    };
    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
}

function gotStream(stream) {
    //window.stream에 로컬 MediaStream객체 저장.
    window.stream = stream;

    //로컬 MediaStream의 video와 audio를 selected한다. 제일 처음을 위해서..
    audioSelect.selectedIndex = [...audioSelect.options].findIndex(
        option => option.text === stream.getAudioTracks()[0].label
    );
    videoSelect.selectedIndex = [...videoSelect.options].findIndex(
        option => option.text === stream.getVideoTracks()[0].label
    );
    //Enable check
    videoEnableHandler(videoEnable);
    audioEnableHandler(audioEnable);
    //로컬비디오에도 스트림을 등록시킨다.
    videoElement.srcObject = window.stream;
    //스트리머는 스트림을 주고받을 준비가 완료됨.
    socket.emit(EVENT.STREAMER_READY, roomName);
}

function streamInit() {
    //select list 초기화
    getDevices().then(gotDevices);
    //stream초기화
    getStream();
}

function toggleEnableVideoHandler() {
    videoEnable = !videoEnable;
    if (videoEnable) changeVideoHandler();
    videoEnableHandler(videoEnable);
}

function toggleEnableAudioHandler() {
    audioEnable = !audioEnable;
    audioEnableHandler(audioEnable);
}

//video enable
videoSelectWrap.addEventListener("click", toggleEnableVideoHandler);

//audio enable
audioSelectWrap.addEventListener("click", toggleEnableAudioHandler);

//audiooutput enable
audioOutputSelectWrap.addEventListener("click", (e) => {
    handleVolumeClick();
    audioOutputSelect.classList.toggle("hidden");
    if (audioOutputIcon.innerHTML == "") {
        audioOutputIcon.innerHTML = '<i class="fas fa-slash"></i><i class="fas fa-slash slh"></i>';
    } else {
        audioOutputIcon.innerHTML = "";
    }
});

function startCapture() {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        for (let key in peerConnections) {
            const pc = peerConnections[key]
            console.log(pc.getSenders());
            pc.getSenders().forEach((rtcrtpsender) => {
                if (rtcrtpsender.track.kind == "video") {
                    rtcrtpsender.replaceTrack(stream.getVideoTracks()[0]);
                }
            });
        }
        stream.addTrack(window.stream.getAudioTracks()[0]);
        window.stream = stream;
        videoElement.srcObject = stream;
        videoElement.classList.remove('leftRightChange');
        videoSelectWrap.classList.add('_disable');
        videoSelectWrap.removeEventListener("click", toggleEnableVideoHandler);
        videoElement.srcObject.getVideoTracks()[0].onended = () => {
            videoSelectWrap.classList.remove('_disable');
            videoSelectWrap.addEventListener("click", toggleEnableVideoHandler);
        };
        scrnSharWrap.removeEventListener("click", startCapture);
        scrnSharWrap.addEventListener("click", stopCapture);
    });
}

function stopCapture() {
    for (let key in peerConnections) {
        const pc = peerConnections[key]
        console.log(pc.getSenders());
        pc.getSenders().forEach((rtcrtpsender) => {
            if (rtcrtpsender.track.kind == "video") {
                console.log(rtcrtpsender);
                rtcrtpsender.track.enabled = false;
            }
        });
    }
    videoElement.srcObject.getVideoTracks()[0].stop();
    videoElement.classList.add('leftRightChange');
    videoSelectWrap.classList.remove('_disable');
    videoSelectWrap.addEventListener("click", toggleEnableVideoHandler);
    scrnSharWrap.removeEventListener("click", stopCapture);
    scrnSharWrap.addEventListener("click", startCapture);
}

scrnSharWrap.addEventListener("click", startCapture);

//선택된 비디오가 바뀌면 stream 초기화
videoSelect.onchange = changeVideoHandler;
//선택된 오디오가 바뀌면 stream 초기화
audioSelect.onchange = changeAudioHandler;
//선택된 아웃풋 오디오가 바뀜
audioOutputSelect.onchange = changeAudioDestination;
//디바이스가 바뀌면 select list 초기화, stream 초기화
navigator.mediaDevices.ondevicechange = streamInit;

socket.emit(EVENT.JOINROOM, { userName, roomName });

streamInit();