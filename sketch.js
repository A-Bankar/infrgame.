
//Declare variables for game objects and behaviour indicators(FLAGS)
var man, man_running, man_collided;
var ground, invisibleGround, groundImage;
var obs, Obs, obs1, ob2, ob3, obs4, obs5, obs5, obs6;
var obsGrp;

var cloud, cloudImg, cloudGrp;

var score, HiScore, displayHiScore;

var gameState, PLAY, END;

var restartIcon, restartImg;
var gameOver, gameOverImg;

var die,checkPoint,jump;

//Create Media library and load to use it during the course of the software //executed only once at the start of the program

function preload() {
  man_running = loadAnimation("man1.jpg","man2.jpg", "man3.jpg", "man4.jpg");
  man_collided = loadImage("man4.jpg");

  groundImage = loadImage("ground2.png");

  obsImg = loadImage("oi.png");
  restartImg = loadImage("rs.png");

  gameOverImg = loadImage("gm.jpg");

  backgroundImg = loadImage("bg69.jpg")
  
}

//define the intial environment of the software(before it is used) //by defining the declared variables with default values //executed only once at the start of the program

function setup() {

  createCanvas(600, 300);

  //create a man sprite
  man = createSprite(50, height-50, 20, 50);
  man.addAnimation("running", man_running);
  man.addAnimation("collided", man_collided);
  man.scale = 0.4;
  man.debug = false;
  man.setCollider("rectangle", 0, 0, 81, 80);

  //create a ground sprite
  ground = createSprite(600, height-20, 40, 20);
  ground.x = ground.width / 2;
  ground.visible = false;


  //creating invisible ground
  invisibleGround = createSprite(300, height-50, 600, 10);
  invisibleGround.depth = man.depth-1;
  invisibleGround.visible = false;
  obsGrp = createGroup();

  PLAY = 1;
  END = 0;
  gameState = PLAY;

  score = 0;
  HiScore = 0;
  displayHiScore = false;

  gameOver = createSprite(300, 150, 20, 20);
  gameOver.addImage("gameOverImg", gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restartIcon = createSprite(300, 50, 20, 20);
  restartIcon.addImage("restartImg", restartImg);
  restartIcon.scale = 0.05;
  restartIcon.visible = false;
}

//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw. //All commands to be executed, checked continously, applied throughout the program are written inside function draw. //function draw is executed for every frame created since the start till it stops.
function draw() {
  //set background color

  clear();
  let display = touches.length + ' touches';  
  text(display, 350  , 100);

  background(backgroundImg );

  

  textSize(10);
  textSize(13)
  fill("green");
  text("SCORE : " + score, width-100, 40);


  if (gameState == PLAY) {

    score = score + Math.round(frameCount / 600);
    if (displayHiScore == true) {
         text("HiScore:  " + HiScore, width-200,40 );
    }

    gameOver.visible = false;
    restartIcon.visible = false;

    // jump when the space key is pressed

    if (((touches.length == 1 || keyDown ("space")) &&man.y >= 200)){
      man.velocityY = -14;
      touches=[];
    }
    man.velocityY = man.velocityY + 0.9;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    ground.velocityX = -(2 + score/800);

    //Spawn Clouds
    createObs();

    if (obsGrp.isTouching(man)) {
      gameState = END;
    }
  } else if (gameState == END) {
    man.changeAnimation("collided", man_collided);
    man.velocityY = 0;

    ground.velocityX = 0;

    obsGrp.setVelocityXEach(0);
    obsGrp.setLifetimeEach(-1);
  
    gameOver.visible = true;
    restartIcon.visible = true;

    if (score > HiScore) {
      HiScore = score;
    }
    text("HiScore:  " + HiScore, width-200,40);

    if (mousePressedOver(restartIcon)) {
      gameState = PLAY;
      obsGrp.destroyEach();
      man.changeAnimation("running", man_running);
      score = 0;
      displayHiScore = true;
    }
  }


  //stop man from falling down
  man.collide(invisibleGround);

  drawSprites();
}

//function to spawn the clouds

function createObs() {
  if (frameCount % 200 == 0) {
    obs = createSprite(width, height-40, 20, 20);
    obs.velocityX = -(4+score/200);
    obs.lifetime = -(width/obs.velocityX);
    obs.addImage("obsImg",obsImg);
    obs.scale = 0.09;
    obsGrp.add(obs);
    obsGrp.depth = gameOver.depth-1;

  }
}