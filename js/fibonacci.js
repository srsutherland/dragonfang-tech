//fibonacci.ts transpiles to fibonacci.js
var CMint = '#3f9', CPurp = '#93f', CBlue = '#39f';
var CLime = '#9f3', COran = '#f39', CPink = '#f93';
var CAry = [CMint, CPurp, CBlue, CLime, COran, CPink];
var Fibonacci = /** @class */ (function () {
    function Fibonacci(id, color) {
        this.color = CMint;
        this.clearI = null;
        this.points = [];
        this.fibs = [];
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
        if (color) {
            this.setColor(color);
        }
        else {
            this.genColor();
        }
    }
    Fibonacci.prototype.genColor = function () {
        this.color = CAry[getRandomInt(0, 5)];
        this.ctx.fillStyle = this.color;
    };
    Fibonacci.prototype.setColor = function (color) {
        this.color = color;
        this.ctx.fillStyle = this.color;
        return this;
    };
    Fibonacci.prototype.addPoint = function () {
        debugger;
        var x = (Math.random() - .5);
        var y = (Math.random() - .5);
        var p = new Point(this.ctx, this.radius, x, y);
        this.points.push(p);
        if (this.points.length > 2) {
            this.fibs.push(this.fibs[this.fibs.length - 1] + this.fibs[this.fibs.length - 2]);
        }
        else {
            this.fibs.push(1);
        }
    };
    Fibonacci.prototype.start = function (interval) {
        if (interval === void 0) { interval = 1; }
        this.stop();
        this.clearI = setInterval(this.step.bind(this), interval);
        this.frame = 0;
    };
    Fibonacci.prototype.debugStart = function (interval) {
        if (interval === void 0) { interval = 1000; }
        this.stop();
        console.log(interval);
        this.points.push(new Point(this.ctx, this.radius, 0, 10));
        this.points.push(new Point(this.ctx, this.radius, -5, -5));
        this.points.push(new Point(this.ctx, this.radius, 5, -5));
        this.clearI = setInterval(this.step.bind(this), interval);
        this.frame = 0;
    };
    Fibonacci.prototype.stop = function () {
        try {
            clearInterval(this.clearI);
        }
        catch (e) {
        }
        this.fibs = [];
        this.points = [];
    };
    Fibonacci.prototype.step = function () {
        if (this.frame % 100 == 0) {
            this.addPoint();
        }
        console.log(this.frame.toString() + ":");
        this.draw();
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            p.forces = [];
            for (var _b = 0, _c = this.points; _b < _c.length; _b++) {
                var p2 = _c[_b];
                p.calcForce(p2, 50);
            }
            p.addVTheta(10);
            var r = p.r();
            if (r >= this.radius) {
                p.addVTheta(-10);
            }
            else {
                p.addVTheta(-1 / (1 - r / this.radius));
            }
            var vr = p.vr();
            if (vr) {
                p.addVTheta(-vr * (-Math.exp(-.05 * vr) + 1)); //resistance
            }
            p.move(.1);
        }
        //this.draw();
        this.frame++;
    };
    Fibonacci.prototype.draw = function () {
        this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
        var i = 0;
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var p = _a[_i];
            p.draw();
            console.log("p" + i++ + ": " + [p.x, p.y, p.vx, p.vy].toString());
        }
    };
    return Fibonacci;
}());
var Point = /** @class */ (function () {
    function Point(ctx, scale, x, y, color) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.forces = [];
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.scale = scale;
        this.size = scale * .01;
        this.ctx = ctx;
        if (color) {
            this.color = color;
        }
        else {
            this.genColor();
        }
    }
    Point.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.strokeStyle = this.color;
        for (var _i = 0, _a = this.forces; _i < _a.length; _i++) {
            var v = _a[_i];
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(3 * (this.x + v[0]), 3 * (this.y + v[1]));
            this.ctx.stroke();
        }
    };
    Point.prototype.genColor = function () {
        this.color = CAry[getRandomInt(0, 5)];
    };
    Point.prototype.r = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Point.prototype.theta = function () {
        return Math.atan2(this.y, this.x);
    };
    Point.prototype.vr = function () {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    };
    Point.prototype.vtheta = function () {
        return Math.atan2(this.vy, this.vx);
    };
    Point.prototype.addVTheta = function (val) {
        var r = val; //this.vr() + val;
        var theta = this.theta();
        this.addForce(r * Math.cos(theta), r * Math.sin(theta));
    };
    Point.prototype.calcForce = function (p, mass) {
        if (this === p) {
            return;
        }
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        var d_sq = dx * dx + dy * dy;
        var r = mass / Math.sqrt(d_sq);
        var theta = Math.atan2(dy, dx);
        this.addForce(r * Math.cos(theta), r * Math.sin(theta));
    };
    Point.prototype.addForce = function (x, y) {
        this.vx += x;
        this.vy += y;
        this.forces.push([x, y]);
    };
    Point.prototype.move = function (s) {
        if (s === void 0) { s = 1; }
        this.x += this.vx * s;
        this.y += this.vy * s;
    };
    return Point;
}());
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
try {
    var fibonacci = new Fibonacci("canvas");
    fibonacci.start(100);
    //fibonacci.debugStart(100)
}
catch (e) {
    console.log(e.toString());
}
//# sourceMappingURL=fibonacci.js.map