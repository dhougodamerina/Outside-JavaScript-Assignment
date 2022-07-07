var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var scoreLabel = document.getElementById("score");
var highscoreLabel = document.getElementById("high-score");
var score = 0;
var grid = 4;
var width = canvas.width / grid - 6;
var cells = [];
var highScore = localStorage.getItem("highscore");
var fontSize;
var end = false;

var start = document.getElementById("startbtn");
var about = document.getElementById('about');
start.addEventListener("click", function (e) {
  startGame();
  start.style.display = "none";
  about.style.display = 'none';

});

if (highScore !== null) {
  highscoreLabel.innerHTML = "High Score : " + highScore;
} else {
  highscoreLabel.innerHTML = "High Score: 0";
}

function endGame() {
  if (score > highScore) {
    localStorage.setItem("highscore", this.score);
  } else {
    localStorage.setItem("highscore", this.highScore);
  }
  canvas.style.opacity = "0.5";
  end = true;
  var gameEnd = document.getElementById("end");
  gameEnd.style.display = "block";
  var restart = document.getElementById("restartbtn");
  restart.style.display = "block";
  restart.addEventListener("click", function (e) {
    score = 0;
    canvas.style.opacity = "1";
    end = false;
    startGame();
    restart.style.display = "none";
    gameEnd.style.display = "none";
  });
}

function cell(row, coll) {
  this.value = 0;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

function createCells() {
  for (i = 0; i < grid * grid; i++) {
    cells[i] = [];
    for (j = 0; j < grid; j++) {
      cells[i][j] = new cell(i, j);
    }
  }
}

function drawCell(cell) {
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, width, width);
  switch (cell.value) {
    case 0:
      ctx.fillStyle = "#AFDCEC";
      break;
    case 2:
      ctx.fillStyle = "#306EFF";
      break;
    case 4:
      ctx.fillStyle = "#1E90FF";
      break;
    case 8:
      ctx.fillStyle = "#357EC7";
      break;
    case 16:
      ctx.fillStyle = "#3090C7";
      break;
    case 32:
      ctx.fillStyle = "#659EC7";
      break;
    case 64:
      ctx.fillStyle = "#6495ED";
      break;
    case 128:
      ctx.fillStyle = "#56A5EC";
      break;
    case 256:
      ctx.fillStyle = "#00BFFF";
      break;
    case 512:
      ctx.fillStyle = "#82CAFF";
      break;
    case 1024:
      ctx.fillStyle = "#87CEEB";
      break;
    case 2048:
      ctx.fillStyle = "#A0CFEC";
      var show = document.getElementById("alert");
      show.style.display = "block";
      break;
    case 4096:
      ctx.fillStyle = "#C6DEFF";
      break;
    default:
      ctx.fillStyle = "#AFDCEC";
  }
  ctx.fill();
  if (cell.value) {
    fontSize = width / 2;
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      cell.value,
      cell.x + width / 2,
      cell.y + width / 2 + width / 7
    );
  }
}


document.onkeydown = function (event) {
  if (!end) {
    if (event.key === "ArrowUp") {
      moveUp();
    } else if (event.key === "ArrowRight") {
      slideRight();
    } else if (event.key === "ArrowDown") {
      moveDown();
    } else if (event.key === "ArrowLeft") {
      slideLeft();
    }
    scoreLabel.innerHTML = "Score : " + score;
  }
};

function startGame() {
  createCells();
  drawAllCells();
  generate();
  generate();
}

function drawAllCells() {
  var i, j;
  for (i = 0; i < grid; i++) {
    for (j = 0; j < grid; j++) {
      drawCell(cells[i][j]);
    }
  }
}

function generate() {
  var countFree = 0;
  var i, j;
  for (i = 0; i < grid; i++) {
    for (j = 0; j < grid; j++) {
      if (!cells[i][j].value) {
        countFree++;
      }
    }
  }
  if (!countFree) {
    endGame();
    return;
  }
  while (true) {
    var x = Math.floor(Math.random() * grid);
    var y = Math.floor(Math.random() * grid);
    if (!cells[x][y].value) {
      cells[x][y].value = Math.random() > 0.5 ? 2 : 4;
      drawAllCells();
      return;
    }
  }
}

function slideRight() {
  var i, j, coll;
  for (i = 0; i < grid; i++) {
    for (j = grid - 2; j >= 0; j--) {
      if (cells[i][j].value) {
        coll = j;
        while (coll + 1 < grid) {
          if (!cells[i][coll + 1].value) {
            cells[i][coll + 1].value = cells[i][coll].value;
            cells[i][coll].value = 0;
            coll++;
          } else if (cells[i][coll].value == cells[i][coll + 1].value) {
            cells[i][coll + 1].value *= 2;
            score += cells[i][coll + 1].value;
            cells[i][coll].value = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  generate();
}

function slideLeft() {
  var i, j, coll;
  for (i = 0; i < grid; i++) {
    for (j = 1; j < grid; j++) {
      if (cells[i][j].value) {
        coll = j;
        while (coll - 1 >= 0) {
          if (!cells[i][coll - 1].value) {
            cells[i][coll - 1].value = cells[i][coll].value;
            cells[i][coll].value = 0;
            coll--;
          } else if (cells[i][coll].value == cells[i][coll - 1].value) {
            cells[i][coll - 1].value *= 2;
            score += cells[i][coll - 1].value;
            cells[i][coll].value = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  generate();
}

function moveUp() {
  var i, j, row;
  for (j = 0; j < grid; j++) {
    for (i = 1; i < grid; i++) {
      if (cells[i][j].value) {
        row = i;
        while (row > 0) {
          if (!cells[row - 1][j].value) {
            cells[row - 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row--;
          } else if (cells[row][j].value == cells[row - 1][j].value) {
            cells[row - 1][j].value *= 2;
            score += cells[row - 1][j].value;
            cells[row][j].value = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  generate();
}

function moveDown() {
  var i, j, row;
  for (j = 0; j < grid; j++) {
    for (i = grid - 2; i >= 0; i--) {
      if (cells[i][j].value) {
        row = i;
        while (row + 1 < grid) {
          if (!cells[row + 1][j].value) {
            cells[row + 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row++;
          } else if (cells[row][j].value == cells[row + 1][j].value) {
            cells[row + 1][j].value *= 2;
            score += cells[row + 1][j].value;
            cells[row][j].value = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }
  generate();
}
