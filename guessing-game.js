// game logic

function generateWinningNumber(bottom, top) {
    return Math.floor(Math.random() * Math.floor(top - bottom + 1)) + bottom;
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

function Game(bottom, top) {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber(bottom, top);
    this.hintBottom = null;
    this.hintTop = null;
}

Game.prototype.playersGuessSubmission = function (num) {
    if ((num < 1 || num > 100 || typeof (num) !== 'number' || num !== num) && this.pastGuesses.length < 5) {
        return 'Enter a valid guess.';
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function () {
    var pastGuess = this.pastGuesses.includes(this.playersGuess);
    var winningGuess = this.playersGuess == this.winningNumber
    var magnitude = Math.abs(this.difference());
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
        if (magnitude < 10) {
            return "You're burning up!"
        }
        if (magnitude < 25) {
            return "You're lukewarm."
        }
        if (magnitude < 50) {
            return "You're a bit chilly."
        }
        if (Mmagnitude < 100) {
            return "You're ice cold!"
        }
    }
}

Game.prototype.difference = function () {
    return this.playersGuess - this.winningNumber;
}

Game.prototype.range = function () {
}

Game.prototype.direction = function () {
    if (this.difference() === 0) {
        return this.winningNumber + '!';
    }
    if (this.playersGuess < this.winningNumber) {
        return 'Guess higher!'
    } else {
        return 'Guess lower!'
    }
}

Game.prototype.provideHint = function () {
    // game.range();
    var hintArr = [];
    hintArr.push(this.winningNumber);
    hintArr.push(generateWinningNumber(0, 100));
    hintArr.push(generateWinningNumber(0, 100));
    return shuffle(hintArr);
}

function newGame() {
    var bottom = 1;
    var top = 100;
    return new Game(bottom, top);
}

// game play (via JQuery)

function submitGuess(game) {
    var guess = +($('#player-input').val());
    var result = game.playersGuessSubmission(guess);
    var turnNum = game.pastGuesses.length;
    $('#player-input').val('');
    $('#subtitle').text(result);
    $('#tagline').text(game.direction());
    $('#guess-list li:nth-child(' + turnNum + ')').text(game.pastGuesses[turnNum - 1]);
}

$(function () {
    var game = newGame();
    $('#submit-button').click(function () { // submit guess on 'submit-button' click/enter
        submitGuess(game);
    })
    $('#player-input').keyup(function (event) { // submit guess on enter w/ 'player-input' focus
        if (event.which === 13) {
            submitGuess(game);
        }
    })
    $('#reset-btn').click(function () {
        location.reload(true);
    })
    $('#hint-btn').click(function () {
        var hint = game.provideHint();
        $('#subtitle').text('The answer is ' + hint[0] + ', ' + hint[1] + ', or ' + hint[2] + '...');
    })
})


