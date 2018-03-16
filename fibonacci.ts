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
        let x = (Math.random() - .5);
        let y = (Math.random() - .5);
        let p = new Point(this.ctx, this.radius, x, y);
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

    debugStart(interval : number = 1000) {
        this.stop();
        console.log(interval);

        this.points.push(new Point(this.ctx, this.radius, 0, 10));
        this.points.push(new Point(this.ctx, this.radius, -5, -5));
        this.points.push(new Point(this.ctx, this.radius, 5, -5));

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
        if (this.frame % 100 == 0) {
            this.addPoint();
        }
        console.log(this.frame.toString() + ":");
        this.draw();

        for (let p of this.points) {
            p.forces = [];
            for (let p2 of this.points) {
                p.calcForce(p2, 50);
            }
            p.addVTheta(10);
            let r = p.r();
            if (r >= this.radius) {
                p.addVTheta(-10)
            } else {
                p.addVTheta(-1 / (1-r/this.radius))
            }
            let vr = p.vr();
            if (vr) {
                p.addVTheta(-vr * (-Math.exp(-.05 * vr) + 1)) //resistance
            }
            p.move(.1);
        }
        //this.draw();
        this.frame++;
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
    scale: number;
    forces : number[][] = [];

    constructor (ctx: CanvasRenderingContext2D, scale: number, x : number = 0, y: number = 0, color? : string) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.scale = scale;
        this.size = scale * .01;
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
        this.ctx.strokeStyle = this.color;
        for (let v of this.forces) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y,);
            this.ctx.lineTo(3* (this.x + v[0]), 3 * (this.y + v[1]));
            this.ctx.stroke();
        }
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
        let r = val; //this.vr() + val;
        let theta = this.theta();

        this.addForce(
            r * Math.cos(theta),
            r * Math.sin(theta)
        );
    }

    calcForce(p : Point, mass: number) {
        if (this === p) {
            return;
        }
        let dx = this.x - p.x;
        let dy = this.y - p.y;
        let d_sq = dx * dx + dy * dy;
        let r = mass / Math.sqrt(d_sq);
        let theta = Math.atan2(dy, dx);

        this.addForce(
            r * Math.cos(theta),
            r * Math.sin(theta)
        );
    }

    addForce(x: number, y: number) {
        this.vx += x;
        this.vy += y;
        this.forces.push([x, y]);
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
    fibonacci.start(100);
    //fibonacci.debugStart(100)
} catch (e) {
    console.log(e.toString())
}