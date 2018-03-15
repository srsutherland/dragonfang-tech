//canvasPolar.ts transpiles to canvasPolar.js


class Fibonacci {
    const CMint = '#3f9', CPurp = '#93f', CBlue = '#39f';
    const CLime = '#9f3', COran = '#f39', CPink = '#f93';
    const CAry = [CMint, CPurp, CBlue, CLime, COran, CPink];

    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    radius : number;
    color : string = CMint;
    clearI: number = null;
    points = [];
    fibs: number[] = [];


    constructor (id : string, color? : string) {
        let elem = document.getElementById(id);
        if (elem === null) {
            throw new Error("No element with id found")
        }
        if (elem instanceof HTMLCanvasElement) {
            this.canvas = elem;
        } else {
            this.canvas = document.createElement("canvas");
            this.canvas.height = 150;
            this.canvas.width = 150;
            elem.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext("2d");
        let radius = Math.min(this.canvas.height, this.canvas.width) / 2;
        this.ctx.translate(radius, radius);
        this.radius = radius * 0.90;

        if (color) {
            this.setColor(color);
        } else {
            this.genColor()
        }
    }

    genColor() {
        this.color = CAry[getRandomInt(0, 5)];
        this.ctx.fillStyle = this.color;
    }

    setColor(color) : Fibonacci {
        this.color = color;
        this.ctx.fillStyle = this.color;
        return this;
    }

    addPoint() {
        let p = new Point(this.ctx, Math.random() * 1e-10, Math.random() * 1e-10);
        this.points.push(p);
        if (this.points.length > 2) {
            this.fibs.push(this.fibs[this.fibs.length-1] + this.fibs[this.fibs.length-2])
        } else {
            this.fibs.push(1);
        }
    }

    start(interval : number = 1) {
        if (this.clearI !== null) {
            clearInterval(this.clearI)
        }
        this.clearI = setInterval(this.step.bind(this), interval);
    }

    stop() {
        clearInterval(this.clearI);
    }

    step() {
        for (let p1 of this.points) {
            for (let p2 of this.points) {
                p1.calcForce(p2, 10);
            }
            p1.addVTheta(10);
            //boundry
        }
    }

    drawPoint() {
        this.ctx.beginPath();
        this.ctx.arc(0, -this.radius * Math.sin(this.A * this.theta / this.B), this.radius * .01, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }
}

class Point {
    x : number;
    y : number;
    vx : number;
    vy : number;
    color : string;
    ctx : CanvasRenderingContext2D;

    constructor (ctx: CanvasRenderingContext2D, x : number = 0, y: number = 0, color? : string) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;

        if (color) {
            this.color = color;
        } else {
            this.genColor()
        }
    }

    draw() {

    }

    genColor() {
        this.color = CAry[getRandomInt(0, 5)];
    }

    r() : number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    theta() : number {
        return Math.atan2(this.y, this.x)
    }

    vr() : number {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    }

    vtheta() : number {
        return Math.atan2(this.vy, this.vx)
    }

    addVTheta(val: number) {
        let r = this.vr() + val;
        let theta = this.vtheta();
        this.x = r * Math.cos(theta);
        this.y = r * Math.sin(theta);
    }

    calcForce(p : Point, mass: number) {
        if (this === p) {
            return;
        }
        let dx = this.x - p.x;
        let dy = this.y - p.y;
        this.vx += Math.sqrt( dx * dx) * mass
        this.vx += Math.sqrt( dx * dx) * mass
    }
}

function getRandomInt(min, max) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

try {
    let fibonacci = new Fibonacci("canvas");
    fibonacci.start(1);
} catch (e) {
    console.log(e.toString())
}