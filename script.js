// Polyfill para requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame || 
                               window.webkitRequestAnimationFrame || 
                               window.mozRequestAnimationFrame || 
                               window.msRequestAnimationFrame || 
                               function(callback) {
                                   return setTimeout(callback, 1000 / 60);
                               };

const canvas = document.getElementById("arkanoidCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 10; // filas de ladrillos
let brickColumnCount = 10; // columnas de ladrillos
let brickWidth = 35; // Ancho de los ladrillos para que quepan en el lienzo
let brickHeight = 15; // Altura de los ladrillos para que quepan en el lienzo
let brickPadding = 2; // Puedes ajustar este valor para separar los ladrillos
let brickOffsetTop = 30; // Mantener
let brickOffsetLeft = 15; // Mantener
let score = 0;
let isGameOver = false;
let totalBricks = brickRowCount * brickColumnCount;
let paddleColor = "#0095DD";
let backgroundColor = "#000"; // Variable para el color del fondo

// Pantalla de Game Over y ajustes
const gameOverScreen = document.getElementById("gameOverScreen");
const restartButton = document.getElementById("restartButton");
const startGameButton = document.getElementById("startGame");
const settingsButton = document.getElementById("settingsButton");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const settingsMenu = document.getElementById("settingsMenu");
const paddleColorPicker = document.getElementById("paddleColorPicker");
const bgColorPicker = document.getElementById("bgColorPicker");
const backButton = document.getElementById("backButton");

restartButton.addEventListener("click", () => {
  document.location.reload();
});

startGameButton.addEventListener("click", () => {
  menu.style.display = "none";
  gameContainer.style.display = "block";
  draw();
});

settingsButton.addEventListener("click", () => {
  menu.style.display = "none";
  settingsMenu.style.display = "block";
});

backButton.addEventListener("click", () => {
  settingsMenu.style.display = "none";
  menu.style.display = "block";
});

// Cambiar el color de la plataforma
paddleColorPicker.addEventListener("input", (event) => {
  paddleColor = event.target.value;
});

// Cambiar el color del fondo
bgColorPicker.addEventListener("input", (event) => {
  backgroundColor = event.target.value;
});

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Event listeners for keyboard input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Controles táctiles y de mouse para las flechas
document.getElementById("leftArrow").addEventListener("mousedown", () => {
  leftPressed = true;
});
document.getElementById("leftArrow").addEventListener("mouseup", () => {
  leftPressed = false;
});
document.getElementById("leftArrow").addEventListener("touchstart", () => {
  leftPressed = true;
});
document.getElementById("leftArrow").addEventListener("touchend", () => {
  leftPressed = false;
});

document.getElementById("rightArrow").addEventListener("mousedown", () => {
  rightPressed = true;
});
document.getElementById("rightArrow").addEventListener("mouseup", () => {
  rightPressed = false;
});
document.getElementById("rightArrow").addEventListener("touchstart", () => {
  rightPressed = true;
});
document.getElementById("rightArrow").addEventListener("touchend", () => {
  rightPressed = false;
});

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Colisiones con los ladrillos
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          totalBricks--;
          if (totalBricks > 0) {
            dx *= 1.01; // Aumentar la velocidad de la pelota
            dy *= 1.01;
          }
          if (totalBricks === 0) {
            isGameOver = true;
            gameOverScreen.style.display = "block";
          }
        }
      }
    }
  }
}

// Dibujar la bola
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Dibujar la paleta
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

// Dibujar los ladrillos
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD"; // Color de los ladrillos
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Dibujar el puntaje
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// Función principal de dibujado y lógica del juego
function draw() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.backgroundColor = backgroundColor; // Cambiar color del fondo dinámicamente
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // Colisiones con los bordes
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      // Calcular la posición relativa del impacto
      const relativeX = x - (paddleX + paddleWidth / 2); // Posición relativa al centro de la paleta
      const normalizedRelativeX = relativeX / (paddleWidth / 2); // Normalizar la posición entre -1 y 1
  
      // Ajustar la dirección de la bola según el impacto
      const angle = normalizedRelativeX * (Math.PI / 4); // Ángulo máximo de 45 grados
      dx = 2 * Math.sin(angle); // Ajusta la velocidad en x
      dy = -2 * Math.cos(angle); // Ajusta la velocidad en y
  
      // Asegúrate de que la bola no se quede pegada a la paleta
    } else {
      isGameOver = true;
      gameOverScreen.style.display = "block";
      return;
    }
  }

  // Rebote en el techo
   if (y + dy < ballRadius) {
    dy = -dy; // Cambia la dirección en y
  } 
  

  // Movimiento de la paleta
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

// Crear un nuevo objeto de Audio
const soundtrack = new Audio('soundtrack.mp3');

// Reproducir el soundtrack en bucle
function playSoundtrack() {
    soundtrack.loop = true; // Hacer que el audio se repita
    soundtrack.volume = 0.5; // Ajustar el volumen (opcional)
    soundtrack.play(); // Reproducir el soundtrack
}

// Llamar a la función para reproducir el soundtrack al iniciar el juego
startGameButton.addEventListener("click", () => {
    menu.style.display = "none";
    gameContainer.style.display = "block";
    playSoundtrack(); // Reproducir el soundtrack al iniciar el juego
    draw(); // Comenzar el juego
});