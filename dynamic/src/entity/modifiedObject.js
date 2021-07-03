import { MapObject } from "./mapObject.js"

export class ShieldPanel extends MapObject {
    constructor(x, y, width, height, change) {
        super(x, y, width, height);
        this.color = "#008000";
        this.change = change > 0 ? change : 0;

        this.movable
    }

    update(dt, others) {
        others.forEach(obj => {
            if (this.collideWith(obj)) {
                obj.shield += this.change * dt;
            }
        });
    }
}

export class WeakAttackPanel extends MapObject {
    constructor(x, y, width, height, change) {
        super(x, y, width, height);
        this.color = "#808000";
        this.change = change > 0 ? change : 0;
    }

    update(dt, others) {
        others.forEach(obj => {
            if (this.collideWith(obj)) {
                obj.shield -= this.change * dt;
            }
        });
    }
}

export class StrongAttackPanel extends MapObject {
    constructor(x, y, width, height, change) {
        super(x, y, width, height);
        this.color = "#800000";
        this.change = change > 0 ? change : 0;
    }

    update(dt, others) {
        others.forEach(obj => {
            if (this.collideWith(obj)) {
                obj.health -= this.change * dt;
            }
        });
    }
}