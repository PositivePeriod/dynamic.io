import { CircleObject } from "./gameObject.js";
import { OrthogonalVector } from "../util/vector.js";

export class Player extends CircleObject {
    constructor(x, y, rad, keyboard) {
        super(x,y,rad);
        this.mass = 100;
        this.friction = 0.5;

        // TODO force type; cause by oneself, other, neutral, attack(miss나면 force애초에 안 더하는 걸로)
        // Health & Restoration
        this.health = 50;
        this.healthRestore = 1;
        this.maxHealth = 100;

        this.shield = 0;
        this.shieldRestore = 0;
        this.maxShield = 0;

        this.resistance = 0;
        // Moving & Attack Speed
        this.range = 0; // attack range
        this.speed = 500;
        // Resource cost & restoration
        this.mana = 0; // 스킬 쓰면 소모되고 시간지나면 회복
        this.rage = 0; // 특수 공격, 궁
        // Random & Critical, penetration
        this.fortune = 0;
        this.penetration = 0; // resistance 무시 가능성
        // Other
        this.dir = {
            'KeyW': { x: 0, y: -1 },
            'KeyA': { x: -1, y: 0 },
            'KeyS': { x: 0, y: 1 },
            'KeyD': { x: 1, y: 0 }
        }
        this.keyboard = keyboard;
    }

    update(dt) {
        var direction = new OrthogonalVector();
        for (const [keyName, value] of Object.entries(this.dir)) {
            if (this.keyboard.isPressed(keyName)) {
                direction.addBy(new OrthogonalVector(value.x, value.y));
            }
        }
        direction = direction.toPolar();
        direction.normalize();
        var force = direction.multiply(this.speed);
        this.applyForce(force);

        super.update(dt);
        this.velocity.multiplyBy(this.friction);

        // Check death

        this.health = Math.min((this.health + this.healthRestore).toFixed(2), this.maxHealth);
        this.shield = Math.min((this.shield + this.shieldRestore).toFixed(2), this.maxShield);
    }

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, '#000080');

        var left = this.pos.x - this.rad;
        var top = this.pos.y - this.rad;
        var width = 2 * this.rad
        var height = 10
        var margin = 10
        var healthRatio = (this.health / this.maxHealth) * width;

        visualizer.drawRect(left + healthRatio, top - margin - height, width - healthRatio, height, '#FF0000', false, false);
        if (healthRatio > 0) {
            visualizer.drawRect(left, top - margin - height, healthRatio, height, '#00FF00', false, false);
        }
    }

    die() {

    }
}