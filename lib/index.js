/**
 * Created by duanshanchong on 14-8-26.
 */
//window.addEventListener('click', function(e) {
//    e.preventDefault();
//}, false);


var screenObjects = [];
var startTime = null;

var columnWidth = 640/12;

var resources = [
    {'name': 'car1', src: 'images/car1.png', type: 'images'},
    {'name': 'car2', src: 'images/car2.png', type: 'images'},
    {'name': 'car3', src: 'images/car3.png', type: 'images'},
    {'name': 'car4', src: 'images/car4.png', type: 'images'},
    {'name': 'car5', src: 'images/car5.png', type: 'images'},
    {'name': 'car_p', src: 'images/car_p.png', type: 'images'},
    {'name': 'saint', src: 'images/saint.png', type: 'images'},
    {'name': 'soldier', src: 'images/soldier.png', type: 'images'},
    {'name': 'tree', src: 'images/tree.png', type: 'images'},
    {'name': 'road', src: 'images/road.png', type: 'images'},
    {'name': 'bike', src: 'images/bike.png', type: 'images'}
];
resourceLoader.onProgress = function(e){
    loadScreen.setProgress(e.loadedCount / e.totalCount);
};

resourceLoader.onComplete = function(){
    ScreenObjPool.remove(loadScreen);
    showWelcome();
};
var loadScreen = new LoadScreen();

MainApp.init();

MainApp.startRun();

ScreenObjPool.add(loadScreen);

resourceLoader.load(resources);

