class KeywordQueue {
    constructor() {
        this.store = [];
        this.cnt = 0;
        this.MAX = 3;
    }

    getIndex() {
        return this.store.map(item => item.index);
    }

    control(item) {
        //3개 넘음
        if (this.cnt == this.MAX) { this.dequeue(); this.enqueue(item); }
        else {
            const index = this.store.indexOf(item);
            if (index > -1) {//선택취소
                this.remove(index);
            } else {//선택
                this.enqueue(item);
            }
        }
    }

    enqueue(item) {
        item.classList.add('keyword-clicked');
        this.store.push(item);
        this.cnt++;
    }

    dequeue() {
        this.store.shift().classList.remove('keyword-clicked');
        this.cnt--;
    }

    remove(index) {
        this.store.splice(index, 1).classList.remove('keyword-clicked');
        this.cnt--;
    }
}

window.addEventListener("load", function () {
    const reviewContainer = document.querySelector(".review-container");
    const reviewOpen = document.querySelector(".haeder__exit button");
    const reviewClose = document.querySelector(".review-header i");
    const stars = document.querySelectorAll(".review-star i");
    const keywordBtn = document.querySelectorAll(".keyword-Btn");
    const reviewSubmit = document.querySelector('.review-submit');
    const reviewText = document.querySelector(".review-comment textarea");
    const kq = new KeywordQueue();
    let starScore;

    function reviewCloseHandler() { reviewContainer.classList.add('hidden'); }
    function reviewOpenHandler() { reviewContainer.classList.remove('hidden'); }
    function alertDone() { alert("이미 제출하셨습니다."); }

    //강연리뷰
    async function SendReviewHandler() {
        socket.emit('review', { Authorization: jwt, lecture: roomName, contents: reviewText.value, rating: starScore });
    }

    //강연자평가
    async function SendExpertHandler() {
        let kd = new Array(7).fill(0);
        kq.getIndex().forEach((i) => {
            kd[i + 1] = 1;
        })

        let keyword = "{";
        for (let i = 1; i < 7; i++) {
            eval = `"rating${i}", ${kd[i]},`;
        }
        keyword = "}";
        socket.emit('expert', { Authorization: jwt, expertId: expertId, evaluation: keyword });
    }

    function reviewSubmitHandler() {
        if (!starScore || kq.getIndex().length < 3) {
            alert("별점과 키워드3개 는 반드시 선택해야합니다.")
        }
        SendReviewHandler();
        SendExpertHandler();
        reviewCloseHandler();
        reviewOpen.removeEventListener('click', reviewOpenHandler);
        reviewOpen.addEventListener('click', alertDone);
    }


    reviewSubmit.addEventListener("click", reviewSubmitHandler);
    reviewClose.addEventListener("click", reviewCloseHandler);
    reviewOpen.addEventListener('click', reviewOpenHandler);

    for (let i = 0; i < keywordBtn.length; i++) {
        keywordBtn[i].index = i;
        keywordBtn[i].addEventListener("click", () => {
            kq.control(keywordBtn[i]);
        });
    }

    for (let i = 0; i < stars.length; i++) {
        stars[i].addEventListener("click", () => {
            for (let j = 0; j <= i; j++) {
                stars[j].classList.add('yellowStar');
            }
            for (let j = i + 1; j < stars.length; j++) {
                stars[j].classList.remove('yellowStar');
            }
            starScore = i + 1;
        });
    }
})