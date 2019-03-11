/*
*****Super marario js
**tulio calil
*/

//Canvas configuration
var canvasConfig = {
    height: 500,
    width: 1000
}
//Setup the canvas on the html page
var canvas = document.getElementById("jogo");
canvas.height = canvasConfig.height;
canvas.width = canvasConfig.width;
//Get the canvas context
var contexto = canvas.getContext("2d");

//Config the objets that will rendered
//on the scene
var objectsScene = {};
var animationSceneRender = true;
var objSceneCount = 0;
//Audio load
var backgroundAudio = new Audio('audio/smb_background.mp3');
var audioJump = new Audio('audio/smb_jump-small.wav');
var audioCoin = new Audio('audio/smb_coin.wav');
//Some options
var debug = false;
var menu = true;
//get the floor limit, i will use this for the 
//death system in the future
var floor = canvasConfig.height - 128;
//Player sprite config
var playerSprite = new Image;
playerSprite.src = "src/engine/graphics/mario/jump/jumping.png";
var menuLogo = new Image;
menuLogo.src = "src/engine/graphics/menu/logo_menu.png";
var iconSelector = new Image;
iconSelector.src = "src/engine/graphics/menu/selector_icon.png";
var background = new Image;
background.src = "src/engine/graphics/fundo.jpg";
var misteryBlock = new Image;
misteryBlock.src = "src/engine/graphics/block.png";

//I will update this after, make the sprite and
//config in one object like the coin object
var misteryBlockConfig = {
    width: 40,
    height: 40,
    posX: 750,
    posY: 300,
}

//Animation controller for player
//I will update this after, make the sprite and
//config in one object like the coin object
var playerAnim = {
    framesRight:["src/engine/graphics/mario/walk/right/1.gif",
    "src/engine/graphics/mario/walk/right/2.gif",
    "src/engine/graphics/mario/walk/right/3.gif",],
    framesLeft:["src/engine/graphics/mario/walk/left/1.gif",
    "src/engine/graphics/mario/walk/left/2.gif",
    "src/engine/graphics/mario/walk/left/3.gif",],
    framesJump: ["src/engine/graphics/mario/jump/jumping.png", 
    "src/engine/graphics/mario/jump/jumping_left.png"],
    index: 0,
    height: 60,
    width: 40,
    direction: 1,
}
//Object that receive the player input
//and store to use in the controller
var keyMapController = {};
//Player object, store the positions,
//if grounded, points and more options.
var player = {
    posX: 1,
    posY: 1,
    grounded: false,
    velocity: 5,
    points: 0,
    walking: false,
    blockCollider: false,
}

//Update interval for controller
//and animations
setInterval(function(){ 
    controllerListener();
 }, 30);
 setInterval(function(){ 
    animation();
 }, 50);

//Start the game when load complete.
window.onload = function() {
    if(!menu){
        startGame();
    }else{
        drawMenu();
    }
};

function startGame(){
    draw(player.posX,player.posY);
    gravity();
    backgroundAudio.load();
    backgroundAudio.play();
}

function enableGravity(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        player.posY += x;
        if(playerAnim.direction === 1 && player.walking){
           // player.posX += x*0.4;
        }else if(playerAnim.direction === -1 && player.walking){
           // player.posX -= x*0.4;
        }
        draw(player.posX, player.posY);
        gravity();
      }, 10);
    });
  }

function jump(y) {
return new Promise(resolve => {
    setTimeout(() => {
        player.posY -= y;
        draw(player.posX, player.posY);
        jumping();
    }, 10);
});
}


function jumping() {
    if(player.posY > floor-100){
        player.grounded = false;
        //check if colission with block
        if(!checkBlockCollision()){
            player.blockCollider = false;
            jump(3);
        }else{
            player.blockCollider = true;
        }
    }else{
        gravity();
    }
}

//I will modificate this function cause
//acutuly he check just one object (misteryBlock)
//and i its need to check all, include the coins
function checkBlockCollision(){
var xmin = (misteryBlockConfig.posX - misteryBlockConfig.width);
var xmax = (misteryBlockConfig.posX + misteryBlockConfig.width) -10;
var ymin = (misteryBlockConfig.posY - misteryBlockConfig.height);
var ymax = (misteryBlockConfig.posY + misteryBlockConfig.height);

var xminH = (misteryBlockConfig.posX - misteryBlockConfig.width) - 5;
var xmaxH = (misteryBlockConfig.posX + misteryBlockConfig.width) -10;
var yminH = (misteryBlockConfig.posY - misteryBlockConfig.height);
var ymaxH = (misteryBlockConfig.posY + misteryBlockConfig.height) -5;

    var collision = false;
    if(player.posX >= xminH && player.posX <= xmaxH){
        if(player.posY >= yminH && player.posY <= ymaxH){
            console.log("lado");
            collision = true;
            player.walking = false;
            gravity();
        }
    }
    if(!collision){
        if(player.posX >= xmin && player.posX <= xmax){
            if(player.posY >= ymin && player.posY <= ymax){
                //hit the misteryBlock and drop coins
                if(!player.grounded){
                    //instantiate the coin
                    var a = new Coin(misteryBlockConfig.posX, misteryBlockConfig.posY-misteryBlockConfig.height, misteryBlockConfig.posY-70);
                    var coin = a.dropCoin();
                    objectsScene[objSceneCount] = coin;
                    objSceneCount++;
                    audioCoin.load();
                    audioCoin.play();
                    player.points += 200;
                    collision = true;
                    player.walking = false;
                    gravity();
                }
            }
        }
    }
    return collision;
}

