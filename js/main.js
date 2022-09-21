
// Объекты с сохраненными ответами
let answers = {
    2: null,
    3: null,
    4: null,
    5: null
};


// Движение вперед
let btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button) {
    button.addEventListener('click', function() {

        let thisCard = this.closest('[data-card]');
        let thisCardNumber = parseInt(thisCard.dataset.card);

        if (thisCard.dataset.validate == 'novalidate') {
            navigate('next', thisCard);
            updateProgressBar('next', thisCardNumber);
        } else {
            saveAnswers(thisCardNumber, gatherCardData(thisCardNumber));

            if( isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate('next', thisCard);
                updateProgressBar('next', thisCardNumber);
            } else  {
                alert('Выберите ответ, преэже чем переходить далее');
            } 
        }
    });
});

// Движение назад

let btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button) {
    button.addEventListener('click', function() {

        let thisCard = this.closest('[data-card]');
        let thisCardNumber = parseInt(thisCard.dataset.card);
        navigate('prev', thisCard);
        updateProgressBar('prev', thisCardNumber);

    });
});

function navigate (direction, thisCard) {
    
    let thisCardNumber = parseInt(thisCard.dataset.card);
    let positionCard;
    if (direction == 'next') {
        positionCard = thisCardNumber + 1;
    } else if (direction == 'prev') {
        positionCard = thisCardNumber - 1;
    }

    thisCard.classList.add('hidden');
    document.querySelector(`[data-card="${positionCard}"]`).classList.remove('hidden');
}

// Функция сбора заполненных данных с карточки
function gatherCardData (number) {


    let question;
    let result = [];

    let currentCard = document.querySelector(`[data-card="${number}"]`);

    question = currentCard.querySelector('[data-question]').innerText;
    
    let radioValues = currentCard.querySelectorAll('[type="radio"]');

    radioValues.forEach(function (item) {

  
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    let checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    let inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');

    inputValues.forEach(function(item) {
        if ( item.value.trim() != '' ) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

   let data = {

        question: question,
        answer: result
   };

   return data;
}

// Ф-я записи ответа в объект с ответами
function saveAnswers (number, data) {
    answers[number] = data; 
}

// Функция на заполненность

function isFilled (number) {
    if( answers[number].answer.length > 0 ) {
        return true;
    } else {
        return false;
    }
}


function validEmail (email) {
    let pattern = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Проверка на заполненность email
function checkOnRequired (number) {
    let currentCard = document.querySelector(`[data-card="${number}"]`);
    let requiredFields = currentCard.querySelectorAll('[required]');

    let isValidArray = [];

    requiredFields.forEach(function(item) {
        
        if ( item.type == 'checkbox' && item.checked == false) {

            isValidArray.push(false);

        } else if (item.type == "email") {

            if (validEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }

        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    }
}

// Подсвечиваем рамки у радиокнопок 
document.querySelectorAll('.radio-group').forEach(function(item) {

    item.addEventListener('click', function(e) {
    
        let label = e.target.closest('label');

        if (label) {
            label.closest('.radio-group').querySelectorAll('label').forEach(function(item) {
                item.classList.remove('radio-block--active');
            });
            label.classList.add('radio-block--active');
        }
    });

});

document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function() {

        if(item.checked) {
            item.closest('label').classList.add('checkbox-block--active');
        } else {
            item.closest('label').classList.remove('checkbox-block--active');
        }
    } );
});

function updateProgressBar (direction, cardNumber) {
    let totalCardsNumber = document.querySelectorAll('[data-card]').length;
    
    if(direction == 'next') {
        cardNumber = cardNumber + 1;
    } else if (direction == 'prev') {
        cardNumber = cardNumber - 1;
    }
    
    let progress = ((cardNumber * 100) / totalCardsNumber).toFixed();
    console.log(progress);
    let progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress');

    if (progressBar) {
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;
        progressBar.querySelector('.progress__line-bar').style = `width: ${progress}%`;
    }
}

