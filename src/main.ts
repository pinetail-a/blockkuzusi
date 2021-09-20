const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const ballRadius = 10;
const ballcount = 2;

class Ball {
  constructor(
    public x: number,
    public y: number,
    public dx: number,
    public dy: number
  ) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
}

const ball: Ball[] = [];
for (let i = 0; i < ballcount; i++) {
  ball[i] = new Ball(canvas.width / 2, canvas.height - 30, i + 1, -(i + 1));
}

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
let lives = 3;
const brickColor: string[][] = [
  ['#FF0000', '#00FF00', '#FF0000', '#FF0000', '#FF0000'],
  ['#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000'],
  ['#FF0000', '#FF0000', '#FF0000', '#008000', '#FF0000'],
];

type Tbrick = { x: number; y: number; status: number };

const bricks: Tbrick[][] = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e: KeyboardEvent) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e: KeyboardEvent) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e: MouseEvent) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      for (let i = 0; i < ballcount; i++) {
        if (b.status == 1) {
          if (
            ball[i].x > b.x &&
            ball[i].x < b.x + brickWidth &&
            ball[i].y > b.y &&
            ball[i].y < b.y + brickHeight
          ) {
            ball[i].dy = -ball[i].dy;
            b.status = 0;
            score++;
            if (score == brickRowCount * brickColumnCount) {
              alert('YOU WIN, CONGRATS!');
              document.location.reload();
            }
          }
        }
      }
    }
  }
}

function drawBall() {
  for (let i = 0; i < ballcount; i++) {
    ctx.beginPath();
    ctx.arc(ball[i].x, ball[i].y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = brickColor[c][r];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives:${lives}`, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  for (let i = 0; i < ballcount; i++) {
    if (
      ball[i].x + ball[i].dx > canvas.width - ballRadius ||
      ball[i].x + ball[i].dx < ballRadius
    ) {
      ball[i].dx = -ball[i].dx;
    }
    if (ball[i].y + ball[i].dy < ballRadius) {
      ball[i].dy = -ball[i].dy;
    } else if (ball[i].y + ball[i].dy > canvas.height - ballRadius) {
      if (ball[i].x > paddleX && ball[i].x < paddleX + paddleWidth) {
        ball[i].dy = -ball[i].dy;
      } else {
        lives--;
        if (!lives) {
          alert('GAME OVER');
          document.location.reload();
        } else {
          ball[i].x = canvas.width / 2;
          ball[i].y = canvas.height - 30;
          ball[i].dx = 3;
          ball[i].dy = -3;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  for (let i = 0; i < ballcount; i++) {
    ball[i].x += ball[i].dx;
    ball[i].y += ball[i].dy;
  }

  requestAnimationFrame(draw);
}

draw();
