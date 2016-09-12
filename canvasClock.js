const CGreen = '#3f9', CPurp = '#93f', CBlue = '#39f';

function drawClock() {
    drawFace(ctx, radius);
    drawTime(ctx, radius);
    drawNumbers(ctx, radius);
}

function drawFace(ctx, radius) {
    ctx.shadowColor = "transparent";
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2*Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    grad = ctx.createRadialGradient(0,0,radius*0.65, 0,0,radius*1.05);
    grad.addColorStop(0, CGreen);
    grad.addColorStop(1, '#000');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.1;
    ctx.stroke();

    // ctx.beginPath();
    // ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
    ctx.fillStyle = '#333';
    // ctx.fill();

    ctx.beginPath();
    //ctx.strokeStyle = "#3f9";
    ctx.lineCap = "square";
    ctx.lineWidth = radius*0.04;
    ctx.moveTo(0, 0);
    for (var tick = 0; tick < 12; tick++) {
        ctx.moveTo(0, -radius * (tick % 3?.9:.8));
        ctx.lineTo(0, -radius * .95);
        ctx.moveTo(0, 0);
        ctx.rotate(Math.PI / 6)
    }
    ctx.stroke();

    ctx.strokeStyle = CGreen;
}

function drawNumbers(ctx, radius) {
    // var ang;
    // var num;
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    ///////
    var now = new Date();
    var hour = now.getHours() % 12;
    if (hour == 0) hour = 12;
    var minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes.toString()
    } else {
        minutes = minutes.toString()
    }
    //ctx.font = "bolder " + radius*0.4 + "px arial";
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    //ctx.fillStyle = '#93f';
    //ctx.fillText(hour.toString(), 0, 0);
    var day = daysOfWeek[now.getDay()] + " " + now.getMonth() + "/" + now.getDate();

    drawTextWithShadow(ctx, hour.toString(), CPurp, radius*0.4, 0, 0);
    drawTextWithShadow(ctx, minutes, CGreen, radius*0.12, 0, radius*0.25);
    drawTextWithShadow(ctx, day, CBlue, radius*0.1, 0, -radius*0.25)

}

function drawTextWithShadow(ctx, text, color, scale, x, y) {
    ctx.shadowBlur = scale * .8;
    ctx.font = "bold " + scale + "px arial";
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
    ctx.shadowBlur *= .8;
    ctx.fillText(text, x, y);
    ctx.shadowBlur *= .8;
    ctx.fillText(text, x, y);
    ctx.shadowBlur *= .8;
    ctx.fillText(text, x, y);
    ctx.shadowBlur *= .8;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

}

function drawTime(ctx, radius){
    ctx.strokeStyle = CGreen;
    var now = new Date();
    //var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    //hour=hour%12;
    //hour=(hour*Math.PI/6)+
    //(minute*Math.PI/(6*60))+
    //(second*Math.PI/(360*60));
    //drawHand(ctx, hour, radius*0.5, radius*0.04);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.85, radius*0.04, "line");
    // second
    ctx.fillStyle = CBlue;
    second=(second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.03, "circle");
}

function drawHand(ctx, pos, length, width, type) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    if (type == "line") {
        ctx.lineTo(0, -length);
        ctx.stroke();
    } else if (type == "circle") {
        ctx.arc(0, -length, width, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.moveTo(0,0);
    }

    ctx.rotate(-pos);
}

// Main

var canvasClock = document.getElementById("canvas-clock");
var ctx = canvasClock.getContext("2d");
var radius = canvasClock.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;
drawClock();
setInterval(drawClock, 1000);