const numberOfQuestions = document.getElementById('num')
const difficultyLevel = document.getElementById('difficulty')
const questionsContainer = document.getElementById('questionsContainer')
const score = document.getElementById('score')
const btn = document.getElementById('btn')
const getScoreBtn = document.getElementById('scoreBtn')
const baseUrl = `https://opentdb.com/api.php?type=multiple`

btn.addEventListener('click',fetchQuestions)
async function fetchQuestions(){
    if(!Number(numberOfQuestions.value)){
        alert('Please enter a number to continue!')
        return;
    }
    const response = await fetch(`${baseUrl}&amount=${Number(numberOfQuestions.value)}&difficulty=${difficultyLevel.value}`)
    const data = await response.json()
    getQuestions(data)
}

function getQuestions(data){
    const resultsArray = data.results
    let multipleChoiceOptions = []
    resultsArray.map(info => {
    multipleChoiceOptions.push([info.correct_answer, ...info.incorrect_answers])
    
})
// console.log(multipleChoiceOptions)


let shuffledAnswers = multipleChoiceOptions
        .map(subarray => subarray.map(value =>({ value, sort: Math.random() }) )
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => (value)))

// console.log(shuffledAnswers)

let questions = resultsArray.map(info => info.question)

//alternate pushing question and options into a new array called output.
var array1 = questions,
    array2 = shuffledAnswers,
    output = [],
    i, l = Math.min(array1.length, array2.length);

    for (i = 0; i < l; i++) {
        output.push([array1[i], array2[i]]);
    }
    output.push(...array1.slice(l), ...array2.slice(l));
    
    renderHTML(output,resultsArray)
}

function renderHTML(output,resultsArray){
    // console.log(output)
    for(let i = 0; i < output.length; i++){
        questionsContainer.innerHTML += `
        <h4> ${output[i][0]} </h4>
        <label class = 'label'> <input type = 'radio' value = ' ${output[i][1][0]}' name = '${output[i][0]}'>${output[i][1][0]} </label><br>
        <label class = 'label'> <input type = 'radio' value = ' ${output[i][1][1]}' name = '${output[i][0]}'>${output[i][1][1]} </label><br>
        <label class = 'label'> <input type = 'radio' value = ' ${output[i][1][2]}' name = '${output[i][0]}'>${output[i][1][2]} </label><br>
        <label class = 'label'> <input type = 'radio' value = ' ${output[i][1][3]}' name = '${output[i][0]}'>${output[i][1][3]} </label><br>
        ` 
    }
}
getScoreBtn.addEventListener('click', function(){
    console.log('hi')
    checkAnswers(questionsContainer, resultsArray,output)
})

function checkAnswers(questionsContainer, resultsArray,output){
    let answers = questionsContainer.querySelectorAll('.label')
    answers.forEach(answer => console.log(answer.innerText))
    
    let userAnswer = ''
    let correctAnswers = 0
    
    for(let i = 0; i < resultsArray.length; i++){
        console.log(resultsArray[i].correct_answer)
        userAnswer = (answers[i].querySelector(`input[name='${output[i][0]}']:checked`)||{}).value
        if(userAnswer === resultsArray[i].correct_answer){
            correctAnswers++
            answers[i].style.color = 'lightgreen';
        }
        else{
            answers[i].style.color = 'red'
        }
    }

    score.innerHTML =  `${correctAnswers} out of ${resultsArray.length}`
}

