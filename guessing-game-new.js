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
    this.won = false;
    this.lost = false;
    this.hintUsed = false;
}

Game.prototype.playersGuessSubmission = function (num) {
    if ((num < 1 || num > 100 || typeof (num) !== 'number' || num !== num) && this.won == this.lost) {
        if (this.pastGuesses.length == 0) {
            return "Guess the number between 1 and 100...";
        } else {
            return 'Not a valid guess.';
        }
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
    var numGuesses = this.pastGuesses.length;
    if (!winningGuess && numGuesses > 4) {
        this.lost = true;
        return "You Lose."
    }
    if (winningGuess) {
        this.won = true;
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
    if (magnitude < 100) {
        return "You're ice cold."
    }
}

Game.prototype.difference = function () {
    return this.playersGuess - this.winningNumber;
}

Game.prototype.range = function () {
}

Game.prototype.direction = function () {
    if (this.lost) {
        return 'Sorry...'
    }
    if (this.won) {
        return 'Congrats!';
    }
    if (this.playersGuess == null) {
        return '';
    } else {
        if (this.difference() < 0) {
            return 'Guess higher!'
        } else {
            return 'Guess lower!'
        }
    }
}

Game.prototype.provideHint = function () {
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

function gameReset() {
    $('#subtitles').text('Guess the number between 1 and 100...');
    $('.guess').text('-');
    this.pastGuesses = [];
    $('#player-input').val('');
    $('#player-input, #submit-button, #hint-btn').attr("disabled", false)
    $('#player-input').focus();
}

// game play (via JQuery)

function submitGuess(game) {
    var guess = +($('#player-input').val());
    var result = game.playersGuessSubmission(guess);
    var turnNum = game.pastGuesses.length;
    $('#player-input').val('');
    $('#subtitles').text(result + ' ' + game.direction());
    $('#guess-list li:nth-child(' + turnNum + ')').text(game.pastGuesses[turnNum - 1]);
    if (game.won) {
        $('#guess-list li').text('\u2764')
    }
    if (game.lost) {
        $('#guess-list li').text('\u2716')
    }
    if (game.won !== game.lost) {
        $('#player-input, #submit-button, #hint-btn').attr("disabled", true)
        $('#reset-btn').focus();
    }
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
    $('#reset-btn').click(function () {
        game = newGame();
        gameReset();
    })
    $('#hint-btn').click(function () {
        var hint = game.provideHint();
        if (game.won == false) {
            if (game.hintUsed == false) {
                game.hintUsed = true;
                $('#subtitles').text('The answer is ' + hint[0] + ', ' + hint[1] + ', or ' + hint[2] + '.');
            } else {
                $('#subtitles').text('You already got a hint!')
            }
        }
    })
})