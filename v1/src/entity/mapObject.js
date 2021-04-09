import { RectObject } from "./gameObject.js"

export class MapObject extends RectObject {
    constructor(x, y, width, height, healthChange) {
        super(x, y)
        this.width = width || 1;
        this.height = height || 1;
        this.healthChange = healthChange || 0;

        if (this.healthChange === 0) {
            this.color = '#808080';
        } else if (this.healthChange > 0) {
            this.color = '#008000';
        } else {
            this.color = '#800000';
        }

    }

    update(others) {
        others.forEach(obj => {
            if (this.collideWith(obj)) {
                obj.health = Math.max(obj.health + this.healthChange, 0);
            }
        });
    }
}