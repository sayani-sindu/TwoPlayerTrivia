const API_KEY = 'ApiKeyAuth';
const category = sessionStorage.getItem('category');
const player1 = sessionStorage.getItem('player1');
const player2 = sessionStorage.getItem('player2');

const score1 = sessionStorage.getItem('score1');
const score2 = sessionStorage.getItem('score2');

let currentPlayer = 1; 
let currentQuestionIndex = 0; 
let allQuestions = []; 

let Player1Score = Number(score1) + 0;
let Player2Score = Number(score2) + 0;

const fetchQuestionsByDifficulty = async (difficulty) => {
    try {
        const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&difficulties=${difficulty}&limit=10`, {
            headers: {
                'Accept': 'application/json',
                'X-API-Key': API_KEY  
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.filter(question => question.difficulty === difficulty);
    } catch (err) {
        console.error(`Error fetching ${difficulty} questions: ${err}`);
        return [];
    }
}

const ensureTwoQuestions = async (difficulty) => {
    let questions = [];
    while (questions.length < 2) {
        const newQuestions = await fetchQuestionsByDifficulty(difficulty);
        questions = [...questions, ...newQuestions];
    }
    return questions.slice(0, 2); 
}

const loadingIndicator = document.createElement('p');
loadingIndicator.textContent = "Loading....";
loadingIndicator.classList.add('loading');
document.getElementById('question').appendChild(loadingIndicator);

const fetchAllQuestions = async () => {
    try {
        const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
            fetchQuestionsByDifficulty('easy'),
            fetchQuestionsByDifficulty('medium'),
            fetchQuestionsByDifficulty('hard')
        ]);

        allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        console.log(allQuestions);

        loadingIndicator.remove();
        displayQuestion();
    } catch (error) {
        console.error("Error fetching all questions: ", error);
    }
}

const displayQuestion = () => {
    const questionTab = document.getElementById('question');
    const answerTab = document.getElementById('answer');
    
    questionTab.innerHTML = '';
    answerTab.innerHTML = '';

    const question = allQuestions[currentQuestionIndex];

    const playerName = currentPlayer === 1 ? player1 : player2;

    const playerDisplay = document.createElement('p');
    playerDisplay.classList.add('player-name');
    playerDisplay.innerText = `Player: ${playerName.charAt(0).toUpperCase() + playerName.slice(1)}`;
    questionTab.appendChild(playerDisplay);

    const questionDisplay = document.createElement('p');
    questionDisplay.classList.add('question');
    questionDisplay.innerText = question.question;
    questionTab.appendChild(questionDisplay);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    const answers = [question.correctAnswer, ...question.incorrectAnswers];
    const shuffledAnswers = shuffleAnswers(answers.map(answer => String(answer)));

    shuffledAnswers.forEach((answer, index) => createOptions(answer, index, optionsContainer));

    answerTab.appendChild(optionsContainer);

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Check Answer';
    submitButton.classList.add('submit-option');
    submitButton.onclick = handleAnswerSubmission;
    answerTab.appendChild(submitButton);
};

const createOptions = (answer, index, optionsContainer) => {
    const label = document.createElement('label');
    label.innerText = answer.charAt(0).toUpperCase() + answer.slice(1);
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'answer'; 
    radio.value = answer;
    radio.classList.add('option'); 

    optionsContainer.appendChild(radio);
    optionsContainer.appendChild(label);
    optionsContainer.appendChild(document.createElement('br')); 
}

const handleAnswerSubmission = () => {
    const showAnswer = document.getElementById('showAnswer');
    const selectedRadio = document.querySelector('input[name="answer"]:checked');

    if (!selectedRadio) {
        alert('Please select an answer before submitting!');
        return;
    }

    const selectedAnswer = selectedRadio.value;
    const currentQuestion = allQuestions[currentQuestionIndex];
    showAnswer.innerHTML = '';

    const answerDisplay = document.createElement('p');
    answerDisplay.classList.add('answer-display');


    if (selectedAnswer === currentQuestion.correctAnswer) {
        answerDisplay.innerText = "Correct Answer, Congratulations!";
    } else {
        answerDisplay.innerText = `Wrong Answer, the correct answer was ${currentQuestion.correctAnswer}`;
    }
    showAnswer.style.display = 'block';
    showAnswer.appendChild(answerDisplay);

    console.log('Answer Display: ', answerDisplay.innerText);

    const scoreIncrement = currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 15 : 20;

    if (currentPlayer === 1 && selectedAnswer === currentQuestion.correctAnswer) {
        Player1Score += scoreIncrement;
    } else if (currentPlayer === 2 && selectedAnswer === currentQuestion.correctAnswer) {
        Player2Score += scoreIncrement;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentQuestionIndex++;
    let winner = null;

    if (currentQuestionIndex < allQuestions.length) {
        displayQuestion(); 
    } else {
        if (Player1Score > Player2Score) {
            winner = player1;
        } else if (Player2Score > Player1Score) {
            winner = player2;
        } else {
            winner = 'Tie';
        }
        alert(`${player1} Score: ${Player1Score}\n${player2} Score: ${Player2Score}\nWinner: ${winner}`);
        displayEndGameOptions(Player1Score, Player2Score);
    }
};


const displayEndGameOptions = (score1, score2) => {
    const questionsTab = document.getElementById('questions');
    questionsTab.innerHTML = '';
    const endOptions = document.createElement('div');
    endOptions.classList.add('end-options');

    const continueGame = document.createElement('button');
    continueGame.classList.add('continue-game');
    continueGame.textContent = 'Continue Game';
    continueGame.onclick = () => selectOtherCategory(score1, score2); 

    endOptions.appendChild(continueGame);

    const endgame = document.createElement('button');
    endgame.classList.add('end-game');
    endgame.textContent = 'End Game';
    endgame.onclick = endGame;
    endOptions.appendChild(endgame);

    questionsTab.appendChild(endOptions); 
}

const selectOtherCategory = (score1, score2) => {
    sessionStorage.setItem('restartGame', 'true');
    sessionStorage.setItem('score1', score1); 
    sessionStorage.setItem('score2', score2);
    window.location.href = 'selection.html';
}

const endGame = () => {
    alert("Thank You for the Game");
    window.location.href = 'index.html';
}

const shuffleAnswers = (answers) => {
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
};

window.onload = fetchAllQuestions;
