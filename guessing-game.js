// game logic

function generateWinningNumber() {
    return Math.floor(Math.random() * Math.floor(100)) + 1;
}

function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.playersGuessSubmission = function (num) {
    if ((num < 1 || num > 100 || typeof (num) !== 'number' || num !== num) && this.pastGuesses.length < 5) {
        return 'That is an invalid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function () {
    var pastGuess = this.pastGuesses.includes(this.playersGuess);
    var winningGuess = this.playersGuess == this.winningNumber
    if (!winningGuess && !pastGuess) {
        this.pastGuesses.push(this.playersGuess);
    }
    if (this.pastGuesses.length > 4) {
        return "You Lose."
    } else {
        if (winningGuess) {
            return 'You Win!'
        }
        if (pastGuess) {
            return 'You have already guessed that number.';
        }
        if (this.difference() < 10) {
            return "You're burning up!"
        }
        if (this.difference() < 25) {
            return "You're lukewarm."
        }
        if (this.difference() < 50) {
            return "You're a bit chilly."
        }
        if (this.difference() < 100) {
            return "You're ice cold!"
        }
    }
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.direction = function () {
    if (this.playersGuess === this.winningNumber) {
        return this.winningNumber + '!';
    }
    if (this.playersGuess < this.winningNumber) {
        return 'Guess higher!'
    } else {
        return 'Guess lower!'
    }
}

Game.prototype.provideHint = function () {
    var hintArr = [];
    hintArr.push(this.winningNumber);
    hintArr.push(generateWinningNumber());
    hintArr.push(generateWinningNumber());
    return shuffle(hintArr);
}

function newGame() {
    return new Game();
}

// game play (via JQuery)

function submitGuess(game) {
    var guessNum = +($('#player-input').val());
    var result = game.playersGuessSubmission(guessNum);
    var turnNum = game.pastGuesses.length;
    $('#player-input').val('');
    $('#subtitle').text(result);
    $('#guess-list li:nth-child(' + turnNum + ')').text(game.pastGuesses[turnNum - 1]);
    $('#tagline').text(game.direction());
}

$(function () {
    var game = newGame();
    $('#submit-button').click(function () {
        submitGuess(game);
    })
    $('#player-input').keyup(function (event) {
        if (event.which === 13) {
            submitGuess(game);
        }
    })

    $('#reset').click(function () {
        alert('reset');
    })
    $('#hint').click(function () {
        alert('hint');
    })
})


