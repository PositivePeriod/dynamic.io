import { OrthogonalVector } from "../util/vector.js";

export class GameObject {
    static system = new Map();

    static addObject(obj) {
        if (this.system.has(obj.type)) {
            this.system.get(obj.type).push(obj);
        } else { this.system.set(obj.type, [obj]) }
    }

    static removeObject(obj) {
        var group = this.system.get(obj.type);
        var idx = group.indexOf(obj);
        if (idx > -1) { group.splice(idx, 1); }
    }

    static findClosestAnyObject(target) { // TODO garbage? no use!
        var minimum = { d: float("inf"), obj: null };
        this.system.forEach(group => {
            var minimal = this.findClosest(group, target);
            if (minimum.d > minimal.d) { // TOOD what if === ? (길이가 서로 같은 경우)
                minimum.d = minimal.d;
                minimum.obj = minimal.obj;
            };
        })
        return minimum
    }

    static findClosest(objects, target) {
        var minimum = { d: float("inf"), obj: null };
        objects.forEach(object => {
            var d = object.pos.minus(target.pos).r;
            if (minimum.d > d) { // TOOD what if === ? (길이가 서로 같은 경우)
                minimum.d = d;
                minimum.obj = object;
            };
        })
        return minimum
    }


    constructor(type, x, y) {
        this.type = type || "GameObject";
        GameObject.addObject(this);

        // basic
        this.pos = new OrthogonalVector(x || 0, y || 0);
        this.velocity = new OrthogonalVector();
        this.mass = 1; // friction? -> speed

        // force
        this.force = new OrthogonalVector(); // force with delay time

        // visualizer
        this.color = "#000000";

        this.passable = true;
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
    constructor(type, x, y, width, height) {
        super(type, x, y);
        this.width = width || 1;
        this.height = height || 1;
    }

    collideWith(other) {
        if (other instanceof RectObject) {
            var minX = (this.width + other.width) / 2;
            var minY = (this.height + other.height) / 2;
            var curX = Math.abs(this.pos.x - other.pos.x);
            var curY = Math.abs(this.pos.y - other.pos.y)
            return minX > curX || minY > curY
        } else if (other instanceof CircleObject) {
            var testX = other.pos.x;
            var testY = other.pos.y;
            var left = this.pos.x - this.width / 2;
            var right = this.pos.x + this.width / 2;
            var top = this.pos.y - this.height / 2;
            var bottom = this.pos.y + this.height / 2;

            if (other.pos.x < left) { testX = left; } else if (other.pos.x > right) { testX = right; }
            if (other.pos.y < top) { testY = top; } else if (other.pos.y > bottom) { testY = bottom; }
            var distance2 = (other.pos.x - testX) ** 2 + (other.pos.y - testY) ** 2;
            return distance2 <= other.rad ** 2;
        }
    }

    draw(visualizer) {
        visualizer.drawRect(this.pos.x, this.pos.y, this.width, this.height, this.color);
    }
}

export class CircleObject extends GameObject {
    constructor(type, x, y, rad) {
        super(type, x, y);
        this.rad = rad || 1;
    }

    collideWith(other) {
        if (other instanceof CircleObject) {
            var cur2 = (this.pos.x - other.pos.x) ** 2 + (this.pos.y - other.pos.y) ** 2;
            var min2 = (this.rad + other.rad) ** 2
            return min2 > cur2;
        } else if (other instanceof RectObject) {
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

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, this.color);
    }
}