function showWelcome(){
    var logo = new TextEntityObject('加油西长安！', new Vector(230, 150), {fillStyle: '#900', font: 'bold 24px 微软雅黑', 'textBaseline': 'top'}, 100, 35);

    var welcome = new TextEntityObject('点击开始', new Vector(240, 310), {fillStyle: '#333', font: 'bold 24px 微软雅黑', 'textBaseline': 'top'}, 100, 35);
    MainApp.addEventListener(welcome, 'mouseover', function(e){
        welcome.setStyle({fillStyle: '#999'});
    });

    MainApp.addEventListener(welcome, 'mouseout', function(e){
        welcome.setStyle({fillStyle: '#333'});
    });

    MainApp.addEventListener(welcome, 'click', function(e){
        startGame();

        ScreenObjPool.remove(logo);
        ScreenObjPool.remove(welcome);
    });
    ScreenObjPool.add(logo);
    ScreenObjPool.add(welcome);

}
var SCORE = 0;
function startGame(){
    var road = new ImageEntityObject(resourceLoader.get('road'), new Vector(0, 0), Screen.WIDTH, Screen.HEIGHT);
    ScreenObjPool.add(road);

    var images = [];
    images.push(resourceLoader.resources.car1);
    images.push(resourceLoader.resources.car2);
    images.push(resourceLoader.resources.car3);
    images.push(resourceLoader.resources.car4);
    images.push(resourceLoader.resources.car5);

    for(var i = 0; i < 3; i++){
        var img =  images[util.random(0, images.length - 1)];
//        img.width = columnWidth*4;

        var newCar = new Car(new Vector(i * columnWidth*4 + columnWidth*2, window.util.random(-480, -80)), window.util.randomColor(), img);
        newCar.hitable = true;
        ScreenObjPool.add(newCar);
    }

	var tree = new Magic(new Vector(370, 0), resourceLoader.get('tree'), Magic.ANIM_TYPE.HORIZONTAL, 50);
	ScreenObjPool.add(tree);

	var bike = new Magic(new Vector(500, 0), resourceLoader.get('bike'), Magic.ANIM_TYPE.HORIZONTAL, 73);
	ScreenObjPool.add(bike);

    var leftC = new CollisionEntityObject(new Vector(0, 0), 150, 480);
    var rightC = new CollisionEntityObject(new Vector(350, 0), 20, 480);
    var topC = new CollisionEntityObject(new Vector(0, 0), 640, 40);
    var bottomC = new CollisionEntityObject(new Vector(0, Screen.HEIGHT), 640, 10);
    var cMap = new CollistionMap();
    cMap.add(leftC);
    cMap.add(rightC);
    cMap.add(topC);
    cMap.add(bottomC);
    var myCar = new Car(new Vector(300, 390), window.util.randomColor(), resourceLoader.resources.car_p, new Vector(0, 0));
    myCar.setCollisionMap(cMap);
    MainApp.addEventListener(myCar, 'keyup', function(e){
        var KEY = MainApp.INPUT.KEY;
        switch(e.which){
            case KEY.UP:
                if(KEY_LOCK.UP){
                    this.speed.remove(new Vector(0, -200));
                    KEY_LOCK.UP = false;
                }
                break;
            case KEY.DOWN:
                if(KEY_LOCK.DOWN){
                    this.speed.remove(new Vector(0, 200));
                    KEY_LOCK.DOWN = false;
                }
                break;
            case KEY.LEFT:
                if(KEY_LOCK.LEFT){
                    this.speed.remove(new Vector(-200, 0));
                    KEY_LOCK.LEFT = false;
                }
                break;
            case KEY.RIGHT:
                if(KEY_LOCK.RIGHT){
                    this.speed.remove(new Vector(200, 0));
                    KEY_LOCK.RIGHT = false;
                }
                break;
        }
    });

    MainApp.addEventListener(myCar, 'keydown', function(e){
        var KEY = MainApp.INPUT.KEY;
        switch(e.which){
            case KEY.UP:
                if(!KEY_LOCK.UP){
                    myCar.speed.add(new Vector(0, -200));
                    KEY_LOCK.UP = true;
                }
                break;
            case KEY.DOWN:
                if(!KEY_LOCK.DOWN){
                    myCar.speed.add(new Vector(0, 200));
                    KEY_LOCK.DOWN = true;
                }
                break;
            case KEY.LEFT:
                if(!KEY_LOCK.LEFT){
                    myCar.speed.add(new Vector(-200, 0));
                    KEY_LOCK.LEFT = true;
                }
                break;
            case KEY.RIGHT:
                if(!KEY_LOCK.RIGHT){
                    myCar.speed.add(new Vector(200, 0));
                    KEY_LOCK.RIGHT = true;
                }
                break;
        }

    });

    MainApp.addEventListener(myCar, 'hit', function(e){
        ScreenObjPool.empty();
        MainApp.emptyEventsPool();
        KEY_LOCK = {
            LEFT: false,
            RIGHT: false,
            UP: false,
            DOWN: false
        }
        endGame(score.score);
    });
    ScreenObjPool.add(myCar);
    return;

    var scorePre = new TextEntityObject('Score: ', new Vector(50, 5), {fillStyle: '#fff', font: 'bold 32px 微软雅黑', 'textBaseline': 'top'}, 100, 35);
    ScreenObjPool.add(scorePre);
    //var score = new TextEntityObject('0', new Vector(160, 5), {fillStyle: '#fff', font: 'bold 32px 微软雅黑', 'textBaseline': 'top'}, 100, 35);
    var score = new GameScore(0, new Vector(160, 5));
    ScreenObjPool.add(score);



}


function endGame(score){

    var end = new TextEntityObject('GAME OVER', new Vector(120, 150), {fillStyle: '#900', font: 'bold 64px 微软雅黑', 'textBaseline': 'top'}, 100, 35);

    ScreenObjPool.add(end);

    var score = new TextEntityObject('Score: ' + ~~score, new Vector(240,240), {fillStyle: '#000', font: 'bold 32px 微软雅黑', 'textBaseline': 'top'}, 100, 35);
    ScreenObjPool.add(score);

    var restart = new TextEntityObject('重新开始', new Vector(267, 310), {fillStyle: '#333', font: 'bold 24px 微软雅黑', 'textBaseline': 'top'}, 100, 35);
    MainApp.addEventListener(restart, 'mouseover', function(e){
        restart.setStyle({fillStyle: '#999'});
    });


    MainApp.addEventListener(restart, 'mouseout', function(e){
        restart.setStyle({fillStyle: '#333'});
    });

    ScreenObjPool.add(restart);

    MainApp.addEventListener(restart, 'click', function(e){
        ScreenObjPool.remove(end);
        ScreenObjPool.remove(restart);

        startGame();
    });

}
var KEY_LOCK = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false
}
