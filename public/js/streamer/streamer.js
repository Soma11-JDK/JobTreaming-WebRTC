window.onunload = window.onbeforeunload = () => {
    socket.close();
};

function handleError(error) {
    console.error("Error: ", error);
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

//video enable
videoSelectWrap.addEventListener("click", (e) => {
    videoEnable = !videoEnable;
    videoEnableHandler(videoEnable);
    console.log(videoEnable);
});

//audio enable
audioSelectWrap.addEventListener("click", (e) => {
    audioEnable = !audioEnable;
    audioEnableHandler(audioEnable);
    console.log(audioEnable);
});

audioOutputSelectWrap.addEventListener("click", (e) => {
    handleVolumeClick();
    audioOutputSelect.classList.toggle("hidden");
    if (audioOutputIcon.innerHTML == "") {
        audioOutputIcon.innerHTML = '<i class="fas fa-slash"></i><i class="fas fa-slash slh"></i>';
    } else {
        audioOutputIcon.innerHTML = "";
    }
});

// function handleSuccess(stream) {
//     startButton.disabled = true;
//     const video = document.querySelector('video');
//     video.srcObject = stream;

//     // demonstrates how to detect that the user has stopped
//     // sharing the screen via the browser UI.
//     stream.getVideoTracks()[0].addEventListener('ended', () => {
//         errorMsg('The user has ended sharing the screen');
//         startButton.disabled = false;
//     });
// }

// function handleError(error) {
//     errorMsg(`getDisplayMedia error: ${error.name}`, error);
// }

//share scrn
scrnSharWrap.addEventListener("click", (e) => {

    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        stream.getVideoTracks
        window.stream = stream;
        videoElement.srcObject = stream;
    });
    // navigator.mediaDevices.getDisplayMedia({video: true}).then(handleSuccess, handleError);

    if (scrnIcon.innerHTML == "") {
        scrnIcon.innerHTML = '<i class="fas fa-slash"></i><i class="fas fa-slash slh"></i>';
    } else {
        scrnIcon.innerHTML = "";
    }
})

//
function getDevices() {
    //이 메서드는 사용(또는 접근)이 가능한 미디어 입력장치나 출력장치들의 리스트를 가져온다.
    //예를 들면 마이크, 카메라, 헤드셋 등의 미디어 입/출력 장치 리스트를 불러온다. 
    return navigator.mediaDevices.enumerateDevices();
}

//select의 옵션 설정하기
function gotDevices(deviceInfos) {
    audioSelect.options.length = 0;
    videoSelect.options.length = 0;
    window.deviceInfos = deviceInfos;
    for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        //label이 없으면 microphone(camera) index로 지정 
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
    console.log(audioSource, videoSource);
    const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    };
    //여러개의 MediaStreamTrack으로 구성되는 로컬 MediaStream 객체 생성.
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
socket.emit(EVENT.JOINROOM, { userName, roomName });

//디바이스가 바뀌면 select list 초기화, stream 초기화
navigator.mediaDevices.ondevicechange = streamInit;
//선택된 오디오가 바뀌면 stream 초기화
audioSelect.onchange = getStream;
//선택된 비디오가 바뀌면 stream 초기화
videoSelect.onchange = getStream;
//선택된 아웃풋 오디오가 바뀜
audioOutputSelect.onchange = changeAudioDestination;

streamInit();