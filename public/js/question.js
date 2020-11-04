const makeQuestion = (sender, time, text, like, comments, questionId) => {
    const questionContents = document.querySelector('.question-contents');
    const questionBox = document.createElement('div');
    questionBox.classList.add('questionBox');
    questionBox.id = `J${questionId}`;
    questionBox.innerHTML = `
            <div class="questionHeader">
                <div class="questionWriter">
                    <span>${sender}</span>
                </div>
                <div class="questionTime">
                    <span>${time}</span>
                </div>
            </div>
            <div class="questionBody">
                <div class="questionText">
                    <span>${text}</span>
                </div>
            </div>
            <div class="questionFooter">
                <div class="questionLike">
                    <i class="fas fa-heart"></i>
                    <span>${like}</span>
                </div>
                <div class="questionComments">
                    <i class="fas fa-comment"></i>
                    <span>${comments}</span>
                </div>
            </div>
            <div class="openComments hidden">

                <div class="closeBtn">
                    <span>닫기</span>
                </div>
                
                <div class="inputComments">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" fill="none" viewBox="0 0 15 12">
                        <path fill="#000" d="M9.035 3.559l1.325-1.325L15 6.873l-4.64 4.64-1.325-1.327 2.341-2.341H3.75c-.994 0-1.948-.395-2.65-1.098C.394 6.044 0 5.09 0 4.096V0h1.875v4.096c0 .497.197.974.549 1.325.351.352.828.55 1.325.55h7.697l-2.41-2.412z" opacity=".8"/>
                    </svg>
                    <div class="inputCommentsBtn">
                        <input>
                        <i class="far fa-paper-plane"></i>
                    </div>
                </div>
            </div>
        `;
    questionContents.appendChild(questionBox);
    // questionContents.scrollTop = questionContents.scrollHeight;
}

const questionCommentSubmitHandler = (commentsInput, questionId) => {
    if (commentsInput.value) {
        console.log('enter');
        const text = commentsInput.value;
        socket.emit('questionComment', { userName, roomName, text, questionId });
        commentsInput.value = '';
    }
};

socket.on('questionComment', (data) => {
    const commentsCnt = document.querySelector(`#J${data.questionId} .questionComments span`);
    commentsCnt.textContent = data.questionCnt;
    const openComments = document.querySelector(`#J${data.questionId} .openComments`);
    const inputComments = document.querySelector(`#J${data.questionId} .inputComments`);
    const Comments = document.createElement('div');
    Comments.classList.add('Comments');
    Comments.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" fill="none" viewBox="0 0 15 12">
            <path fill="#000" d="M9.035 3.559l1.325-1.325L15 6.873l-4.64 4.64-1.325-1.327 2.341-2.341H3.75c-.994 0-1.948-.395-2.65-1.098C.394 6.044 0 5.09 0 4.096V0h1.875v4.096c0 .497.197.974.549 1.325.351.352.828.55 1.325.55h7.697l-2.41-2.412z" opacity=".8"/>
        </svg>
        <span class="commentsWriter">${data.userName}</span>
        <span>${data.time.substring(11, 16)}</span>
        <span class="commentsText">${data.text}</span>`;
    openComments.insertBefore(Comments, inputComments);
})

socket.on('like', (data) => {
    const likeBtnSpan = document.querySelector(`#J${data.questionId} .questionLike span`);
    console.log(data.like);
    likeBtnSpan.textContent = data.like;
})

socket.on('question', (data) => {
    makeQuestion(data.userName, data.time.substring(11, 16), data.text, data.like, data.comments, data.questionId);

    const commentsBtn = document.querySelector(`#J${data.questionId} .questionComments`);
    const commentsCls = document.querySelector(`#J${data.questionId} .openComments .closeBtn span`);
    const openComments = document.querySelector(`#J${data.questionId} .openComments`);
    const likeBtn = document.querySelector(`#J${data.questionId} .questionLike`);
    const commentsInput = document.querySelector(`#J${data.questionId} .inputCommentsBtn input`);
    const commentsInputBtn = document.querySelector(`#J${data.questionId} .inputCommentsBtn i`);

    commentsInputBtn.addEventListener('click', questionCommentSubmitHandler(commentsInput, data.questionId));
    commentsInput.addEventListener('keypress', (e) => { if (e.which == 13) { questionCommentSubmitHandler(commentsInput, data.questionId) } });

    likeBtn.addEventListener('click', () => {
        if (likeBtn.classList.contains('questionBG')) {
            likeBtn.classList.remove('questionBG');
            socket.emit('likeDown', { roomName, questionId: data.questionId });

        } else {
            likeBtn.classList.add('questionBG');
            socket.emit('likeUp', { roomName, questionId: data.questionId });
        }
    });

    commentsBtn.addEventListener('click', (e) => {
        openComments.classList.toggle('hidden');
        commentsBtn.classList.toggle('questionBG');
    })

    commentsCls.addEventListener('click', (e) => {
        openComments.classList.add('hidden');
        commentsBtn.classList.remove('questionBG');
    })
})

const questionInput = document.querySelector(".question-form__input");
const questionButton = document.querySelector(".question-form__button");

//questionSubmitHandler
const questionSubmitHandler = () => {
    if (questionInput.value) {
        const text = questionInput.value;
        socket.emit('question', { userName, roomName, text });
        questionInput.value = '';
    }
};

questionInput.addEventListener('keypress', (e) => { if (e.which == 13) { questionSubmitHandler(); } });
questionButton.addEventListener('click', questionSubmitHandler);