function gravity() {
    if(player.posY < floor){
        enableGravity(3);
    }else{
        //set the grounded state, sprite and direction
        player.grounded = true;
        player.walking = false;
        if(playerAnim.direction === -1 && !player.walking){
            playerSprite.src = playerAnim.framesLeft[2];
        }else if(playerAnim.direction === 1 && !player.walking){
            playerSprite.src = playerAnim.framesRight[2];
        }
        draw(player.posX, player.posY);
    }
}

onkeydown = onkeyup = function(e){
    e = e || event;
    keyMapController[e.keyCode] = e.type == 'keydown';
    
    if(e.type === 'keyup'){
        if(player.grounded){
            player.walking = false;
            if(playerAnim.direction === -1 && !player.walking){
                playerSprite.src = playerAnim.framesLeft[2];
            }else if(playerAnim.direction === 1 && !player.walking){
                playerSprite.src = playerAnim.framesRight[2];
            }
            draw(player.posX, player.posY);
        }
    }
}

//animte objects in objectsScene
function animation(){
    if(!menu){
        Object.keys(objectsScene).forEach(function (key) {
            var posYTemp = objectsScene[key].posy;
            if(objectsScene[key].index < objectsScene[key].frames.length){
                objectsScene[key].img.src = objectsScene[key].frames[objectsScene[key].index];
                objectsScene[key].index ++;
            }else{
                objectsScene[key].index = 0;
            }
            if(objectsScene[key].finalPosY != 0){
                console.log(objectsScene[key].posy, objectsScene[key].finalPosY);
                if(objectsScene[key].posy < objectsScene[key].finalPosY){
                    objectsScene[key].posy += 3;
                    if(objectsScene[key].posy >= objectsScene[key].finalPosY){
                        delete objectsScene[key];
                    }
                }else if(objectsScene[key].posy > objectsScene[key].finalPosY){
                    objectsScene[key].posy -= 3;
                    if(objectsScene[key].posy <= objectsScene[key].finalPosY){
                        delete objectsScene[key];
                    }
                }
            }
            draw(player.posX, player.posY);
        });
    }   
}

function draw(x,y) {
    contexto.restore();
    contexto.drawImage(background, 0, 0, canvasConfig.width, canvasConfig.height);
    contexto.drawImage(playerSprite, x, y, playerAnim.width, playerAnim.height);
    
    //mistery block
    contexto.drawImage(misteryBlock, misteryBlockConfig.posX, 
        misteryBlockConfig.posY, misteryBlockConfig.width, misteryBlockConfig.height);
    
    contexto.font = '20px pressStart';
    contexto.fillStyle = 'white';
    contexto.fillText  ('Mario', 20, 30);
    contexto.fillText  (("000000" + player.points).slice(-6), 20, 55);

    //draw objects in the objectsScene
    Object.keys(objectsScene).forEach(function (key) {
        contexto.drawImage(objectsScene[key].img, objectsScene[key].posx, objectsScene[key].posy, 40, 40);
    });

    //Debug show player position on the canvas
    if(debug){
        contexto.fillText  ('posX ' + player.posX, 20, 76);
        contexto.fillText  ('posY ' + player.posY, 20, 96);
    }
    contexto.save()
}

//Draw the menu screen
function drawMenu() {
    if(menu){
        contexto.drawImage(background, 0, 0, canvasConfig.width, canvasConfig.height);
        contexto.drawImage(playerSprite, 10, 355, playerAnim.width, playerAnim.height);
        contexto.drawImage(menuLogo, 200, 5, 600, 280);
        contexto.drawImage(iconSelector, 345, 334, 20, 20);

        contexto.font = '20px pressStart';
        contexto.fillStyle = 'white';
        contexto.fillText  ('MARIO', 20, 30);
        contexto.fillText  ('2019 TULIO CALIL', 485, 307);
        contexto.fillText  ('1 PLAYER GAME', 385, 355);
        contexto.fillStyle = 'grey';
        contexto.fillText  ('2 PLAYER GAME', 385, 395);
        contexto.fillStyle = 'white';
        contexto.fillText  (("000000" + player.points).slice(-6), 20, 55);
    }
}

//Listener the key status on the 
//keyObjectController to do the actions 
function controllerListener() {
    //Right
    if(!menu){
    if(keyMapController[68]){
        if(player.grounded){
            player.walking = true;
            player.posX += player.velocity;
            playerAnim.direction = 1;
            if(playerAnim.index<playerAnim.framesRight.length){
                if(debug){
                    console.log("Frames right: " + playerAnim.framesRight + " frame atual: "+ playerSprite.src);
                }
                playerSprite.src = playerAnim.framesRight[playerAnim.index];
                playerAnim.index++;
            }else{
                playerAnim.index = 0;
            }
        }else if(!player.blockCollider){
            //control the player on air
            player.posX += player.velocity;
        }
        draw(player.posX, player.posY);
    }
    //Left
    if(keyMapController[65]){
        if(player.grounded){
            player.walking = true;
            player.posX -= player.velocity;
            playerAnim.direction = -1;
            if(playerAnim.index<playerAnim.framesLeft.length){
                playerSprite.src = playerAnim.framesLeft[playerAnim.index];
                playerAnim.index++;
            }else{
                playerAnim.index = 0;
            }
    }else if(!player.blockCollider){
        //control the player on air
        player.posX -= player.velocity;
    }
        draw(player.posX, player.posY);
    }
    //Jump action
    if(keyMapController[87]){
        if(player.grounded){
            if(playerAnim.direction === 1){
                playerSprite.src = playerAnim.framesJump[0];
            }else if(playerAnim.direction === -1){
                playerSprite.src = playerAnim.framesJump[1];
            }
            audioJump.load();
            audioJump.play();
            jumping();
        }
    }
    }else{
        //when press enterkey start the game
        if(keyMapController[13]){
            audioCoin.play();
            menu = false;
            startGame();
        }
    }
}