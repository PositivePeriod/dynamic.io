import { OrthogonalVector } from "../util/vector.js";

export class GameObject {
    constructor(x, y) {
        // basic
        this.pos = new OrthogonalVector(x || 0, y || 0);
        this.velocity = new OrthogonalVector();
        this.mass = 1; // friction? -> speed

        // force
        this.force = new OrthogonalVector(); // force with delay time
    }

    update(dt) {
        var accel = this.force.multiply(1 / this.mass);
        this.velocity.addBy(accel.multiply(dt));
        this.pos.addBy(this.velocity.multiply(dt));
        this.force = new OrthogonalVector();
    }

    applyForce(force) {
        this.force.addBy(force.toOrthogonal());

        // TODO list에 넣어두었다가 빼기? priority queue?
    }

    setPos(x, y) {
        this.pos = new OrthogonalVector(x, y);
    }
}

export class RectObject extends GameObject {
    constructor(x, y, width, height) {
        super(x, y);
        this.type = 'rect';
        this.width = width || 1;
        this.height = height || 1;

        this.color = '#000000';
    }

    collideWith(other) {
        if (other.type === 'rect') {
            var minX = (this.width + other.width) / 2;
            var minY = (this.height + other.height) / 2;
            var curX = Math.abs(this.pos.x - other.pos.x);
            var curY = Math.abs(this.pos.y - other.pos.y)
            return minX > curX || minY > curY
        } else if (other.type === 'circle') {
            var testX = other.pos.x;
            var testY = other.pos.y;
            var left = this.pos.x - this.width / 2;
            var right = this.pos.x + this.width / 2;
            var top = this.pos.y - this.height / 2;
            var bottom = this.pos.y + this.height / 2;

            if (other.pos.x < left) { testX = left; } else if (other.pos.x > right) { testX = right; }
            if (other.pos.y < top) { testY = top; } else if (other.pos.y > bottom) { testY = bottom; }
            var distance2 = (other.pos.x - testX) ** 2 + (other.pos.y - testY) ** 2;
            // console.log(other.pos.x - testX, other.pos.y - testY);
            // console.log(distance2, other.rad ** 2);
            return distance2 <= other.rad ** 2;
        }
    }

    draw(visualizer) {
        visualizer.drawRect(this.pos.x, this.pos.y, this.width, this.height, this.color);
    }
}

export class CircleObject extends GameObject {
    constructor(x, y, rad) {
        super(x, y);
        this.type = 'circle';
        this.rad = rad || 1;
    }

    collideWith(other) {
        if (other.type === 'circle') {
            var cur2 = (this.pos.x - other.pos.x) ** 2 + (this.pos.y - other.pos.y) ** 2;
            var min2 = (this.rad + other.rad) ** 2
            return min2 > cur2;
        } else if (other.type === 'rect') {
            var testX = this.pos.x;
            var testY = this.pos.y;
            var left = other.pos.x - other.width / 2;
            var right = other.pos.x + other.width / 2;
            var top = other.pos.y - other.height / 2;
            var bottom = other.pos.y + other.height / 2;

            if (this.pos.x < left) { testX = left; } else if (this.pos.x > right) { testX = right; }
            if (this.pos.y < top) { testY = top; } else if (this.pos.y > bottom) { testY = bottom; }
            var distance2 = (this.pos.x - testX) ** 2 + (this.pos.y - testY) ** 2;
            return distance2 <= this.rad ** 2;
        }
    }
}