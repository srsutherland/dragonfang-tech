//canvasPolar.ts transpiles to canvasPolar.js
var CMint = '#3f9', CPurp = '#93f', CBlue = '#39f';
var CLime = '#9f3', COran = '#f39', CPink = '#f93';
var CAry = [CMint, CPurp, CBlue, CLime, COran, CPink];
var CanvasPolar = /** @class */ (function () {
    function CanvasPolar(id, A, B, color) {
        this.theta = 0;
        this.clearI = null;
        this.oStaticColor = false;
        this.oRunOnce = false;
        this.oNoClear = false;
        var elem = document.getElementById(id);
        if (elem === null) {
            throw new Error("No element with id found");
        }
        if (elem instanceof HTMLCanvasElement) {
            this.canvas = elem;
        }
        else {
            this.canvas = document.createElement("canvas");
            this.canvas.height = 150;
            this.canvas.width = 150;
            elem.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext("2d");
        var radius = Math.min(this.canvas.height, this.canvas.width) / 2;
        this.ctx.translate(radius, radius);
        this.radius = radius * 0.90;
        if (A != undefined && B != undefined) {
            this.setAlpha(A, B);
        }
        else {
            this.genAlpha();
        }
        if (color) {
            this.setColor(color);
        }
        else {
            this.genColor();
        }
    }
    CanvasPolar.prototype.genAlpha = function () {
        this.A = getRandomInt(1, 20);
        this.B = getRandomInt(1, 20);
        var aGCD = gcd(this.A, this.B);
        this.A /= aGCD;
        this.B /= aGCD;
        this.max = this.B * Math.PI * (this.A % 2 == 0 || this.B % 2 == 0 ? 2 : 1) + (this.oNoClear ? Math.PI / 2 : Math.PI);
    };
    CanvasPolar.prototype.genColor = function () {
        this.color = CAry[getRandomInt(0, 5)];
        this.ctx.fillStyle = this.color;
    };
    CanvasPolar.prototype.setStaticColor = function (option) {
        if (option === void 0) { option = true; }
        this.oStaticColor = option;
        return this;
    };
    CanvasPolar.prototype.setRunOnce = function (option) {
        if (option === void 0) { option = true; }
        this.oRunOnce = option;
        return this;
    };
    CanvasPolar.prototype.setNoClear = function (option) {
        if (option === void 0) { option = true; }
        this.oNoClear = option;
        return this;
    };
    CanvasPolar.prototype.setAlpha = function (A, B) {
        this.clear();
        this.theta = 0;
        this.A = A;
        this.B = B;
        var aGCD = gcd(this.A, this.B);
        this.A /= aGCD;
        this.B /= aGCD;
        this.max = this.B * Math.PI * (this.A % 2 == 0 || this.B % 2 == 0 ? 2 : 1) + (Math.PI / 2);
        return this;
    };
    CanvasPolar.prototype.setColor = function (color) {
        this.color = color;
        this.ctx.fillStyle = this.color;
        return this;
    };
    CanvasPolar.prototype.reset = function () {
        if (!this.oNoClear) {
            this.clear();
        }
        this.theta = 0;
        this.genAlpha();
        if (!this.oStaticColor) {
            this.genColor();
        }
    };
    CanvasPolar.prototype.clear = function () {
        this.ctx.clearRect(this.radius * -1.5, this.radius * -1.5, 3 * this.radius, 3 * this.radius);
    };
    CanvasPolar.prototype.start = function (interval) {
        if (interval === void 0) { interval = 1; }
        this.theta = 0;
        if (this.clearI !== null) {
            clearInterval(this.clearI);
        }
        this.clearI = setInterval(this.drawGraph.bind(this), interval);
        this.drawAlpha();
    };
    CanvasPolar.prototype.stop = function () {
        clearInterval(this.clearI);
    };
    CanvasPolar.prototype.drawGraph = function () {
        if (this.theta >= this.max) {
            if (this.oRunOnce) {
                this.stop();
                return;
            }
            this.reset();
            this.drawAlpha();
        }
        var step = Math.PI / 256 / 2;
        this.drawPoint();
        this.theta += step;
        this.ctx.rotate(step);
    };
    CanvasPolar.prototype.drawPoint = function () {
        this.ctx.beginPath();
        this.ctx.arc(0, -this.radius * Math.sin(this.A * this.theta / this.B), this.radius * .01, 0, 2 * Math.PI, false);
        this.ctx.fill();
    };
    CanvasPolar.prototype.drawAlpha = function () {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.beginPath();
        this.ctx.font = "bold " + this.radius * 0.05 + "px arial";
        this.ctx.fillText(this.A.toString() + "/" + this.B.toString(), this.radius * 2, this.radius * 2);
        this.ctx.restore();
    };
    return CanvasPolar;
}());
function gcd(a, b) {
    if (a < 0)
        a = -a;
    if (b < 0)
        b = -b;
    if (b > a) {
        var temp = a;
        a = b;
        b = temp;
    }
    while (true) {
        if (b == 0)
            return a;
        a %= b;
        if (a == 0)
            return b;
        b %= a;
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
try {
    var canvasPolar = new CanvasPolar("canvas");
    canvasPolar.start(1);
}
catch (e) {
    console.log(e.toString());
}
//# sourceMappingURL=canvasPolar.js.map