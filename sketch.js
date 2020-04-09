// Game board
let cnv;
// Game board container
let cnvDiv;
// Player 1
let snake1;
// Scale of our game (# of grids = (width * height / gridScale^2))
let gridScale = 20;
// Food singleton 
let food;

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
    snake1 = new Snake(0, 0, 255, 0, 0);
    food = new Food();
    frameRate(30);
}

// Resize the canvas when the window gets resized 
function windowResized() {
    cnvDiv = document.getElementById('canvas-container');
    cnv = resizeCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));
}

function draw() {
    background(100);
    snakeOneKeyPressed();
    snake1.update();
    snake1.show();
    food.show();
}

function snakeOneKeyPressed() {
    if (keyCode === UP_ARROW) {
        snake1.dir(0, -1);
    } else if (keyCode === DOWN_ARROW) {
        snake1.dir(0, 1);
    } else if (keyCode === RIGHT_ARROW) {
        snake1.dir(1, 0);
    } else if (keyCode === LEFT_ARROW) {
        snake1.dir(-1, 0);
    }
}

function Snake(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 0;

    this.update = () => {
        this.x += this.xSpeed * gridScale;
        this.y += this.ySpeed * gridScale;

        this.x = constrain(this.x, 0, width - gridScale);
        this.y = constrain(this.y, 0, height - gridScale);
    }

    this.show =  () => {
        fill(r, g, b);
        rect(this.x, this.y, gridScale, gridScale);
    }

    this.dir = (x, y) => {
        this.xSpeed = x;
        this.ySpeed = y;
    }
}

function Food() {

    this.setXLocation = () => {
        let cols = floor(width/gridScale);
        return floor(random(cols));
    }

    this.setYLocation = () => {
        let rows = floor(height/gridScale);
        return floor(random(rows));
    }

    this.show = () => {
        fill(0, 0, 255);
        rect(this.x * gridScale, this.y * gridScale, gridScale, gridScale);
    }

    this.x = this.setXLocation();
    this.y = this.setYLocation();
}