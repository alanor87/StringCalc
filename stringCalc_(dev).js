
export default class StringCalc {

    static #inputString = '';                          //input string initial value.
    static #rxParenthPattern = /\(\w+\)/i;             //pattern of parentheses expression.
    static #rxMultPattern = /\w+\*\w+/i;               //pattern of multiplication expression.
    static #rxSummPattern = /[a-z0]+\+[a-z0]+/i;       //pattern of addition expression.
    static #rxResultPattern = /^[a-z0]+$/i;            //pattern of desirable result final expression.


    //Regex for input validation, non valid input strings templates.
    static #rxValAlienChars = /[^\w\*\+\(\)]|_/;
    static #rxValStartEnd = /^[\*|\+].*$|^.*[\*|\+]$/;
    static #rxValOpRepeats = /\+\+|\*\*/;
    static #rxValParentheses = /\(\)|\(\(|\)\)|\w\(/i;
    static #rxValOpParenthCollision = /\([+*]|[+*]\)/;
    static #rxValOperandTypesCollision = /[a-z]\d|\d[a-z]/i;
    static #rxValIncorrectOps = /[a-z]\*[a-z]/i;

    static #parenthesisCountVal(str) {
        const openParenth = str.match(/\(/g);
        const closeParenth = str.match(/\)/g);
        return !(openParenth?.length === closeParenth?.length);
    }

    //check for match with any incorrenct inout patterns.
    static #inputValidation(str) {
        const invlaidInputsArray = [
            this.#rxValAlienChars.test(str),
            this.#rxValStartEnd.test(str),
            this.#rxValOpRepeats.test(str),
            this.#rxValParentheses.test(str),
            this.#rxValOpParenthCollision.test(str),
            this.#rxValOperandTypesCollision.test(str),
            this.#rxValIncorrectOps.test(str),
            this.#parenthesisCountVal(str)
        ]
        return invlaidInputsArray.some(value => value === true);
    }

    // ----------------  single  op results calculation. ---------------- //

    static #multResult(multExpr) {
        const splitExpr = multExpr.split('*');

        //cheking type of operands
        const opOneIsNumber = !Number.isNaN(Number(splitExpr[0]));
        const opTwoIsNumber = !Number.isNaN(Number(splitExpr[1]));

        //case of number - number multiplication.
        if (opOneIsNumber & opTwoIsNumber) {
            const mult = Number(splitExpr[0]) * Number(splitExpr[1]);
            return String(mult);
        };

        //error in case if letters - letters multiplication op is encountered during parse.
        if (!opOneIsNumber & !opTwoIsNumber) throw new Error('Invalid operation!');

        let string = '';
        let multiplier = '';

        //defining, which of two operands is multiplier.
        switch (opOneIsNumber) {
            case true:
                multiplier = Number(splitExpr[0]);
                string = splitExpr[1];
                break;
            case false:
                multiplier = Number(splitExpr[1]);
                string = splitExpr[0];
                break;
        }

        // debug.
        console.log('String :' + string);
        console.log('Multiplier :' + multiplier);

        //in case of multiplication string by 0 return zero character.
        if (!multiplier) return '0';

        let newString = '';

        //multiplication cycle.
        for (let i = 1; i <= multiplier; i += 1) {
            newString += string;
        }
        return newString;
    }

    static #addResult(str) {

        //debug
        console.log('String with 0 :' + str);
        console.log('Turns into :' + str.match(/[a-z]+/));

        //if one of operands is 0 - return only unchanged second operand.
        if (str.includes('0')) return str.match(/[a-z]+/);

        //return concatenated string operands.
        return str.split('+').join('');
    }

    static #parenthResult(str) {
        return str.match(/\w+/i)
    }

    // ----------------- total string evaluation for ops and their resolving. ------------------ //

    static #multResolve(str) {
        let newString = str;

        //debug
        console.log('Incoming to #multResolve() ' + newString);
        console.log('PAttern ' + newString.match(this.#rxMultPattern)[0]);

        //while current operation patterns are present - replace each of them to their evaluated value.
        while (this.#rxMultPattern.test(newString)) {
            newString = newString
                .replace(this.#rxMultPattern, this.#multResult(newString.match(this.#rxMultPattern)[0]));
        }

        //debug
        console.log('Result - ' + newString)
        return newString;
    }

    static #addResolve(str) {
        let newString = str;

        //debug
        console.log('Incoming to #addResolve() ' + newString);
        console.log('PAttern ' + newString.match(this.#rxSummPattern)[0]);

        //while current operation patterns are present - replace each of them to their evaluated value.
        while (this.#rxSummPattern.test(newString)) {
            newString = newString
                .replace(this.#rxSummPattern, this.#addResult(newString.match(this.#rxSummPattern)[0]));
        }

        //debug
        console.log('Result - ' + newString)
        return newString;
    }

    static #parenthResolve(str) {
        let newString = str;

        //debug
        console.log('Incoming to #parenthResolve() ' + newString);
        console.log('PAttern ' + newString.match(this.#rxParenthPattern)[0]);

        //while current operation patterns are present - replace each of them to their evaluated value.
        while (this.#rxParenthPattern.test(newString)) {
            newString = newString
                .replace(this.#rxParenthPattern, this.#parenthResult(newString.match(this.#rxParenthPattern)[0]));
        }

        //debug
        console.log('Result - ' + newString)
        return newString;
    }

    static evaluate(expr) {
        try {

            //error thrown on empty input string.
            if (!expr) {
                throw 'Invalid input!';
            }

            //getting rid of possible spaces.
            this.#inputString = expr.split(' ').join('');

            //error thrown on invalid input
            if (this.#inputValidation(this.#inputString)) {
                throw new Error('Invalid input!');
            }

            //start processing input. While we dont have plain letters - keep processing.
            while (!this.#rxResultPattern.test(this.#inputString)) {

                //scanning string for all solid single expressions (multiplication, addition, parentheses), resolving expressions.
                if (this.#rxMultPattern.test(this.#inputString)) {
                    this.#inputString = this.#multResolve(this.#inputString);
                }

                if (this.#rxSummPattern.test(this.#inputString)) {
                    this.#inputString = this.#addResolve(this.#inputString);
                }

                if (this.#rxParenthPattern.test(this.#inputString)) {
                    this.#inputString = this.#parenthResolve(this.#inputString);
                }

                //debug
                console.log('Final loop result: ' + this.#inputString);
            }
            return this.#inputString;
        }
        catch (error) {
            console.log(error.message);
            return error.message;
        }
    }
}

// Метод должен принимать строку состоящую из букв и математических операций: “*” и “+”,
// - например “(abc*3+trc)*2 и возвращать строку - результат операций(abcabcabctrcabcabcabctrc).
// В случае получения неправильного аргумента выдавать ошибку.


// |\(([^ ()] *) \(|\) ([^ ()] *) \)