socket.on('join-success', () => {
    console.log('join-suceess');
})

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

socket.on(EVENT.DISCONNECTPEER, (data) => {
    const id = data.id;
    if (peerConnections[id] !== undefined) {
        console.log('delete');
        peerConnections[id].close();
        delete peerConnections[id];
    }
});