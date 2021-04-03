export class Visualizer {
    constructor() {
        this.initCanvas();

        this.drawObject = [];
        this.initResize();
    }

    add(object) {
        this.drawObject.push(object);
    }

    draw() {
        this.clearWhole();
        this.drawRect(25, 25, 40, 40);
        this.drawRect(25, 80, 40, 40);
        this.drawObject.forEach(obj => obj.draw(this));
    }

    initCanvas() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // this.ctx.lineWidth = 1;
    }

    initResize() {
        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        window.addEventListener('resize', this.resize.bind(this), false);
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

    drawCircle(cx, cy, r, color = '#000000', stroke = false) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        if (stroke) {
            this.ctx.stroke();
        } else {
            this.ctx.fill();
        }
    }

    drawRect(cx, cy, w, h, color = '#000000', stroke = false) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;

        var x = cx - w / 2;
        var y = cy - h / 2;
        if (stroke) {
            this.ctx.strokeRect(x, y, w, h);
        } else {
            this.ctx.fillRect(x, y, w, h);
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