import StringCalc from './stringCalc.js';

const refs = {
    input: document.querySelector('.my-input'),
    buttonCalc: document.querySelector('.my-button-calc'),
    buttonClear: document.querySelector('.my-button-clear'),
    result: document.querySelector('.my-result'),
}

function clickHandlerCalc() {
    const inputString = refs.input.value;
    refs.result.innerText = StringCalc.evaluate(inputString);
}

function clickHandlerClear() {
    refs.result.innerText = '';
    refs.input.value = '';

}

refs.buttonCalc.addEventListener('click', clickHandlerCalc);
refs.buttonClear.addEventListener('click', clickHandlerClear);