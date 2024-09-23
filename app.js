function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const grid = document.querySelector(".grid");
  const result = document.querySelector(".results");
  const score = document.querySelector(".score");
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
    if (e.key == "R" || e.key == "r") {
      if (laserId != null) {
        clearInterval(laserId);
      }
      clearInterval(drawId);
      clearInterval(moveId);
      removeEventListener("keydown", moveShooter);
      removeEventListener("keydown", shoot);
      removeEventListener("keydown", resetGame);
      removeInvaders();
      removeShooter();
      removeLaser();
      points = 0;
      updatePoints();
      shooterIndex = 220;
      invaders = [1, 2, 3, 4, 5, 16, 17, 18, 19, 20];
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
        squares[invaders[i]].classList.add("invader");
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
    for (let i = 0; i < invaders.length; i++) {
      squares[invaders[i]].classList.remove("invader");
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
  
  function moveInvaders() {
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
      removeLaser();
    }
  };
  
  function moveLaser() {
    if (laserIndex >= 0) {
      squares[laserIndex].classList.remove("laser");
      laserIndex -= width;
      removeLaser();
      drawLaser();
    }
  }
  
  function shoot(e) {
    if (e.key === "ArrowUp") {
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
  
  createGrid();
  start();
  






