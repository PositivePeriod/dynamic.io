import { PolarVector } from "../util/vector.js";
import { CircleObject, GameObject } from "./gameObject.js";

export class ProjectileObject extends CircleObject {
    constructor(x, y, rad, speed, angle, explosion) {
        super("ProjectileObject", x, y, rad);

        this.velocity = new PolarVector(speed, angle).toOrthogonal();
        this.explosion = explosion || { rad: 1, damage: 1, power: 1 };

        this.guided = 0;
    }

    isGuided() {

    }

    burst(visualizer) {
        GameObject.system.get("PlayerObject").forEach(player => {
            var pos = player.pos.minus(this.pos);
            if (pos.r < this.explosion.rad) {
                player.shield -= this.explosion.damage * (1 - pos.r / this.explosion.rad);
                var force = new PolarVector(this.explosion.power, pos.theta);
                player.applyForce(force);
            }
        })
        // visualizer.drawCircle(this.pos.x, this.pos.y, this.explosion.rad, this.color);
        GameObject.removeObject(this);
    }

    update(dt, others, visualizer) {
        super.update(dt);
        for (let i = 0; i < others.length; i++) {
            if (!others[i].passable && this.collideWith(others[i])) {
                this.burst(visualizer);
                break;
            }
        }
    }

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, this.color);
    }
}


export class StrongProjectile extends CircleObject {
    constructor(x, y, rad, speed, angle, caster) {
        super(x, y, rad);
        this.velocity = new PolarVector(speed, angle).toOrthogonal();
        this.caster = caster || 0;

        this.guided = 0;
    }

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, this.color);
    }
}