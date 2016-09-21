//canvasClock.ts transpiles to canvasClock.js
const CGreen = '#3f9', CPurp = '#93f', CBlue = '#39f';

function drawClock() {
    drawFace(ctx, radius);
    drawTime(ctx, radius);
    drawNumbers(ctx, radius);
}

function drawFace(ctx, radius) {
    ctx.shadowColor = "transparent";
    var grad = ctx.createRadialGradient(0,0,radius*0.65, 0,0,radius*1.05);
    grad.addColorStop(0, CGreen);
    grad.addColorStop(1, '#000');

    //main circle
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2*Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill(); //fills inside of face black
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.1;
    ctx.stroke(); //draws outer rim of face

    ctx.fillStyle = '#333'; //sets fill to gray to highlight any mistakes

    //hour ticks
    ctx.beginPath();
    ctx.lineCap = "square";
    ctx.lineWidth = radius*0.04;
    ctx.moveTo(0, 0);
    for (var tick = 0; tick < 12; tick++) {
        ctx.moveTo(0, -radius * (tick % 3 ? 0.9 : 0.8)); //big ticks on quarters
        ctx.lineTo(0, -radius * 0.95);
        ctx.moveTo(0, 0);
        ctx.rotate(Math.PI / 6);
    }
    ctx.stroke(); //stroke with grad

    ctx.strokeStyle = CGreen; //reset stroke style to green before leaving
}

function drawNumbers(ctx, radius) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var now = new Date();

    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    //hour
    let hour : string = (now.getHours() % 12).toString(); //convert from 24-hr
    if (hour === '0') hour = '12';

    //minutes
    let minutes : number | string = now.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes.toString();
    } else {
        minutes = minutes.toString();
    }

    //date
    let day : string = daysOfWeek[now.getDay()] + " " + now.getMonth() + "/" + now.getDate();

    ctx.textBaseline="middle";
    ctx.textAlign="center";

    drawTextWithShadow(ctx, hour, CPurp, radius*0.4, 0, 0);
    drawTextWithShadow(ctx, minutes, CGreen, radius*0.12, 0, radius*0.25);
    drawTextWithShadow(ctx, day, CBlue, radius*0.1, 0, -radius*0.25);
}

function drawTextWithShadow(ctx, text, color, scale_px, x, y) {
    ctx.shadowBlur = scale_px * 0.8;
    ctx.font = "bold " + scale_px + "px arial";
    ctx.fillStyle = 'black'; //black text until final layer

    for (var i=0; i < 4; i++){ //4(+1 for final) shrinking layers of shadow for visibility
        ctx.fillText(text, x, y);
        ctx.shadowBlur *= 0.8;
    }
    ctx.fillStyle = color; //final text layer in correct color (with shadow)
    ctx.fillText(text, x, y);
}

function drawTime(ctx, radius){
    var now = new Date();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    //minute
    ctx.strokeStyle = CGreen;
    minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.85, radius*0.04, "line");

    // second
    ctx.fillStyle = CBlue;
    second = (second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.03, "circle");
}

function drawHand(ctx, pos, length, width, type) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos); //rotate ctx to position in rads
    if (type === "line") { //hand for minutes
        ctx.lineTo(0, -length);
        ctx.stroke();
    } else if (type === "circle") { //dot for seconds
        ctx.arc(0, -length, width, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.moveTo(0,0);
    }
    ctx.rotate(-pos); //rotate ctx back
}

// Main
let canvasClock = document.getElementById("canvas-clock") as HTMLCanvasElement;
let ctx = canvasClock.getContext("2d");
let radius = canvasClock.height / 2;
ctx.translate(radius, radius); //set (0, 0) to center of canvas
radius = radius * 0.90;
drawClock();
setInterval(drawClock, 1000);