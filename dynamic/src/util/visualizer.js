import { GameObject } from "../entity/gameObject.js";

export class Visualizer {
    constructor() {
        this.initCanvas();
        this.initResize();
    }

    drawObject(obj) {
        if (typeof obj.draw === "function") {
            obj.draw(this);
        } else {
            switch (obj.shape) {
                case "Rect":
                    this.drawRect(obj.pos.x, obj.pos.y, obj.width, obj.height, obj.color);
                    break;
                case "Circle":
                    this.drawCircle(obj.pos.x, obj.pos.y, obj.rad, obj.color);
                    break;
                case "Donut":
                    this.drawDonut(obj.pos.x, obj.pos.y, obj.innerR, obj.outerR, obj.color);
                    break;
                default:
                    console.error("Impossible object shape; ", obj.shape, obj);
            }
        }
    }

    draw() {
        this.clearWhole();
        GameObject.system.objects.forEach(group => {
            group.forEach(obj => { this.drawObject(obj); })
        })
    }

    initCanvas() {
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        // this.ctx.lineWidth = 1;
    }

    initResize() {
        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        window.addEventListener("resize", this.resize.bind(this), false);
        this.resize();
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.draw();
    }

    drawCircle(x, y, r, color = "#000000", stroke = false) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;

        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        if (stroke) {
            this.ctx.stroke();
        } else {
            this.ctx.fill();
        }
    }

    drawDonut(x, y, innerR, outerR, color = "#000000", stroke = false) {
        // https://en.wikipedia.org/wiki/Nonzero-rule
        
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;

        if (stroke) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, outerR, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(x, y, innerR, 0, 2 * Math.PI);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(x, y, outerR, 0, 2 * Math.PI, false);
            this.ctx.arc(x, y, innerR, 0, 2 * Math.PI, true);
            this.ctx.fill();
        }
    }

    drawRect(x, y, w, h, color = "#000000", stroke = false, center = true) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;

        var drawX = center ? x - w / 2 : x
        var drawY = center ? y - h / 2 : y

        if (stroke) {
            this.ctx.strokeRect(drawX, drawY, w, h);
        } else {
            this.ctx.fillRect(drawX, drawY, w, h);
        }
    }

    clear(cx, cy, w, h) {
        // var w = parseInt(w / 2);
        // var h = parseInt(h / 2);
        var x = cx - w / 2;
        var y = cy - h / 2;
        this.ctx.clearRect(x, y, width, height);
    }

    clearWhole() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}