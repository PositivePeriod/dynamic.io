import { PolarVector } from "../util/vector.js";
import { CircleObject } from "./gameObject.js";

export class Missile extends CircleObject {
    constructor(x, y, rad, speed, angle, caster) {
        super(x, y, rad);
        this.velocity = new PolarVector(speed, angle).toOrthogonal();
        this.caster = caster || 0;

        this.guided = 0;
    }

    isGuided() {

    }

    burst() {

    }

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, this.color);
    }
}