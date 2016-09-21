//canvasPolar.ts transpiles to canvasPolar.js
const CMint = '#3f9', CPurp = '#93f', CBlue = '#39f';
const CLime = '#9f3', COran = '#f39', CPink = '#f93';
const CAry = [CMint, CPurp, CBlue, CLime, COran, CPink];

class CanvasPolar {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    radius : number;
    A : number;
    B : number;
    max : number;
    theta : number = 0;
    color : string;
    clearI: number = null;
    oStaticColor : boolean = false;
    oRunOnce : boolean = false;
    oNoClear : boolean = false;

    constructor (id : string, A? : number, B? : number, color? : string) {
        let elem = document.getElementById(id);
        if (elem === null) {
            throw new Error("No element with id found")
        }
        if (elem instanceof HTMLCanvasElement) {
            this.canvas = elem;
        } else {
            this.canvas = new HTMLCanvasElement;
            elem.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext("2d");
        let radius = Math.min(this.canvas.height, this.canvas.width) / 2;
        this.ctx.translate(radius, radius);
        this.radius = radius * 0.90;

        if (A && B) {
            this.setAlpha(A, B);
        } else {
            this.genAlpha()
        }
        if (color) {
            this.setColor(color);
        } else {
            this.genColor()
        }
    }

    genAlpha() {
        this.A = getRandomInt(1, 20);
        this.B = getRandomInt(1, 20);
        let aGCD = gcd(this.A, this.B);
        this.A /= aGCD;
        this.B /= aGCD;
        this.max = this.B * Math.PI * (this.A % 2 == 0 || this.B % 2 == 0 ? 2 : 1) + (Math.PI/2);
    }

    genColor() {
        this.color = CAry[getRandomInt(0, 5)];
        this.ctx.fillStyle = this.color;
    }

    setStaticColor(option = true) : CanvasPolar {
        this.oStaticColor = option;
        return this;
    }

    setRunOnce(option = true) : CanvasPolar {
        this.oRunOnce = option;
        return this;
    }

    setNoClear(option = true) : CanvasPolar {
        this.oNoClear = option;
        return this;
    }

    setAlpha(A, B) : CanvasPolar {
        this.clear();
        this.theta = 0;
        this.A = A;
        this.B = B;
        this.A = getRandomInt(1, 20);
        this.B = getRandomInt(1, 20);
        let aGCD = gcd(this.A, this.B);
        this.A /= aGCD;
        this.B /= aGCD;
        this.max = this.B * Math.PI * (this.A % 2 == 0 || this.B % 2 == 0 ? 2 : 1) + (Math.PI/2);
        return this;
    }

    setColor(color) : CanvasPolar {
        this.color = color;
        this.ctx.fillStyle = this.color;
        return this;
    }

    reset() {
        if (!this.oNoClear){
            this.clear();
        }
        this.theta = 0;
        this.genAlpha();
        if (!this.oStaticColor){
            this.genColor()
        }
    }

    clear() {
        this.ctx.clearRect(this.radius * -1.5, this.radius * -1.5, 3 * this.radius, 3 * this.radius);
    }

    start(interval : number = 1) {
        this.theta = 0;
        if (this.clearI !== null) {
            clearInterval(this.clearI)
        }
        this.clearI = setInterval(this.drawGraph.bind(this), interval);
        this.drawAlpha()
    }

    stop() {
        clearInterval(this.clearI);
    }

    drawGraph() {
        if (this.theta >= this.max) {
            if (this.oRunOnce) {
                this.stop();
                return
            }
            this.reset();
            this.drawAlpha();
        }
        var step = Math.PI / 256 /2;
        this.drawPoint();
        this.theta += step;
        this.ctx.rotate(step)
    }

    drawPoint() {
        this.ctx.beginPath();
        this.ctx.arc(0, -this.radius * Math.sin(this.A * this.theta / this.B), this.radius * .01, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }

    drawAlpha() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.beginPath();
        this.ctx.font = "bold " + this.radius * 0.05 + "px arial";
        this.ctx.fillText(this.A.toString() + "/" + this.B.toString(), this.radius * 2, this.radius * 2);
        this.ctx.restore();
    }
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

try {
    var canvasPolar = new CanvasPolar("canvas");
    canvasPolar.start(1);
} catch (e) {
    console.log(e.toString())
}