const balloon = document.querySelector('.balloon_01');
const ParticipantCnt = document.querySelector('#ParticipantCnt');

socket.on('joinusers', (joinusers) => {
    balloon.innerHTML = "";
    for (user in joinusers) {
        let username = joinusers[user].userName;
        const span = document.createElement('span');
        span.textContent = username;
        balloon.appendChild(span);
    }
    ParticipantCnt.innerHTML = Object.keys(joinusers).length;
})