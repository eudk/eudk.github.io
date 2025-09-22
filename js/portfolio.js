function makeDraggable(element, handle) {
    let isDragging = false;
    let offsetX, offsetY;
    const activate = () => {
        document.querySelectorAll('.xp-window, .desktop-icon').forEach(el => el.style.zIndex = el.classList.contains('desktop-icon') ? 10 : 100);
        element.style.zIndex = element.classList.contains('desktop-icon') ? 1000 : 999;
        document.querySelectorAll('.desktop-icon.active').forEach(el => el.classList.remove('active'));
        if (element.classList.contains('desktop-icon')) element.classList.add('active');
    };
    (handle || element).addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        if(handle) handle.classList.add('grabbing');
        activate();
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        if(handle) handle.classList.remove('grabbing');
    });
     element.addEventListener('mousedown', activate);
}
document.querySelectorAll('.xp-window').forEach(win => makeDraggable(win, win.querySelector('.title-bar')));
document.querySelectorAll('.desktop-icon').forEach(icon => makeDraggable(icon));
document.getElementById('projects-icon').addEventListener('dblclick', () => document.getElementById('projects-window').classList.add('show'));
document.getElementById('snake-icon').addEventListener('dblclick', () => document.getElementById('snake-game-window').classList.add('show'));
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const windowEl = e.target.closest('.xp-window');
        windowEl.classList.remove('show');
        if (windowEl.id === 'snake-game-window') stopSnakeGame();
    });
});
const projectIconsInWindow = document.querySelectorAll('.project-icon-in-window');
const infoDisplay = document.getElementById('info-display');
projectIconsInWindow.forEach(icon => {
    icon.addEventListener('click', async () => {
        projectIconsInWindow.forEach(el => el.classList.remove('active'));
        icon.classList.add('active');
        const repoPath = icon.getAttribute('data-repo');
        infoDisplay.innerHTML = '<p>Fetching data...</p>';
        try {
            const res = await fetch(`https://api.github.com/repos/${repoPath}`);
            if (!res.ok) throw new Error('Repo not found');
            const data = await res.json();
            infoDisplay.innerHTML = `<h3>${data.name}</h3><p>${data.description || 'No description.'}</p><div class="stats"><span>⭐ ${data.stargazers_count}</span><span><strong>${data.language || 'N/A'}</strong></span></div><hr><a href="${data.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>`;
        } catch (error) {
            infoDisplay.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    });
});
const canvas = document.getElementById('snake-canvas');
const snakeCtx = canvas.getContext('2d');
const startButton = document.getElementById('start-snake-btn');
const scoreDisplay = document.getElementById('snake-score');
const gridSize = 20;
let snake, food, dx, dy, score, gameInterval, gameRunning = false, changingDirection = false;
function mainGameLoop() {
    if (checkCollision()) { stopSnakeGame(); alert('Game Over! Score: ' + score); return; }
    changingDirection = false;
    clearCanvas();
    drawFood();
    snake.forEach(drawSegment);
    advanceSnake();
}
function startSnakeGame() {
    if (gameRunning) return;
    snake = [{ x: 10, y: 10 }]; dx = 1; dy = 0; score = 0; scoreDisplay.textContent = score;
    generateFood(); gameRunning = true;
    document.addEventListener('keydown', changeDirection);
    gameInterval = setInterval(mainGameLoop, 100);
}
function stopSnakeGame() { clearInterval(gameInterval); gameRunning = false; document.removeEventListener('keydown', changeDirection); }
function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { score += 10; scoreDisplay.textContent = score; generateFood(); } else { snake.pop(); }
}
function checkCollision() {
    for (let i = 4; i < snake.length; i++) if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    return snake[0].x < 0 || snake[0].x * gridSize >= canvas.width || snake[0].y < 0 || snake[0].y * gridSize >= canvas.height;
}
function changeDirection(e) {
    if (changingDirection) return; changingDirection = true;
    const LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40;
    if (e.keyCode === LEFT && dx !== 1) { dx = -1; dy = 0; }
    if (e.keyCode === UP && dy !== 1) { dx = 0; dy = -1; }
    if (e.keyCode === RIGHT && dx !== -1) { dx = 1; dy = 0; }
    if (e.keyCode === DOWN && dy !== -1) { dx = 0; dy = 1; }
}
function generateFood() { food = { x: Math.floor(Math.random() * (canvas.width / gridSize)), y: Math.floor(Math.random() * (canvas.height / gridSize)) }; }
function drawSegment(segment) { snakeCtx.fillStyle = '#0f0'; snakeCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize); }
function drawFood() { snakeCtx.fillStyle = '#f00'; snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize); }
function clearCanvas() { snakeCtx.fillStyle = '#000'; snakeCtx.fillRect(0, 0, canvas.width, canvas.height); }
startButton.addEventListener('click', startSnakeGame);