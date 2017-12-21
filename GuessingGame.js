function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
    var length = arr.length, randomInd, last;
    while(length) {
        randomInd = Math.floor(Math.random() * length--);
        last = arr[length];
        arr[length] = arr[randomInd];
        arr[randomInd] = last;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function() {
    return (this.playersGuess < this.winningNumber);
}

Game.prototype.playersGuessSubmission = function(num) {
    // if (num < 1 || num > 100 || typeof num !== "number") {
    //     throw "That is an invalid guess.";
    // } else {
        this.playersGuess = num;
        return this.checkGuess(this.playersGuess);
    // }
}

Game.prototype.checkGuess = function(num) {
    if (num < 1 || num > 100 || isNaN(num)) {
        return "Oops, invalid guess.";
    } else if (num === this.winningNumber) {
        return "You Win!";
    } else if (this.pastGuesses.indexOf(num) > -1) {
        return "You have already guessed that number.";
    } else if (this.pastGuesses.length === 4) {
        return "You Lose.";
    } else {
        this.pastGuesses.push(num);
        if (this.difference() < 10) {
            return "You're burning up!"
        } else if (this.difference() < 25) {
            return "You\'re lukewarm.";
        } else if (this.difference() < 50) {
            return "You\'re a bit chilly.";
        } else if (this.difference() < 100) {
            return "You\'re ice cold!";
        }
    }
}

function newGame() {
    return new Game;
}

Game.prototype.provideHint = function() {
    var hintArr = [this.winningNumber];
    hintArr.push(generateWinningNumber(), generateWinningNumber());
    return shuffle(hintArr);
}



function makeAGuess(game) {
    var validGuess = true;
    var newGuess = +$('#player-input').val();
    $('#player-input').val('');
    var result = game.playersGuessSubmission(newGuess);
    console.log(result);
    $("#title").text(result);
    if (result !== "You have already guessed that number." && result !== "Oops, invalid guess.") {
        if (game.isLower()) {
            $("#subtitle").text("Guess higher.");
        } else if (!game.isLower()) {
            $('#subtitle').text("Guess lower.");
        }
        var i = 1;
        while ($('#guess'+[i]).text() !== "-" && i < 6) {
                i++;
        }
        $('#guess'+[i]).text(newGuess.toString());
        if (result === "You Win!" || result === "You Lose.") {
            $("#subtitle").text("Hit the reset button to play again!");
            $('#submit').attr('disabled', true);
            $('#hint').attr('disabled', true);
        }
    } else {
        $("#subtitle").text("Guess a number between 1 & 100.");
    }
}

$(document).ready(function() {
    
    var game = new Game();

    $('#submit').on('click', function() {
        console.log('Button has been clicked');
        makeAGuess(game);
    })

    $(document).keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
        makeAGuess(game);
        }
    })

    $('#reset').on('click', function() {

        game = new Game();

        $("#title").text("Welcome to the Guessing Game!");
        $("#subtitle").text("Guess a number between 1 & 100.");
        $('#guess-list > li').text("-");
        $('#submit').attr('disabled', false);
        $('#hint').attr('disabled', false);


    });

    $("#hint").on('click', function() {
        $("#title").text(game.provideHint().join('\xa0\xa0\xa0'));
        $("#subtitle").text("Try one of the above...");
    })

});