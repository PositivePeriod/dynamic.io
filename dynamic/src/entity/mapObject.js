import { OrthogonalVector, PolarVector } from "../util/vector.js";
import { RectObject } from "./gameObject.js"

export class MapObject extends RectObject {
    constructor(x, y, width, height) {
        super("MapObject", x, y, width, height);
        this.color = "#808080";
        this.movable = false;
    }

    update() { return; }

    applyForce(force) {
        if (this.movable) { super.applyForce(force); }
    }
}

export class RigidBackground extends MapObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.color = "#002222";
        this.passable = false;
    }


    collide(dt, other) {
        var dPos = other.velocity.multiply(dt);
        while (this.collideWith(other)) {
            other.pos.minusBy(dPos);
        }
        for (let turn = 0; turn < 10; turn++) {
            dPos.multiplyBy(1 / 2);
            while (!this.collideWith(other)) {
                other.pos.addBy(dPos);
            }
            other.pos.minusBy(dPos);
        }
    }

    collideAfter(other) {
        other.velocity = new OrthogonalVector();
    }
}

export class BouncyBackground extends MapObject {
    constructor(x, y, width, height, bounce) {
        super(x, y, width, height);
        this.color = "#222200";
        this.passable = false;
        this.bounce = bounce || 1;
    }

    collide(dt, other) {
        var pos = other.pos.minus(this.pos);
        if (this.width > this.height) {
            var l = (this.width - this.height) / 2;
            if (Math.abs(pos.x) < l) {
                var force = new PolarVector(this.bounce / Math.abs(pos.y), pos.y > 0 ? Math.PI / 2 : Math.PI * 3 / 2);
            } else {
                var force = pos.add(new PolarVector(l, pos.x > 0 ? Math.PI : 0)).toPolar();
                var mag = this.bounce / force.r;
                force.normalize();
                force.multiplyBy(mag);
            }
        } else {
            var l = (this.height - this.width) / 2;
            if (Math.abs(pos.y) < l) {
                var force = new PolarVector(this.bounce / Math.abs(pos.x), pos.x > 0 ? Math.PI : 0);
            } else {
                var force = pos.add(new PolarVector(l, pos.y > 0 ? Math.PI * 3 / 2 : Math.PI / 2)).toPolar();
                var mag = this.bounce / force.r;
                force.normalize();
                force.multiplyBy(mag);
            } 
        }
        other.applyForce(force);
    }

    collideAfter() { return; }
}