// Play Board é a TELA ou tabuleiro
// Container onde a cobra e a comida serão renderizadas
const playBord = document.querySelector(".play-board");
// Pontuação atual do jogador
const scoreElement = document.querySelector(".score");
// Recorde (maior pontuação)
const highScoreElement = document.querySelector(".high-score");
// Controle de movimento (botões para dispositivos móveis)
const controls = document.querySelectorAll(".controls i");

// Cadastro de Variáveis
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obter pontuação alta do localStorage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

// Gerar posição aleatória para a comida
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Função para lidar com o fim do jogo
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! 😫 Aperte OK para iniciar novamente...");
    location.reload();
};

// Função para mudar a direção da cobrinha
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Para controles em dispositivos móveis
controls.forEach(button =>
    button.addEventListener("click", () => changeDirection({ key: button.dataset.key }))
);

// Função principal do jogo
const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Quando a cobra come a comida
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        // Atualizar o recorde
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);

        // Atualizar placares
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }

    // Atualizar posição da cabeça da cobra
    snakeX += velocityX;
    snakeY += velocityY;

    // Mover corpo da cobra
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Verificar colisão com as paredes
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // Renderizar corpo da cobra e verificar colisão com ela mesma
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }

    playBord.innerHTML = html;
};

// Iniciar o jogo
updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
