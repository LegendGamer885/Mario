var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, backgroundImage,brickImage;

var jumpSound,gameOverSound,coinSound,marioCollideSound,backgroundSound;

var coinGroup, coinImage, coinArray = [];
var obstaclesGroup,obstacleArray = [], obstacle2, obstacle1,obstacle3;
var birckImage,brick,brickGroup;
var score=0;
var life ;

var gameOver, restart;

localStorage['HighestScore'] = 0;

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  backgroundImage = loadImage("backgroundImg.png");
  
  coinImage = loadImage("coin.png");
  brickImage = loadImage("Brick.jpg");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart2.png");

  jumpSound = loadSound("jumpSound.mp3");
  gameOverSound = loadSound("GameOver.mp3");
  coinSound = loadSound("coin.wav");
  marioCollideSound = loadSound("MarioCollide.mp3");
  backgroundSound = loadSound("backgroundSound.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mario = createSprite(100,650,20,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;

  ground = createSprite(width/2,height/2+ 300 ,12000,30);
  ground.x = ground.width/2;
  ground.shapeColor="limegreen"

  backgroundSound.play();
  backgroundSound.loop = true;
  backgroundSound.setVolume(1);
  
  gameOver = createSprite(width/2,150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,250);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.5;
  restart.scale = 0.15;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  brickGroup = new Group();
  
  score = 0;
  life = 5;
}

function draw() {
  background(backgroundImage);
  textSize(20);
  stroke('red');
  textFont('harrington')
  text("Score: "+ score, 20,20);
  
  
text("life: "+ life , 20,50);

  drawSprites();

  if (gameState===PLAY){
  // score = score + Math.round(frameCount%10 === 0);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && mario.y >= 600) {
      mario.velocityY = -25;
      jumpSound.play();
      jumpSound.setVolume(1);
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (coinGroup.isTouching(mario)){
      coinGroup[0].destroy();
      score+=5
      coinSound.play();
    }
    
    if(obstaclesGroup.isTouching(mario)){
      life--
      obstaclesGroup[0].destroy(); 
  } 
  
  if(brickGroup.isTouching(mario)){
    mario.collide(brickGroup);
  }

  if(mario.x < 0){
    mario.x = 100;
    mario.y = 650;
    mario.setVelocityX = 5;
  }

    if (life <= 0){
     gameState = END;
     gameOverSound.play();
     gameOverSound.setVolume(1);
    }
    
    mario.collide(ground);
    
    spawnCoin();
    spawnCoinAboveBrick();
    spawnBrick();
    spawnObstacles();
  
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    brickGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale = 0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnBrick(){
  if(frameCount % 70 === 0){
  brick = createSprite(width - 100,random(400,500),30,30);
  brick.addImage("brick",brickImage);
  brick.scale = 0.2;
  brick.velocityX = -5
  brick.lifetime = 400;
  brickGroup.add(brick);

  brick.depth = mario.depth;
  mario.depth = mario.depth + 1;
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var coin = createSprite(1500,625,40,10);
    coin.y = Math.round(random(450,600)); 
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 500;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);

    for(i = 0; i < coinArray.length; i++){
      coinArray[i].add(coinGroup);
    }
  }
}

function spawnCoinAboveBrick() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var coin = createSprite(width-100,625,40,10);
    coin.y = Math.round(random(350,450)); 
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 500;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);

    for(i = 0; i < coinArray.length; i++){
      coinArray[i].add(coinGroup);
    }
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1500,625,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
    for(i = 0; i < obstacleArray.length; i++){
      obstacleArray[i].add(obstaclesGroup);
    }
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  brickGroup.destroyEach();
  
  life = 5;
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  score = 0;
}