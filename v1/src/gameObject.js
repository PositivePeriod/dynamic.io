import { PolarVector, OrthogonalVector } from "./vector.js";

export class GameObject {
    constructor() {
        // basic
        this.pos = new OrthogonalVector();
        this.velocity = new OrthogonalVector();
        this.rad = 1;
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
}