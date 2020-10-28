window.addEventListener("load", function () {

    const closeBtn = document.querySelectorAll(".close-btn")
    const sidebarContents = document.querySelector(".sidebar-contents")
    const openChatting = document.querySelector(".open-chatting")
    const chattingContainer = document.querySelector(".chatting-container")
    const openQuestion = document.querySelector(".open-question")
    const questionContainer = document.querySelector(".question-container")
    const openJoinusers = document.querySelector(".open-joinusers")
    const joinusersContainer = document.querySelector(".joinusers-container")

    let ctn = 0;
    let open = true;

    for (let i = 0; i < closeBtn.length; i++) {
        closeBtn[i].addEventListener("click", (e) => {
            e.preventDefault()
            sidebarContents.classList.add("hidden")
            open = false;
            //버튼
            openChatting.classList.remove("li-active")
            openQuestion.classList.remove("li-active")
            openJoinusers.classList.remove("li-active")
        })
    }

    openChatting.addEventListener("click", (e) => {
        e.preventDefault()
        if (!open) {
            sidebarContents.classList.remove("hidden")
            open = true;
            chattingContainer.classList.remove("hidden")
            questionContainer.classList.add("hidden")
            joinusersContainer.classList.add("hidden")
            //버튼
            openChatting.classList.add("li-active")
            openQuestion.classList.remove("li-active")
            openJoinusers.classList.remove("li-active")
            ctn = 0;
        } else {//열려있고 
            if (ctn == 0) {//또클릭
                sidebarContents.classList.add("hidden")
                open = false;
                openChatting.classList.remove("li-active")
                openQuestion.classList.remove("li-active")
                openJoinusers.classList.remove("li-active")
            } else {
                chattingContainer.classList.remove("hidden")
                questionContainer.classList.add("hidden")
                joinusersContainer.classList.add("hidden")
                ctn = 0;
                openChatting.classList.add("li-active")
                openQuestion.classList.remove("li-active")
                openJoinusers.classList.remove("li-active")
            }
        }
    })

    openQuestion.addEventListener("click", (e) => {
        e.preventDefault()

        if (!open) {
            sidebarContents.classList.remove("hidden")
            open = true;
            chattingContainer.classList.add("hidden")
            questionContainer.classList.remove("hidden")
            joinusersContainer.classList.add("hidden")
            ctn = 1;
            openChatting.classList.remove("li-active")
            openQuestion.classList.add("li-active")
            openJoinusers.classList.remove("li-active")
        } else {
            if (ctn == 1) {
                sidebarContents.classList.add("hidden")
                open = false;
                openChatting.classList.remove("li-active")
                openQuestion.classList.remove("li-active")
                openJoinusers.classList.remove("li-active")
            } else {
                chattingContainer.classList.add("hidden")
                questionContainer.classList.remove("hidden")
                joinusersContainer.classList.add("hidden")
                ctn = 1;
                openChatting.classList.remove("li-active")
                openQuestion.classList.add("li-active")
                openJoinusers.classList.remove("li-active")
            }
        }
    })

    openJoinusers.addEventListener("click", (e) => {
        e.preventDefault()

        if (!open) {
            sidebarContents.classList.remove("hidden")
            open = true;
            chattingContainer.classList.add("hidden")
            questionContainer.classList.add("hidden")
            joinusersContainer.classList.remove("hidden")
            ctn = 2;
            openChatting.classList.remove("li-active")
            openQuestion.classList.remove("li-active")
            openJoinusers.classList.add("li-active")
        } else {
            if (ctn == 2) {
                sidebarContents.classList.add("hidden")
                open = false;
                openChatting.classList.remove("li-active")
                openQuestion.classList.remove("li-active")
                openJoinusers.classList.remove("li-active")
            } else {
                chattingContainer.classList.add("hidden")
                questionContainer.classList.add("hidden")
                joinusersContainer.classList.remove("hidden")
                ctn = 2;
                openChatting.classList.remove("li-active")
                openQuestion.classList.remove("li-active")
                openJoinusers.classList.add("li-active")
            }
        }
    })

})