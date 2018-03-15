//fibonacci.ts transpiles to fibonacci .js
const CMint = '#3f9', CPurp = '#93f', CBlue = '#39f';
const CLime = '#9f3', COran = '#f39', CPink = '#f93';
const CAry = [CMint, CPurp, CBlue, CLime, COran, CPink];

class Fibonacci {


    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    radius : number;
    color : string = CMint;
    clearI : number = null;
    points : Point[] = [];
    fibs : number[] = [];
    frame : number;


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
        debugger;
        let p = new Point(this.ctx, this.radius * .01, Math.random() * 1e-5, Math.random() * 1e-5);
        this.points.push(p);

        if (this.points.length > 2) {
            this.fibs.push(this.fibs[this.fibs.length-1] + this.fibs[this.fibs.length-2])
        } else {
            this.fibs.push(1);
        }
    }

    start(interval : number = 1) {
        this.stop();
        this.clearI = setInterval(this.step.bind(this), interval);
        this.frame = 0;
    }

    stop() {
        try{
            clearInterval(this.clearI);
        } catch (e) {

        }
        this.fibs = [];
        this.points = [];
    }

    step() {
        if (this.frame % 10 == 0) {
            this.addPoint();
        }

        for (let p of this.points) {
            for (let p2 of this.points) {
                p.calcForce(p2, 10);
            }
            p.addVTheta(100);
            let r = p.r();
            if (r >= this.radius) {
                p.addVTheta(-20)
            } else {
                p.addVTheta(5 / (1-r/this.radius))
            }
            p.move(10);
        }
        this.draw();
        this.frame++;
        console.log(this.frame.toString() + ":" + this.fibs.toString())
    }

    draw() {
        this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);
        let i = 0;
        for (let p of this.points) {
            p.draw();
            console.log("p"+ i++ + ": " + [p.x, p.y, p.vx, p.vy].toString())
        }
    }
}

class Point {
    x : number;
    y : number;
    vx : number;
    vy : number;
    color : string;
    ctx : CanvasRenderingContext2D;
    size: number;

    constructor (ctx: CanvasRenderingContext2D, size: number, x : number = 0, y: number = 0, color? : string) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = size;
        this.ctx = ctx;

        if (color) {
            this.color = color;
        } else {
            this.genColor()
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();
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
        let d_sq = dx * dx + dy * dy;
        let r = mass / d_sq;
        let theta = Math.atan(dy/dx);
        this.vx += r * Math.cos(theta);
        this.vy += r * Math.sin(theta);
    }

    move(s : number = 1) {
    	this.x += this.vx * s;
    	this.y += this.vy * s;
    }
}

function getRandomInt(min, max) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

try {
    let fibonacci = new Fibonacci("canvas");
    fibonacci.start(200);
} catch (e) {
    console.log(e.toString())
}