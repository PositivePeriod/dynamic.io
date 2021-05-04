import { RectObject } from "./gameObject.js"

export class MapObject extends RectObject {
    constructor(x, y, width, height, arg) {
        super(x, y)
        this.width = width || 1;
        this.height = height || 1;
        this.color = '#808000';
        this.setProp(arg);
    }

    setProp(arg) {
        this.healthChange = arg['healthChange'] || 0;
        this.boostChange = arg['boostChange'] || 0;

        if (this.healthChange === 0) {
            this.color = '#808080';
        } else {
            this.color = this.healthChange > 0 ? '#008000' : '#800000';
        }
    }

    update(others) {
        others.forEach(obj => {
            if (this.collideWith(obj)) {
                if (this.healthChange !== 0) {
                    obj.health += this.healthChange;
                }
                if (this.boostChange !== 0) {
                    //
                }
            }
        });
    }
}

export class BackgroundObject extends RectObject {
    constructor(x, y, width, height, arg) {
        super(x, y)
        this.width = width || 1;
        this.height = height || 1;
    }

    update(others) {
        others.forEach(obj => {
            if (!this.collideWith(obj)) {
                // obj.erase()
            }
        });
    }
}