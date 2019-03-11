/* coin item animated */
/***super mario js*****/
const Coin = function(x, y, finalPosY) {
    this.x = x;
    this.y = y;
    this.finalPosY = finalPosY;

    const coinFrames = ["src/engine/graphics/coin/coin_1.gif",
    "src/engine/graphics/coin/coin_2.gif",
    "src/engine/graphics/coin/coin_3.gif",
    "src/engine/graphics/coin/coin_4.gif"];
    
    const coinValue = 200;

    preLoad(coinFrames);

    return {
        //drop coin when hit the mistery box
        dropCoin: () => {
            return {name: "coin", posx: this.x, posy: this.y, value: coinValue, frames: coinFrames, img: new Image, index: 0, finalPosY: this.finalPosY};
        },
        //create the coin on the stage, i will create this someday
        createCoin: () => {
            
        }
    }

    //preload the images
    function preLoad(object){
        var img = new Array();

        for(var i=0; i < object.length; i++){
            img[i] = new Image();
            img[i].src = object[i];
        }
}
}