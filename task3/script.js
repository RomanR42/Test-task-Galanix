const searchField = document.getElementById ('search');
const btnSend = document.getElementById ('send');
const btnReset = document.getElementById ('reset');
const resetSavedList = document.getElementById ('resetSavedList');
const checkCounter = document.getElementById ('checkCounter');
const loadbtn = document.getElementById ('load');
let table = document.getElementsByTagName('table')[0];
let globalData;
let arrayToSave = [];
let counter=0;
checkCounter.innerHTML = counter;
// загрузка данных из LS если они там есть
if (localStorage.getItem('dataLs')) {

    const dataFromLS = JSON.parse(localStorage.getItem('dataLs'));
    
    if (dataFromLS.length !=0) {
        counter = dataFromLS.length;
        checkCounter.innerHTML = counter;
        arrayToSave = dataFromLS;
        outputData (dataFromLS, true);
    }

    counter = dataFromLS.length;
}

btnSend.onclick = function () {
    // легкая валидация
    if ((searchField.value).length == 0) {
        alert ('Введите пожалуйста назание страны');
        return;
    };
    const pattern = /[A-Za-z]/;
    if (!pattern.test(searchField.value)) {
        alert ('Допускаются только буквы латинского алфавита')
        return;
    }
    getData (searchField.value)
}

// получаем данные классическим способом (без Fetch)
function getData (country) {
   
    const url = 'http://universities.hipolabs.com/search?name=middle&country=' + country;
    
    const xhr = new XMLHttpRequest();
   
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.status >= 400) {
            console.error (xhr.response);
        } else {
            outputData (xhr.response);
        }
    }
       
    xhr.onerror = () => {console.log(xhr.response)}

    xhr.send();
}

// выводим данные в шаблон
function outputData (data, isChecked=false){
    globalData = data;
    if (data.length == 0) {alert('Страна: ' + searchField.value +  ' не найдена'); return};
    console.log(data);
    reset (false);
    for (let i=0; i<data.length; i++) {
           let newtr = document.createElement ('tr');
           firstTd = document.createElement ('td');
           firstTd.innerHTML = i+1;
           newtr.appendChild (firstTd);

           for (let key in data[i]) {
                   newtd = document.createElement ('td');
                   let dataValue = data[i][key];
                   
                    if (key == 'web_pages') {
                        let tempPage='';
                        dataValue.forEach(page => {
                            tempPage = tempPage + '<a href="' + page + '" target="_blank">' + page + '</a>';
                        });
                        dataValue = tempPage;
                    }

                   newtd.innerHTML = dataValue;
                   newtr.appendChild (newtd);
                   }
        // создаем checkbox
        let lastTd = document.createElement ('td');
        let checkBox = document.createElement ('input');
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("name", i);
        if (isChecked) {checkBox.setAttribute("checked", "true")};        
        checkBox.onclick = checkboxHandler;
        lastTd.appendChild (checkBox);
        newtr.appendChild (lastTd);

        table.appendChild(newtr);
     }
}

function reset (conterReset=true) {
    searchField.value = '';
    let trs = document.getElementsByTagName ('tr');
    let trsLength = trs.length;
    for (let i=1; i<trsLength; i++) {
       trs[1].remove();
    }
    if (conterReset) {
    counter = 0;
    checkCounter.innerHTML = counter;
    }
}
btnReset.onclick = reset;

function checkboxHandler(e) {

    const checkBoxStatus = e.target.checked;
    const checkBoxName = e.target.name;
    const dataToSave = globalData[checkBoxName];
    
    if (checkBoxStatus) {
        arrayToSave.push (dataToSave);
        localStorage.setItem('dataLs', JSON.stringify(arrayToSave));
        counter++;
        checkCounter.innerHTML = counter;
    }

    if (!checkBoxStatus) {
        const univerName = dataToSave.name;
        arrayToSave = arrayToSave.filter (item => item.name !=univerName);
        localStorage.setItem('dataLs', JSON.stringify(arrayToSave));
        counter--;
        checkCounter.innerHTML = counter;
    }


}

resetSavedList.onclick = function () {
    localStorage.clear();
    reset ();
}

loadbtn.onclick = function () {
    location.reload();
}

