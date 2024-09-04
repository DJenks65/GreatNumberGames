(function(){
    console.log("JS IS ALIVE!");
    
    let setNum;
    let userGuesses;
    let correct;
    function systemStart() {
        setNum = Math.floor(Math.random() * 100) + 1;
        correct = false;
        hideAllMessages();
        userGuesses = 0;
    }
    
    systemStart();
    
    function hideAllMessages() {
        document.getElementById('low').classList.add('hidden');
        document.getElementById('high').classList.add('hidden');
        document.getElementById('correct').classList.add('hidden');
        document.getElementById('lose').classList.add('hidden');
    }
    
    function submitGuess(form) {
        let userGuess = parseInt(form.elements.number.value); // Accessing the value entered by the user
        form.elements.number.value = '';
        userGuesses += 1;
        if (userGuesses == 5) {
            if (userGuess == setNum) {
                correct = true;
                showCorrect();
            } else {
                showLose();
            }
        } else if (userGuesses > 5 || correct == true) {
            systemStart();
        } else {
            if (userGuess == setNum) {
                showCorrect();
            } else if (userGuess < setNum) {
                showLow();
            } else {
                showHigh();
            }
        }
    }
    
    function showLow() {
        hideAllMessages()
        let lowDisp = document.getElementById('low');
        lowDisp.classList.remove('hidden');
    }
    function showHigh() {
        hideAllMessages()
        let highDisp = document.getElementById('high');
        highDisp.classList.remove('hidden');
    }
    
    function showCorrect() {
        hideAllMessages()
        let correctDisp = document.getElementById('correct');
        let spanCorrect = document.getElementById('correct-setNum');
        spanCorrect.innerText = `${setNum}`;
        let spanUserGuesses = document.getElementById('user-guesses');
        spanUserGuesses.innerText = `${userGuesses}`;
        correctDisp.classList.remove('hidden');
        correct = true;
    }
    
    function showLose() {
        hideAllMessages()
        let loseDisp = document.getElementById('lose');
        let spanLose = document.getElementById('lose-setNum');
        spanLose.innerText = `${setNum}`;
        loseDisp.classList.remove('hidden');
    }
    window.submitGuess = submitGuess;
    window.systemStart = systemStart;
}) ();