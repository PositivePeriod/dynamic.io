import { OrthogonalVector } from "../util/vector.js";
import { ObjectSystem } from "./objectSystem.js";

export class GameObject {
    static system = new ObjectSystem();

    constructor(x, y) {
        this.type = ["GameObject"];

        // Kinematics
        this.mass = 1;
        this.force = new OrthogonalVector();
        this.velocity = new OrthogonalVector();
        this.pos = new OrthogonalVector(x, y);

        // Visualize
        this.shape = null; //
        this.color = "#000000";
        this.passable = true; //
        this.movable = true; //
    }

    applyForce(force) {
        this.force.addBy(force.toOrthogonal());
    }

    setPos(x, y) {
        this.pos = new OrthogonalVector(x, y);
    }

    update(dt) {
        var accel = this.force.multiply(1 / this.mass);
        this.velocity.addBy(accel.multiply(dt));
        this.pos.addBy(this.velocity.multiply(dt));
        this.force = new OrthogonalVector();
    }

    makeShape(shape, option) {
        switch (shape) {
            case "Rect":
                this.width = option.width || 1;
                this.height = option.height || 1;
                break;
            case "Circle":
                this.rad = option.rad || 1;
                break;
            case "Donut":
                this.innerR = option.innerR || 1;
                this.outerR = option.outerR || 2;
                break;
            default:
                console.error("Impossible object shape; ", shape);
                return;
        }
        this.shape = shape;
        if (option.x && option.y) {
            this.setPos(option.x, option.y);
        }
        return this
    }

    isCollidedWith(other) {
        return ObjectSystem.isCollided(this, other);
    }
}