
export default class StringCalc {

    static inputString = '';
    static rxParenthPattern = /\([a-z]+\)/i;
    static rxMultPattern = /\w+\*\w+/i;
    static rxSummPattern = /[a-z]+\+[a-z]+/i;
    static rxResultPattern = /^[a-z]+$/i;


    static rxValAlienChars = /[^\w\*\+\(\)]/;
    static rxValStartEnd = /^[\*|\+].*$|^.*[\*|\+]$/;
    static rxValOpRepeats = /\+\+|\*\*/;
    static rxValParentheses = /\(\)|\(\(|\)\)|\w\(/i;
    static rxValOpParenthCollision = /\([+*]|[+*]\)/;
    static rxValOperandTypesCollision = /[a-z]\d|\d[a-z]/i;
    static rxValIncorrectOps = /\*[a-z]|\+\d/i;

    static parenthesisCountVal(str) {
        const openParenth = str.match(/\(/g);
        const closeParenth = str.match(/\)/g);
        return !(openParenth?.length === closeParenth?.length);
    }

    static inputValidation(str) {
        const invlaidInputsArray = [
            this.rxValAlienChars.test(str),
            this.rxValStartEnd.test(str),
            this.rxValOpRepeats.test(str),
            this.rxValParentheses.test(str),
            this.rxValOpParenthCollision.test(str),
            this.rxValOperandTypesCollision.test(str),
            this.rxValIncorrectOps.test(str),
            this.parenthesisCountVal(str)
        ]
        return invlaidInputsArray.some(value => value === true);
    }

    static multResult(multExpr) {                               //single  op results calculation.
        const splitExpr = multExpr.split('*');
        const string = splitExpr[0];
        let newString = '';
        const multiplier = splitExpr[1];
        for (let i = 1; i <= multiplier; i += 1) {
            newString += string;
        }
        return newString;
    }

    static addResult(str) {
        return str.split('+').join('');
    }

    static parenthResult(str) {
        return str.match(/[a-z]+/i)
    }

    static multResolve(str) {                                  //total string evaluation for ops, and their resolving.
        let newString = str;

        console.log('Incoming to multResolve() ' + newString);
        console.log('PAttern ' + newString.match(this.rxMultPattern)[0]);
        while (this.rxMultPattern.test(newString)) {
            newString = newString
                .replace(this.rxMultPattern, this.multResult(newString.match(this.rxMultPattern)[0]));
        }
        console.log('Result - ' + newString)
        return newString;
    }

    static addResolve(str) {
        let newString = str;
        console.log('Incoming to addResolve() ' + newString);
        console.log('PAttern ' + newString.match(this.rxSummPattern)[0]);
        while (this.rxSummPattern.test(newString)) {
            newString = newString
                .replace(this.rxSummPattern, this.addResult(newString.match(this.rxSummPattern)[0]));
        }
        console.log('Result - ' + newString)
        return newString;
    }

    static parenthResolve(str) {
        let newString = str;
        console.log('Incoming to parenthResolve() ' + newString);
        console.log('PAttern ' + newString.match(this.rxParenthPattern)[0]);
        while (this.rxParenthPattern.test(newString)) {
            newString = newString
                .replace(this.rxParenthPattern, this.parenthResult(newString.match(this.rxParenthPattern)[0]));
        }
        console.log('Result - ' + newString)
        return newString;
    }

    static errorMsg() {
        console.log('Invalid input!');
        return;
    }

    static evaluate(expr) {

        if (!expr) {
            this.errorMsg();
            return 'Invalid input!';
        }
        
        this.inputString = expr.split(' ').join('');

        if (this.inputValidation(this.inputString)) {
            this.errorMsg();
            return 'Invalid input!';
        }

        while (!this.rxResultPattern.test(this.inputString))                    //start processing input. While we dont have plain letters - keep processing.
        {
            if (this.rxMultPattern.test(this.inputString)) {                   //scanning string for all solid single multiplication ops.
                this.inputString = this.multResolve(this.inputString);              //resolving multiplication expressions.
            }

            if (this.rxSummPattern.test(this.inputString)) {                  //scanning string for addition ops (letters + letters).
                this.inputString = this.addResolve(this.inputString);
            }

            if (this.rxParenthPattern.test(this.inputString)) {               //scanning string for expressions in parentheses.
                this.inputString = this.parenthResolve(this.inputString);          //removing parentheses if all ops inside are settled (letters inside only).
            }

        }
        return this.inputString;
    }
}

// Метод должен принимать строку состоящую из букв и математических операций: “*” и “+”,
// - например “(abc*3+trc)*2 и возвращать строку - результат операций(abcabcabctrcabcabcabctrc).
// В случае получения неправильного аргумента выдавать ошибку.


// |\(([^ ()] *) \(|\) ([^ ()] *) \)