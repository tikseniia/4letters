let r1 = 0;
let r2 = 0;
let rx = 1;
let ry = 1;
let x, y, px, py;

let cnv;
let movers = new Array;
let H = window.innerHeight;
let W = window.innerWidth;
let timer;
const timeWeHave = 15;
let time = timeWeHave;
let timeLeft = true;
let t = "Ой,\nдалеко мы так не уедем.\nДавай-ка соберемся еще раз";
let c = 'rgb(20, 30, 48)'

let animated = false;
let speed = 30;
let lineX = 0;
let lineY = 0;

let btnClean;
let btnRestart;
let btnStop;

function setup() {
    cnv = createCanvas(W, H);
    background('#eeeeee');
    frameRate(60);
    btnRestart = createButton('запустить');
    btnRestart.position(W-600, 10);
    btnRestart.mousePressed(restartDrawing);
    btnRestart.addClass('btn-grad btn-grad--pink');

    btnClean = createButton('очистить');
    btnClean.position(W-400, 10);
    btnClean.mousePressed(() => {background('#eeeeee')});
    btnClean.addClass('btn-grad btn-grad--grey');

    btnStop = createButton('готово');
    btnStop.position(W-200, 10);
    btnStop.mousePressed(saveImg);
    btnStop.addClass('btn-grad btn-grad--blue');
  
  for(var i = 0; i < 5; i++) {
      movers.push(new randMove());
  }
}

function draw() {
  fill(0);
  textSize(32);
  textAlign(LEFT, BOTTOM);
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = '#eeeeee';
  stroke('#eeeeee');
  text(`◷ ${time}c`, 20, 60);

    if (!timeLeft) {
        finalStage(t, c);
    }

    if (animated) {
        background('#eeeeee');
        drawingContext.shadowOffsetX = 0;
          drawingContext.shadowOffsetY = 0;
          drawingContext.shadowBlur = 20;
          drawingContext.shadowColor = '#eeeeee';
          stroke('#eeeeee');
          text(`◷ ${time}c`, 20, 60);

          drawingContext.shadowBlur = 0;
        strokeWeight(30);
        stroke('#114357');
        line(lineX, 0, lineX, H);
        line(0, lineY, W, lineY);
        lineX = lineX + speed;
        lineY = lineY + speed;
        if (lineX > width+200) {
          speed = -(speed);
          if (timeLeft) {
              animated = false;
          }
        } else if (lineX + 100 < 0) {
          speed = 50;
        }
    }
}

function mouseDragged() {
    if (timeLeft) {
        // drawingContext.shadowOffsetX = 0;
        // drawingContext.shadowOffsetY = 0;
        // drawingContext.shadowBlur = 5;
        // drawingContext.shadowColor = 'black';

        drawingContext.shadowBlur = 0;
        stroke('black');
        // stroke('#484848');
        strokeWeight(10);
        // fill('#484848');
        // noFill();

        let xy = getCoors(mouseX, mouseY);
        let pxy = getCoors(pmouseX, pmouseY);
        if (xy[1] > 60) {
            line(xy[0], xy[1], pxy[0], pxy[1]);
        }
        // circle(mouseX * 1.5, H - mouseY, 20);
        // circle(x, y, 10);
    }
}

const restartDrawing = () => {
    background('#eeeeee');
    time = timeWeHave;
    timeLeft = true;
    animated = true;

    r1 = random(-2/3, 2/3);
    r2 = random(-2/3, 2/3);
    rx = random(-1, 1)*r1;
    ry = random(-1, 1)*r2;

    stroke('black');
    strokeWeight(10);
    line(W-W*r1, 0, W-W*r1, H-H*r2);
    line(0, H-H*r2, W-W*r1, H-H*r2);

    $.ajax({
      type: "POST",
      url: "/new-nums",
      data: {}
    }).done(function(data) {
        console.log(data);
        window.clearInterval(timer);
        timer = window.setInterval(function(){
        if(time <= 0){
            window.clearInterval(timer);
            background('#eeeeee');
            t = "Коллеги,\nдалеко мы так не уедем.\nДавайте-ка соберемся\nи сделаем уже нормально";
            c = 'rgb(20, 30, 48)'
            timeLeft = false;
        } else {
            time -= 1;
            if (time < 10) {
                time = `0${time}`;
            }
        }
    }, 1000);
    });
}

const getCoors = (x, y) => {
    // x = W/2 + x;
    // y = H/2 + y;
    // x = W/2 + x;
    // y = y;
    x = W*r1 + x;
    y = H*r2 + y;
    // return x * r1, H - r2*y;
    return [ x, y ];
}

function randMove() {
    this.x = random(height);
    this.y = random(width);

    this.render = function(color) {
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = color;
        // rgb(113, 178, 128)
      
        stroke('rgb(20, 30, 48)');
        strokeWeight(0.5);
        fill('rgba(255,255,255,0.5)');
        rect(this.x, this.y, 40);
    };

    this.move = function() {
        var temp = 20;
        var choice = floor(random(4));

        if(choice == 0) {
            this.x += temp;
        }
        else if(choice == 1) {
            this.y += temp;
        }
        if(choice == 2) {
            this.x -= temp;
        }
        else if(choice == 3) {
            this.y -= temp;
        }

        this.x = constrain(this.x, 0, width - 1);
        this.y = constrain(this.y, 0, height - 1);
    };
}

const saveImg = () => {
    window.clearInterval(timer);

    let newH = H*r2 > 100 ? H*r2 : 100;
    var imageContentRaw = canvas.getContext('2d').getImageData(W*r1,newH,canvas.width,canvas.height);
    var cnv = document.createElement('canvas');
    cnv.width = canvas.width;
    cnv.height = canvas.height;
    cnv.getContext('2d').putImageData(imageContentRaw, 0, 0);

    const dataURL = cnv.toDataURL();

    animated = true;

    $.ajax({
      type: "POST",
      url: "/upload",
      data: {
         img: dataURL
      }
    }).done(function(data) {
        animated = false;
        if (data['data'].length > 0) {
            t = `Ура, с каждым днем все ближе друг к другу. Я тоже вижу у тебя это: ${join(data['data'], ',')}`;
            c = 'rgb(113, 178, 128)';
        } else {
            t = "Ой,\nничего не понятно.\nДавай еще раз.";
            c = 'rgb(20, 30, 48)'
        }
        timeLeft = false;

        setTimeout(() => {
            timeLeft = true;
            background('#eeeeee');
            }, 6000);
    });
}


const finalStage = (t, color) => {
    textAlign(CENTER, CENTER);
    textSize(24);
    text(t, W/2, H/2);
    for (var i = 0; i < movers.length; i++) {
        movers[i].move();
        movers[i].render(color);
    }
}