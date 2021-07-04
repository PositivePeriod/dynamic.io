import { PolarVector } from "../util/vector.js";
import { GameObject } from "./gameObject.js";

export class ProjectileObject extends GameObject {
    constructor(x, y, velocity, explosion) {
        super(x, y);
        this.type.push("ProjectileObject");
        this.velocity = velocity.toOrthogonal();
        this.explosion = explosion || { range: 1, damage: 1, power: 1 };
        this.makeShape("Circle", { "rad": this.explosion.rad });
    }

    update(dt, others, visualizer) {
        super.update(dt);
        for (let i = 0; i < others.length; i++) {
            if (!others[i].passable && this.isCollidedWith(others[i])) {
                this.burst(visualizer);
                break;
            }
        }
    }

    burst(visualizer) {
        GameObject.system.find("PlayerObject").forEach(player => {
            var pos = player.pos.minus(this.pos);
            if (pos.r < this.explosion.range) {
                player.shield -= this.explosion.damage * (1 - pos.r / this.explosion.range);
                var force = new PolarVector(this.explosion.power / pos.r, pos.theta);
                player.applyForce(force);
            }
        })
        // visualizer.drawCircle(this.pos.x, this.pos.y, this.explosion.range, this.color);
        GameObject.system.remove(this);
    }
}