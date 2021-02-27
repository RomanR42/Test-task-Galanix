const wrapperImgs = document.getElementsByClassName ('wrapper__img');
const outputAmount = document.querySelector ('#outputAmount');
const outputDate = document.querySelector ('#outputDate');
const imgs = document.getElementsByTagName ('img');
const modalWrapper = document.querySelector ('.modal__wrapper');
const closeModal = document.querySelector ('.close-modal');
const removeImg = document.getElementsByClassName ('remove-img');
const btnRestore = document.querySelector ('button');

if (localStorage.getItem('data')) {
    const dataFromLS = JSON.parse(localStorage.getItem('data'));
    for (let i=0; i<wrapperImgs.length; i++){
        wrapperImgs[i].style.display = dataFromLS[i];
    }
}

countSaveImg ();
function countSaveImg () {
    let imgCounter = 0;
    let arrayForSave = [];
    for (let i=0; i< wrapperImgs.length; i++) {
        if (getComputedStyle(wrapperImgs[i]).display == 'block') {
            arrayForSave.push('block');
            imgCounter++;
        } else {
            arrayForSave.push('none');
        }
    }
    outputAmount.innerHTML = imgCounter;
    localStorage.setItem('data', JSON.stringify(arrayForSave));
}

setInterval(getDate, 1000); 
function getDate () {
        const currentTime = new Date();
   
        let date = currentTime.getDate();
		if (date < 10) date = '0' + date;
	
		let month = currentTime.getMonth() + 1;
		if (month < 10) month = '0' + month;
	
		const year = currentTime.getFullYear();

        let hours = currentTime.getHours();
        if (hours < 10) hours = '0' + hours;

        let minutes = currentTime.getMinutes();
        if (minutes < 10) minutes = '0' + minutes; 

        let seconds = currentTime.getSeconds();
        if (seconds < 10) seconds = '0' + seconds; 
        		
        outputDate.innerHTML = ' ' + date +'.' + month + '.' + year + ' ' +
        hours + ':' +  minutes + ':' + seconds;
}

for (let i=0; i<imgs.length-1;i++) {
   imgs[i].onclick = modalShow;
}

function  modalShow (e) {
    let src = e.target.getAttribute('src');
    imgs[imgs.length - 1].setAttribute('src', src);
    modalWrapper.style.display = 'flex';
}

closeModal.onclick = function () {
    modalWrapper.style.display = 'none';
}

for (let i=0; i<removeImg.length; i++) {
    removeImg[i].onclick = deleteImg;
}

function deleteImg (e) {
    e.target.parentElement.style.display = 'none';
    countSaveImg ();
}

btnRestore.onclick = function () {
    for (let i=0; i<wrapperImgs.length; i++){
        wrapperImgs[i].style.display = 'block';
    }
    countSaveImg ();
}



