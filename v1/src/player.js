import { GameObject } from "./gameObject.js";
import { KeyboardManager } from "./inputManager.js";
import { OrthogonalVector, PolarVector } from "./vector.js";

export class Player extends GameObject {
    constructor() {
        super();
        this.mass = 100;
        this.rad = 10;

        this.friction = 0.95;

        // TODO force type; cause by oneself, other, neutral, attack(miss나면 force애초에 안 더하는 걸로)
        // Health & Restoration
        this.health = 0;
        this.healthRestore = 0;
        this.shield = 0;
        this.shieldRestore = 0;
        this.resistance = 0;
        // Moving & Attack Speed
        this.range = 0; // attack range
        this.speed = 5;
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
        this.keyboard = new KeyboardManager();
        this.keyboard.activate();
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
    }

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, '#FF0000');
    }
}