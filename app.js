function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const grid = document.querySelector(".grid");
  const message = document.querySelector(".message");
  const score = document.querySelector(".score");
  const leftButton = document.querySelector("#left");
  const rightButton = document.querySelector("#right");
  const shootButton = document.querySelector("#shoot");
  const resetButton = document.querySelector("#reset");
  const width = 20;
  let points = 0;
  let shooterIndex = 390;
  let squares = [];
  let invaders = Array.from({ length: 20 }, (_, i) => i + 1).map((i) =>
    getRandomInt(1, 300)
  );
  let isGoingRight = true;
  let direction = 1;
  let invadersRemoved = [];
  let laserId = null;
  let laserIndex = null;
  let invadersId = null;
  let moveId = null;
  let drawId = null;
  
  function resetGame(e) {
    if (e.key == "R" || e.key == "r" || e.target.id === "reset") {
      message.textContent = "";
      if (laserId != null) {
        clearInterval(laserId);
      }
      clearInterval(drawId);
      clearInterval(moveId);
      clearInterval(laserId);
      removeEventListener("keydown", moveShooter);
      removeEventListener("keydown", shoot);
      removeEventListener("keydown", resetGame);
      removeInvaders();
      removeShooter();
      removeLaser();
      points = 0;
      updatePoints();
      shooterIndex = 390;
      invaders = Array.from({ length: 30 }, (_, index) => getRandomInt(1, 300));
      isGoingRight = true;
      direction = 1;
      invadersRemoved = [];
      laserId = null;
      laserIndex = null;
      invadersId = null;
      start();
    }
  }
  
  function createGrid() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.innerText = i + 1;
      squares.push(square);
      grid.appendChild(square);
    }
  }
  
  function drawShooter() {
    if (shooterIndex != null) {
      squares[shooterIndex].classList.add("shooter");
    }
  }
  
  function drawInvaders() {
    for (let i = 0; i < invaders.length; i++) {
      if (!invadersRemoved.includes(invaders[i])) {
        if (invaders[i] < width * width - 1) {
          squares[invaders[i]].classList.add("invader");
        }
      }
    }
  }
  
  function drawLaser() {
    if (laserIndex >= 0) {
      squares[laserIndex].classList.add("laser");
      checkForHit();
    }
  }
  
  function removeInvaders() {
    if (invaders.length > 0) {
      for (let i = 0; i < invaders.length; i++) {
        if (invaders[i] < width * width - 1) {
          squares[invaders[i]].classList.remove("invader");
        }
      }
    }
  }
  
  function removeShooter() {
    squares[shooterIndex].classList.remove("shooter");
  }
  
  function removeLaser() {
    for (let i = 0; i < squares.length; i++) {
      squares[i].classList.remove("laser");
    }
  }
  
  function moveShooter(e) {
    squares[shooterIndex].classList.remove("shooter");
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (shooterIndex % width !== 0) {
          shooterIndex -= 1;
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (shooterIndex % width < width - 1) {
          shooterIndex += 1;
        }
        break;
      default:
        break;
    }
  }
  
  function moveShooterLeft() {
    squares[shooterIndex].classList.remove("shooter");
    if (shooterIndex % width !== 0) {
      shooterIndex -= 1;
    }
  }
  
  function moveShooterRight() {
    squares[shooterIndex].classList.remove("shooter");
    if (shooterIndex % width < width - 1) {
      if (shooterIndex % width < width - 1) {
        shooterIndex += 1;
      }
    }
  }
  
  function moveInvaders() {
    checkGameOver();
    const leftEdge = invaders[0] % width === 0;
    const rightEdge = invaders[invaders.length - 1] % width === width - 1;
    removeInvaders();
  
    if (rightEdge && isGoingRight) {
      for (let i = 0; i < invaders.length; i++) {
        invaders[i] += width + 1;
        direction = -1;
        isGoingRight = false;
      }
    }
  
    if (leftEdge && !isGoingRight) {
      for (let i = 0; i < invaders.length; i++) {
        invaders[i] += width - 1;
        direction = 1;
        isGoingRight = true;
      }
    }
  
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += direction;
    }
  
    drawInvaders();
  }
  
  function updatePoints() {
    score.textContent = points;
  }
  
  function checkGameOver() {
    if (invadersRemoved.length === invaders.length) {
      showGameOver();
    }
    const squareInvaderShooter = document.querySelector(".invader.shooter");
    if (squareInvaderShooter) {
      showGameOver();
    }
  }
  
  function showGameOver() {
    clearInterval(moveId);
    document.removeEventListener("keydown", shoot);
    score.textContent = `GAME OVER \n Score: ${points}`;
    message.textContent = "Press R to restart Game";
  }
  
  const checkForHit = () => {
    if (squares[laserIndex].classList.contains("invader")) {
      squares[laserIndex].classList.remove("laser");
      squares[laserIndex].classList.remove("invader");
      const indexOfInvader = invaders.indexOf(laserIndex);
      invaders.splice(indexOfInvader, 1);
      invadersRemoved.push(indexOfInvader);
      clearInterval(laserId);
      points += 1;
      updatePoints();
    }
  };
  
  function moveLaser() {
    if (laserIndex >= 0 && squares[laserIndex]) {
      squares[laserIndex].classList.remove("laser");
      laserIndex -= width;
      drawLaser();
    }
  }
  
  function shoot(e) {
    if (e.key === "ArrowUp" || e.target.id === "shoot") {
      removeLaser();
      e.preventDefault();
      laserIndex = shooterIndex - width;
      drawLaser();
      laserId = setInterval(moveLaser, 300);
    }
  }
  
  function draw() {
    drawShooter();
  }
  
  function start() {
    document.addEventListener("keydown", moveShooter);
    document.addEventListener("keydown", shoot);
    document.addEventListener("keydown", resetGame);
    moveId = setInterval(moveInvaders, 600);
    drawId = setInterval(draw, 10);
  }
  
  function activateArcadeButtons() {
    leftButton.addEventListener("click", moveShooterLeft);
    rightButton.addEventListener("click", moveShooterRight);
    shootButton.addEventListener("click", shoot);
    resetButton.addEventListener("click", resetGame);
  }
  
  activateArcadeButtons();
  createGrid();
  start();
  






