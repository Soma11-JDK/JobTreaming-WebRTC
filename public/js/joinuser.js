// const joinusersContents = document.querySelector('.joinusers-contents');
// const ParticipantCnt = document.querySelector('#ParticipantCnt');

// socket.on('joinusers', (joinusers) => {
//     joinusersContents.innerHTML = "";
//     for (user in joinusers) {
//         let username = joinusers[user].userName;
//         const div = document.createElement('div');
//         div.innerHTML = username;
//         div.classList.add('user', `${username}`);
//         joinusersContents.appendChild(div);
//     }
//     ParticipantCnt.innerHTML = Object.keys(joinusers).length;
// })

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