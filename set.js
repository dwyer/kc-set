var BOARD_COLUMNS = 7;

var deck = [];
var deckPivot = 0;
var board = null;

function all(x, y, z) {
  return x == y && x == z;
}

function none(x, y, z) {
  return x != y && x != z && y != z;
}

function allOrNone(x, y, z) {
  return all(x, y, z) || none(x, y, z);
}

function getSelected() {
  return document.getElementsByClassName('selected');
}

function select(card) {
  card.className = 'card selected';
  card.selected = true;
}

function deselect(card) {
  card.className = 'card';
  card.selected = false;
}

function toggleSelected(card) {
  if (card.selected) {
    deselect(card);
  } else {
    select(card);
  }
}

function unselectSelected() {
  var selected = getSelected();
  for (var i = selected.length - 1; i >= 0; i--) {
    deselect(selected[i]);
  }
}

function discardSelected() {
  var selected = getSelected();
  for (var i = selected.length - 1; i >= 0; i--) {
    selected[i].parentNode.removeChild(selected[i]);
  }
}

function selectedIsSet() {
  var set = getSelected();
  if (allOrNone(set[0].attr[0], set[1].attr[0], set[2].attr[0]) &&
      allOrNone(set[0].attr[1], set[1].attr[1], set[2].attr[1]) &&
      allOrNone(set[0].attr[2], set[1].attr[2], set[2].attr[2]) &&
      allOrNone(set[0].attr[3], set[1].attr[3], set[2].attr[3])) {
    return true;
  } else {
    return false;
  }
}

function dealNext() {
  for (var row = 0; row < board.rows.length; row++) {
    for (var cell = 0; cell < board.rows[row].cells.length; cell++) {
      if (!board.rows[row].cells[cell].childNodes.length) {
        board.rows[row].cells[cell].appendChild(deck[deckPivot]);
        deckPivot++;
        return;
      }
    }
  }
}

function newGame() {
  shuffle(deck);
  deckPivot = 0;
  setInterval(dealNext, 1000);
}

function checkForSet() {
  if (getSelected().length == 3) {
    if (selectedIsSet()) {
      discardSelected();
    } else {
      unselectSelected();
    }
  }
}

function clickCard() {
  toggleSelected(this);
  checkForSet();
}

function createSymbol(i, j, k) {
  var symbol = document.createElement('div');
  var x = -60 * k;
  var y = -30 * j - 90 * i;
  var styles = ['background-position: ' + x + 'px ' + y + 'px'];
  symbol.className = 'symbol';
  symbol.setAttribute('style', styles.join(';'));
  return symbol;
}

function createCard(i, j, k, l) {
  var card = document.createElement('table');
  card.attr = [i, j, k, l];
  card.onclick = clickCard;
  card.selected = false;
  card.insertRow(0);
  card.rows[0].insertCell(0);
  card.className = 'card';
  for (var m = 0; m < l + 1; m++) {
    card.rows[0].cells[0].appendChild(createSymbol(i, j, k));
  }
  return card;
}

function initDeck() {
  deck = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
          deck.push(createCard(i, j, k, l));
        }
      }
    }
  }
}

function initBoard() {
  board = document.createElement('table');
  board.id = 'board';
  for (var i = 0; i < 21; i++) {
    if (i % BOARD_COLUMNS == 0) {
      board.insertRow(i / BOARD_COLUMNS);
    }
    board.rows[Math.floor(i / BOARD_COLUMNS)].insertCell(i % BOARD_COLUMNS);
  }
  document.body.appendChild(board);
}

function initGame() {
  initBoard();
  initDeck();
  newGame();
}

window.onload = initGame;
