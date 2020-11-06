const imageBtn = document.querySelector("#Files-Btn-image");
const fileBtn = document.querySelector("#Files-Btn-file");


imageBtn.addEventListener('click', () => {
    imageContents.classList.remove('hidden');
    fileContents.classList.add('hidden');
    imageBtn.classList.add('pushed');
    fileBtn.classList.remove('pushed');
})

fileBtn.addEventListener('click', () => {
    imageContents.classList.add('hidden');
    fileContents.classList.remove('hidden');
    fileBtn.classList.add('pushed');
    imageBtn.classList.remove('pushed');
})

