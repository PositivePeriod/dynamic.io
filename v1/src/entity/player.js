import { CircleObject } from "./gameObject.js";
import { OrthogonalVector } from "../util/vector.js";
import { Missile } from "./missile.js";

export class Player extends CircleObject {
    constructor(x, y, rad, keyboard, mouse) {
        super(x, y, rad);
        this.mass = 100;
        this.friction = 0.5;

        // TODO force type; cause by oneself, other, neutral, attack(miss나면 force애초에 안 더하는 걸로)
        // Health & Restoration
        this._health = 50;
        this.healthRestore = 1;
        this.maxHealth = 100;

        this.boost = 1; // healer boost, speed boost, color change effect, 단계별 적용 배그처럼

        this._shield = 0;
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
        this.keyboard.listen('KeyT', this.attackKey.bind(this));
        this.mouse = mouse;
        this.mouse.listen('mouseup', this.attack.bind(this));
        this.color = '#000080';

        this.popList = [];
    }

    attackKey() {
        // console.log('AttackKey');
        // console.log(this.color);
    }

    attack(downX, downY, upX, upY) {
        var dx = upX - downX;
        var dy = upY - downY;
        var angle = new OrthogonalVector(dx, dy).toPolar().theta;
        console.log(angle);
        var missile = new Missile(this.pos.x, this.pos.y, 3, 5, angle, 1);
        this.popList.push(missile); 
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

        this.health += this.healthRestore;
        this.shield += this.shieldRestore;
    }

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, this.color);

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

    set health(newH) {
        this._health = newH;
        if (this._health <= 0) {
            this.die();
        }
        this._health = Math.max(0, Math.min(this._health.toFixed(2), this.maxHealth));
    }

    get health() {
        return this._health;
    }

    set shield(newS) {
        this._shield = newS;
        this._shield = Math.max(0, Math.min(this._shield.toFixed(2), this.maxShield));
    }

    get shield() {
        return this._shield;
    }

    die() {
        this.color = '#000000';
    }
}