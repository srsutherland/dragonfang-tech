const CMint = '#3f9', CPurp = '#93f', CBlue = '#39f';
const CLime = '#9f3', COran = '#f39', CPink = '#f93';
const CAry = [CMint, CPurp, CBlue, CLime, COran, CPink];

let elem = document.getElementById("canvas");
let canvasPolar : HTMLCanvasElement;
if (elem instanceof HTMLCanvasElement) {
    canvasPolar = elem;
} else {
    canvasPolar = new HTMLCanvasElement;
    elem.appendChild(canvasPolar);
}

let ctx = canvasPolar.getContext("2d");
let radius = canvasPolar.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;
let theta = 0;
let params = genAlpha();
ctx.fillStyle = params.color;
let clearI = setInterval(drawGraph, 1);

function drawGraph() {
    if (theta >= params.max) {
        params = genAlpha();
        ctx.fillStyle = params.color;
        theta = 0;
    }
    var step = Math.PI / 256 /2;
    drawPoint(ctx, radius, theta, params.A, params.B);
    theta += step;
    ctx.rotate(step)
}

function genAlpha() {
    let rVal : any = {};
    rVal.color = CAry[getRandomInt(0, 5)];
    rVal.A = getRandomInt(1, 20);
    rVal.B = getRandomInt(1, 20);
    let aGCD = gcd(rVal.A, rVal.B);
    rVal.A /= aGCD;
    rVal.B /= aGCD;
    rVal.max = rVal.B * Math.PI * (rVal.A % 2 == 0 || rVal.B % 2 == 0 ? 2 : 1) + (Math.PI/2);
    return rVal;
}

//noinspection JSUnusedGlobalSymbols
function initParams() {
    return {
        color: CPurp,
        A: 19,
        B: 6,
        max: 6 * 2 * Math.PI
    }
}

function drawPoint(ctx, radius, theta, A, B) {
    ctx.beginPath();
    ctx.arc(0, -radius * Math.sin(A * theta / B), radius * .01, 0, 2 * Math.PI, false);
    ctx.fill()
}

function gcd(a,b) : number {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {var temp = a; a = b; b = temp;}
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

function getRandomInt(min, max) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}