// Start server by running "http-server -c-1" in project directory 

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

    // Creating 4 game sections of equal size to fit as a grid on the canvas  
    sec1 = createGraphics(halfWidth, halfHeight);
    sec1.background(123, 122, 211);
    sec2 = createGraphics(halfWidth, halfHeight);
    sec2.background(40, 74, 111);
    sec3 = createGraphics(halfWidth, halfHeight);
    sec3.background(243, 74, 111);
    sec4 = createGraphics(halfWidth, halfHeight);
    sec4.background(243, 255, 111);

    // Creating a new snake for each section and setting it in the upper left corner of the section
    sec1.snake = new Snake(0, 0, 0, halfWidth - gridScale, 0, halfHeight - gridScale, 255, 0, 0);
    sec2.snake = new Snake(halfWidth, 0, halfWidth, cnvDiv.offsetWidth - gridScale, 0, halfHeight - gridScale, 0, 255, 0);
    sec3.snake = new Snake(0, halfHeight, 0, halfWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 255, 0, 255);
    sec4.snake = new Snake(halfWidth, halfHeight, halfWidth, cnvDiv.offsetWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 255, 100, 100);

    // Initializing new food in  each section based on the sections constraints 
    sec1.food = new Food(0, halfWidth - gridScale, 0, halfHeight - gridScale, 1);
    sec2.food = new Food(halfWidth, cnvDiv.offsetWidth - gridScale, 0, halfHeight - gridScale, 2);
    sec3.food = new Food(0, halfWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 3);
    sec4.food = new Food(halfWidth, cnvDiv.offsetWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 4);

    // Setting the frame rate *DEPENDS ON DIFFICULTY 
    frameRate(30);
}

// Resize the canvas when the window gets resized 
function windowResized() {
    // Resize the canvas when the window is resized (this won't resize the actual graphics so the window must be refreshed upon resizing)
    cnv = resizeCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));
}

// Draw is a loop function that is continuously being called
function draw() {
    // Make the canvas white
    background(255);

    let halfWidth = floor(cnvDiv.offsetWidth / 2);
    let halfHeight = floor(cnvDiv.offsetHeight / 2);

    // Displaying the graphics overlays in the right locations 
    image(sec1, 0, 0);
    image(sec2, halfWidth, 0);
    image(sec3, 0, halfHeight);
    image(sec4, halfWidth, halfHeight);

    // Check if an arrow key is being pressed to move the snakes
    snakeKeyPressed();

    // Update the location of the snakes, and show them on the screen
    sec1.snake.update();
    sec1.snake.show();

    sec2.snake.update();
    sec2.snake.show();

    sec3.snake.update();
    sec3.snake.show();

    sec4.snake.update();
    sec4.snake.show();

    // If the snakes ate food, then spawn new food in a different random location 
    if (sec1.snake.eat(sec1.food.x, sec1.food.y)) {
        sec1.food = new Food(0, halfWidth - gridScale, 0, halfHeight - gridScale, 1);
    }
    if (sec2.snake.eat(sec2.food.x, sec2.food.y)) {
        sec2.food = new Food(halfWidth, cnvDiv.offsetWidth - gridScale, 0, halfHeight - gridScale, 2);
    }
    if (sec3.snake.eat(sec3.food.x, sec3.food.y)) {
        sec3.food = new Food(0, halfWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 3);
    }
    if (sec4.snake.eat(sec4.food.x, sec4.food.y)) {
        sec4.food = new Food(halfWidth, cnvDiv.offsetWidth - gridScale, halfHeight, cnvDiv.offsetHeight - gridScale, 4);
    }

    // Show the food overlays
    sec1.food.show();
    sec2.food.show();
    sec3.food.show();
    sec4.food.show();
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

// Snake constructor function 
function Snake(x, y, xConstraint1, xConstraint2, yConstraint1, yConstraint2, r, g, b) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 0;

    // Move the snake based on its current speed
    this.update = () => {
        this.x += this.xSpeed * gridScale;
        this.y += this.ySpeed * gridScale;

        // Constrain the snake to its own game section boundaries
        this.x = constrain(this.x, xConstraint1, xConstraint2);
        this.y = constrain(this.y, yConstraint1, yConstraint2);
    }

    this.show =  () => {
        fill(r, g, b);
        rect(this.x, this.y, gridScale, gridScale);
    }

    // Pass in the x and y coordinate of the food and return whether or not the snake is close enough to the food to eat it
    this.eat = (x, y) => {
        let d = dist(this.x, this.y, x, y);
        if (d < 10) {
            console.log('eaten');
            return true;
        } else {
            return false;
        }
    }

    // Set the direction of the snake based on the arrow key pressed
    this.dir = (x, y) => {
        this.xSpeed = x;
        this.ySpeed = y;
    }
}

// Food constructor class
function Food(xConstraint1, xConstraint2, yConstraint1, yConstraint2, sec) {

    this.setXLocation = () => {
        // Get the number of columns based on the grid scale
        let cols = floor((xConstraint2 - xConstraint1) / gridScale);
        // Spawn food in a random column (working with whole numbers)
        return floor(random(cols)) * gridScale;
    }

    this.setYLocation = () => {
        // Get the number of rows based on the grid scale
        let rows = floor((yConstraint2 - yConstraint1) / gridScale);
        // Spawn food in a random row (working with whole numbers)
        return floor(random(rows)) * gridScale;
    }

    this.show = () => {
        fill(0, 0, 255);
        // x-pos, y-pos, width, height
        rect(this.x, this.y, gridScale, gridScale);
    }

    // Set location based on section 1 (upper left section)
    this.x = this.setXLocation();
    this.y = this.setYLocation();

    // Depending on the game section this food is in, relatively update its location 
    if (sec === 2) {
        this.x += xConstraint1;
    } else if (sec === 3) {
        this.y += yConstraint1;
    } else if (sec === 4) {
        this.x += xConstraint1;
        this.y += yConstraint1;
    }
}