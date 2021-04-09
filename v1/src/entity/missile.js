import { OrthogonalVector } from "../vector.js";
import { CircleObject } from "./gameObject.js";

export class Missile extends CircleObject {
    constructor(type, caster) {
        super(type);
        this.caster = caster;
    }

    burst() {
        
    }
}