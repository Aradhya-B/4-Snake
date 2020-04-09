// Game board
let cnv;
// Game board container
let cnvDiv;
// 4 game sections
let sec1;
let sec2;
let sec3;
let sec4;
// Scale of our game (# of grids = (width * height / gridScale^2))
let gridScale = 20;

// Preloading the div to hold the game board (canvas)
function preload() {
    cnvDiv = document.getElementById('canvas-container');
}

function setup() {
    // Creating the canvas (can only have 1 instance)
    cnv = createCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));
    // Setting the parent of the canvas 
    cnv.parent('canvas-container');
    // Resizing the canvas after setting the parent
    cnv = resizeCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));

    let halfWidth = floor(cnvDiv.offsetWidth / 2);
    let halfHeight = floor(cnvDiv.offsetHeight / 2);
    // Creating game sections on canvas with graphics overlay 
    sec1 = createGraphics(halfWidth, halfHeight);
    sec1.background(123, 122, 211);
    sec2 = createGraphics(halfWidth, halfHeight);
    sec2.background(40, 74, 111);
    sec3 = createGraphics(halfWidth, halfHeight);
    sec3.background(243, 74, 111);
    sec4 = createGraphics(halfWidth, halfHeight);
    sec4.background(243, 255, 111);

    sec1.snake = new Snake(0, 0, 0, halfWidth - gridScale, 0, halfHeight - gridScale, 255, 0, 0);
    sec2.snake = new Snake(halfWidth, 0, halfWidth, cnvDiv.offsetWidth - gridScale, 0, halfHeight - gridScale, 0, 255, 0);
    sec3.snake = new Snake(0, halfHeight, 0, halfWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 255, 0, 255);
    sec4.snake = new Snake(halfWidth, halfHeight, halfWidth, cnvDiv.offsetWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 255, 100, 100);

    sec1.food = new Food();
    frameRate(30);
}

// Resize the canvas when the window gets resized 
function windowResized() {
    cnv = resizeCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));
    // sec1 = resizeGraphics(floor(cnvDiv.offsetWidth / 2), floor(cnvDiv.offsetHeight / 2));
    // sec2 = resizeGraphics(floor(cnvDiv.offsetWidth / 2), floor(cnvDiv.offsetHeight / 2));
    // sec3 = resizeGraphics(floor(cnvDiv.offsetWidth / 2), floor(cnvDiv.offsetHeight / 2));
    // sec4 = resizeGraphics(floor(cnvDiv.offsetWidth / 2), floor(cnvDiv.offsetHeight / 2));
}

function draw() {
    background(255);

    image(sec1, 0, 0);
    image(sec2, floor(cnvDiv.offsetWidth / 2), 0);
    image(sec3, 0, floor(cnvDiv.offsetHeight / 2));
    image(sec4, floor(cnvDiv.offsetWidth / 2), floor(cnvDiv.offsetHeight / 2));

    snakeKeyPressed();

    sec1.snake.update();
    sec1.snake.show();

    sec2.snake.update();
    sec2.snake.show();

    sec3.snake.update();
    sec3.snake.show();

    sec4.snake.update();
    sec4.snake.show();

    if (sec1.snake.eat(sec1.food.x, sec1.food.y)) {
        sec1.food = new Food();
    }

    sec1.food.show();
}

// What happens when the snakes are moved?
// Could make a set direction function that takes an array of snakes
// as a rest parameter to improve code reusability 
function snakeKeyPressed() {
    if (keyCode === UP_ARROW) {
        sec1.snake.dir(0, -1);
        sec2.snake.dir(0, -1);
        sec3.snake.dir(0, -1);
        sec4.snake.dir(0, -1);
    } else if (keyCode === DOWN_ARROW) {
        sec1.snake.dir(0, 1);
        sec2.snake.dir(0, 1);
        sec3.snake.dir(0, 1);
        sec4.snake.dir(0, 1);
    } else if (keyCode === RIGHT_ARROW) {
        sec1.snake.dir(1, 0);
        sec2.snake.dir(1, 0);
        sec3.snake.dir(1, 0);
        sec4.snake.dir(1, 0);
    } else if (keyCode === LEFT_ARROW) {
        sec1.snake.dir(-1, 0);
        sec2.snake.dir(-1, 0);
        sec3.snake.dir(-1, 0);
        sec4.snake.dir(-1, 0);
    }
}

function Snake(x, y, xConstraint1, xConstraint2, yConstraint1, yConstraint2, r, g, b) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 0;

    this.update = () => {
        this.x += this.xSpeed * gridScale;
        this.y += this.ySpeed * gridScale;

        this.x = constrain(this.x, xConstraint1, xConstraint2);
        this.y = constrain(this.y, yConstraint1, yConstraint2);
    }

    this.show =  () => {
        fill(r, g, b);
        rect(this.x, this.y, gridScale, gridScale);
    }

    this.eat = (x, y) => {
        let d = dist(this.x, this.y, x, y);
        console.log('this.x:', this.x, ', this.y:', this.y, ', x:', x, ', y:', y)
        console.log(d);
        if (d < 3) {
            return true;
        } else {
            return false;
        }
    }

    this.dir = (x, y) => {
        this.xSpeed = x;
        this.ySpeed = y;
    }
}

function Food() {

    this.setXLocation = () => {
        let cols = floor(width/gridScale);
        return floor(random(cols)) * gridScale;
    }

    this.setYLocation = () => {
        let rows = floor(height/gridScale);
        return floor(random(rows)) * gridScale;
    }

    this.show = () => {
        fill(0, 0, 255);
        rect(this.x, this.y, gridScale, gridScale);
    }

    this.x = this.setXLocation();
    this.y = this.setYLocation();
}