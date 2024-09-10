var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var players = new Array();
var currentPlayer = 0;
var player2HiddenCard = null; // To hold Player 2's hidden card

function createDeck() {
    deck = new Array();
    for (var i = 0 ; i < values.length; i++) {
        for(var x = 0; x < suits.length; x++) {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
}

function createPlayers(num) {
    players = new Array();
    for(var i = 1; i <= num; i++) {
        var hand = new Array();
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
        players.push(player);
    }
}

function createPlayersUI() {
    document.getElementById('players').innerHTML = '';
    for(var i = 0; i < players.length; i++) {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = 'Player ' + players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}

function shuffle() {
    for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];
        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

function startblackjack() {
    document.getElementById('btnStart').value = 'Restart';
    document.getElementById("status").style.display="none";
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(2);
    createPlayersUI();
    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');
}

function dealHands() {
    for(var i = 0; i < 2; i++) {
        for (var x = 0; x < players.length; x++) {
            var card = deck.pop();
            if (x === 1 && i === 1) {
                // Hide Player 2's second card
                player2HiddenCard = card;
                renderHiddenCard(x);
            } else {
                players[x].Hand.push(card);
                renderCard(card, x);
            }
        }
    }
    updatePoints();
    updateDeck();
}

function renderCard(card, player) {
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

//function renderHiddenCard(player) {
    //var hand = document.getElementById('hand_' + player);
   // var hiddenCard = document.createElement('div');
  //  hiddenCard.className = 'card hidden';  // Add CSS for a hidden card
    
  function renderHiddenCard(player) {
    var hand = document.getElementById('hand_' + player);
    var hiddenCard = document.createElement('div');
    hiddenCard.className = 'card hidden';  // Add CSS for a hidden card
    hiddenCard.innerHTML = 'hidden card';
    hand.appendChild(hiddenCard);
}

   // hiddenCard.innerHTML = 'X';
  //  hiddenCard.style.fontSize = '15px';  // Increase the font size for the 'X'
    //hiddenCard.style.textAlign = 'center';  // Center the 'X'
  //  hiddenCard.style.display = 'flex';  // Use flexbox for centering
  //  hiddenCard.style.justifyContent = 'center';  // Horizontal center
  //  hiddenCard.style.alignItems = 'center';  // Vertical center
   // hiddenCard.style.height = '100px';  // Adjust the height of the card (if needed)
    
    //hand.appendChild(hiddenCard);
//}



function revealHiddenCard() {
    players[1].Hand.push(player2HiddenCard);  // Reveal the hidden card
    var hand = document.getElementById('hand_1');
    hand.innerHTML = '';  // Clear the current hand UI
    players[1].Hand.forEach(card => {
        renderCard(card, 1);
    });
    updatePoints();
}

function getCardUI(card) {
    var el = document.createElement('div');
    var icon = '';
    var color = 'black';  // Default color is black

    if (card.Suit == 'Hearts') {
        icon = '&hearts;';
        color = 'red';  // Set color to red for Hearts
    } else if (card.Suit == 'Spades') {
        icon = '&spades;';
    } else if (card.Suit == 'Diamonds') {
        icon = '&diams;';
        color = 'red';  // Set color to red for Diamonds
    } else {
        icon = '&clubs;';
    }

    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    el.style.color = color;  // Apply the color

    return el;
}


function getPoints(player) {
    var points = 0;
    for(var i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;
    return points;
}

function updatePoints() {
    for (var i = 0 ; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

function hitMe() {
    var card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    check();
}

function stay() {
    if (currentPlayer != players.length - 1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer += 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
        if (currentPlayer === 1) {
            revealHiddenCard();  // Reveal Player 2's hidden card when it's Player 2's turn
            autoPlayForPlayer2(); // Automatically play for Player 2
        }
    } else {
        end();
    }
}

function autoPlayForPlayer2() {
    const player2Index = 1;
    const hitMeButtonId = 'hitMe'; 
    const stayButtonId = 'stay';

    if (currentPlayer === player2Index) {
        let player2Score = players[player2Index].Points;

        let autoHitInterval = setInterval(function () {
            if (player2Score < 16) {
                document.getElementById(hitMeButtonId).click();
                player2Score = players[player2Index].Points;
            } else {
                document.getElementById(stayButtonId).click();
                clearInterval(autoHitInterval);  // Stop the interval once Player 2 stays
            }
        }, 1000);  // 1 second delay between hits
    }
}

function end() {
    var winner = -1;
    var score = 0;

    for (var i = 0; i < players.length; i++) {
        if (players[i].Points > score && players[i].Points < 22) {
            winner = i;
        }
        score = players[i].Points;
    }

    document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
    document.getElementById("status").style.display = "inline-block";
}

function check() {
    if (players[currentPlayer].Points > 21) {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
        document.getElementById('status').style.display = "inline-block";
        end();
    }
}

function updateDeck() {
    document.getElementById('deckcount').innerHTML = deck.length;
}

window.addEventListener('load', function(){
    createDeck();
    shuffle();
    createPlayers(1);
});
