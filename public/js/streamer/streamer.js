window.onunload = window.onbeforeunload = () => {
    //후기작성창 띄우기
    videoElement.srcObject.getVideoTracks()[0].enabled = false;
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
        stream.addTrack(videoElement.srcObject.getAudioTracks()[0]);
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
        stream.addTrack(videoElement.srcObject.getVideoTracks()[0]);
        videoElement.srcObject = stream;
    });
}

function videoEnableHandler(enb) {
    if (enb) {
        videoIcon.classList.add("fa-video");
        videoIcon.classList.remove("fa-video-slash");
        videoSelect.classList.remove("hidden");
        console.log(videoElement.srcObject);
        videoElement.srcObject.getVideoTracks()[0].enabled = true;
    } else {
        videoIcon.classList.remove("fa-video");
        videoIcon.classList.add("fa-video-slash");
        videoSelect.classList.add("hidden");
        videoElement.srcObject.getVideoTracks()[0].enabled = false;
    }
}

function audioEnableHandler(enb) {
    if (enb) {
        audioIcon.classList.add("fa-microphone");
        audioIcon.classList.remove("fa-microphone-slash");
        audioSelect.classList.remove("hidden");
        videoElement.srcObject.getAudioTracks()[0].enabled = true;
    } else {
        audioIcon.classList.remove("fa-microphone");
        audioIcon.classList.add("fa-microphone-slash");
        audioSelect.classList.add("hidden");
        videoElement.srcObject.getAudioTracks()[0].enabled = false;
    }
}

async function gotDevices() {
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();
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



function toggleEnableVideoHandler() {
    videoEnable = !videoEnable;
    if (videoEnable) changeVideoHandler();
    videoEnableHandler(videoEnable);
}

function toggleEnableAudioHandler() {
    audioEnable = !audioEnable;
    audioEnableHandler(audioEnable);
}

function startCapture() {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        videoEnable = false;
        videoEnableHandler(videoEnable);
        //remote
        for (let key in peerConnections) {
            const pc = peerConnections[key]
            console.log(pc.getSenders());
            pc.getSenders().forEach((rtcrtpsender) => {
                if (rtcrtpsender.track.kind == "video") {
                    rtcrtpsender.replaceTrack(stream.getVideoTracks()[0]);
                }
            });
        }
        //rocal
        stream.addTrack(videoElement.srcObject.getAudioTracks()[0]);
        videoElement.srcObject = stream;
        videoElement.classList.remove('leftRightChange');
        socket.emit('startCapture', roomName);
        scrnSharWrap.removeEventListener("click", startCapture);
        scrnSharWrap.addEventListener("click", stopCapture);
        //video disable
        videoSelectWrap.classList.add('_disable');
        videoSelectWrap.classList.remove('hoverb');
        videoSelectWrap.removeEventListener("click", toggleEnableVideoHandler);
        scrnIcon.innerHTML = "";
        //stopEvent Handler
        videoElement.srcObject.getVideoTracks()[0].onended = () => {
            stopCapture();
        };

    });
}

async function stopCapture() {
    //remote
    for (let key in peerConnections) {
        const pc = peerConnections[key]
        console.log(pc.getSenders());
        pc.getSenders().forEach((rtcrtpsender) => {
            if (rtcrtpsender.track.kind == "video") {
                console.log(rtcrtpsender);
                rtcrtpsender.track.enabled = false;
                rtcrtpsender.track.stop();
            }
        });
    }
    //rocal
    videoElement.srcObject.getVideoTracks()[0].enabled = false;
    videoElement.srcObject.getVideoTracks()[0].stop();
    videoElement.classList.add('leftRightChange');
    socket.emit('stopCapture', roomName);
    scrnSharWrap.removeEventListener("click", stopCapture);
    scrnSharWrap.addEventListener("click", startCapture);
    //video able
    scrnIcon.innerHTML = '<i class="fas fa-slash"></i><i class="fas fa-slash slh"></i>';
    videoSelectWrap.classList.remove('_disable');
    videoSelectWrap.addEventListener("click", toggleEnableVideoHandler);
}

function audioOutputEnableHandler() {
    handleVolumeClick();
    audioOutputSelect.classList.toggle("hidden");
    if (audioOutputIcon.innerHTML == "") {
        audioOutputIcon.innerHTML = '<i class="fas fa-slash"></i><i class="fas fa-slash slh"></i>';
    } else {
        audioOutputIcon.innerHTML = "";
    }
}

function changeDeviceHandler() {
    gotDevices();
    if (videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => {
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
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            audioSelect.selectedIndex = [...audioSelect.options].findIndex(
                option => option.text === stream.getAudioTracks()[0].label
            );
            videoSelect.selectedIndex = [...videoSelect.options].findIndex(
                option => option.text === stream.getVideoTracks()[0].label
            );
            videoEnableHandler(videoEnable);
            audioEnableHandler(audioEnable);
            videoElement.srcObject = stream;
            socket.emit(EVENT.STREAMER_READY, roomName);
        })
        .catch(handleError);
}

function streamInit() {
    gotDevices();
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            audioSelect.selectedIndex = [...audioSelect.options].findIndex(
                option => option.text === stream.getAudioTracks()[0].label
            );
            videoSelect.selectedIndex = [...videoSelect.options].findIndex(
                option => option.text === stream.getVideoTracks()[0].label
            );
            videoElement.srcObject = stream;
            videoEnableHandler(videoEnable);
            audioEnableHandler(audioEnable);
            socket.emit(EVENT.STREAMER_READY, roomName);
            console.log(videoElement.srcObject);
        })
        .catch(handleError);
}

videoSelectWrap.addEventListener("click", toggleEnableVideoHandler);
audioSelectWrap.addEventListener("click", toggleEnableAudioHandler);
audioOutputSelectWrap.addEventListener("click", audioOutputEnableHandler);
scrnSharWrap.addEventListener("click", startCapture);

videoSelect.onchange = changeVideoHandler;
audioSelect.onchange = changeAudioHandler;
audioOutputSelect.onchange = changeAudioDestination;

navigator.mediaDevices.ondevicechange = changeDeviceHandler;

socket.emit(EVENT.JOINROOM, { userName, roomName });

streamInit();