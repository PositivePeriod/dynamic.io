import { GameObject, CircleObject } from "./gameObject.js";
import { OrthogonalVector, PolarVector } from "../util/vector.js";
import { ProjectileObject } from "./projectileObject.js";

export class PlayerObject extends CircleObject {
    constructor(x, y, rad, keyboard, mouse) {
        super("PlayerObject", x, y, rad);

        this.mass = 1;
        this.friction = 1e-2;

        // TODO force type; cause by oneself, other, neutral, attack(miss나면 force애초에 안 더하는 걸로)
        // Health & Restoration
        this._health = 500;
        this.healthRestore = 5;
        this.maxHealth = 1000;

        this._shield = 50;
        this.shieldRestore = 5;
        this.maxShield = 100;

        this.boost = 1; // healer boost, speed boost, color change effect, 단계별 적용 배그처럼

        this.resistance = 0;
        // Moving & Attack Speed
        this.range = 0; // attack range
        this.forceMag = 1000;
        // Resource cost & restoration
        this.mana = 0; // 스킬 쓰면 소모되고 시간지나면 회복
        this.rage = 0; // 특수 공격, 궁
        // Random & Critical, penetration
        this.fortune = 0;
        this.penetration = 0; // resistance 무시 가능성
        // Other
        this.dir = {
            "KeyW": { x: 0, y: -1 },
            "KeyA": { x: -1, y: 0 },
            "KeyS": { x: 0, y: 1 },
            "KeyD": { x: 1, y: 0 }
        }
        this.keyboard = keyboard;
        this.keyboard.listen("KeyT", this.attackKey.bind(this));
        this.mouse = mouse;
        this.mouse.listen("mouseup", this.attack.bind(this));
        this.color = "#000080";
    }

    attackKey() {
        // console.log("AttackKey");
        // console.log(this.color);
    }

    attack(downX, downY, upX, upY) {
        var dx = upX - downX;
        var dy = upY - downY;
        var angle =  new OrthogonalVector(dx, dy).theta;
        var rad = 5
        var pos = this.pos.add(new PolarVector(this.rad + rad, angle));
        new ProjectileObject(pos.x, pos.y, rad, 400, angle, { rad: 100, damage: 200, power: 10000 });
    }

    update(dt) {
        var direction = new OrthogonalVector();
        for (const [keyName, value] of Object.entries(this.dir)) {
            if (this.keyboard.isPressed(keyName)) {
                direction.addBy(new OrthogonalVector(value.x, value.y));
            }
        }
        if (direction.r !== 0) {
            this.applyForce( new PolarVector(this.forceMag, direction.theta));
        }
        super.update(dt);

        var collidedObj = [];
        GameObject.system.get("MapObject").forEach(obj => {
            if (!obj.passable && this.collideWith(obj)) {
                obj.collide(dt, this);
                collidedObj.push(obj);
            }
        });
        collidedObj.forEach(obj => { obj.collideAfter(this); });

        this.velocity.multiplyBy(Math.pow(this.friction, dt));

        // Check death

        this.health += this.healthRestore * dt;
        this.shield += this.shieldRestore * dt;
    }

    draw(visualizer) {
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, this.color, false);

        var left = this.pos.x - this.rad;
        var top = this.pos.y - this.rad;
        var width = 2 * this.rad
        var height = 10

        var margin = 10
        var shieldRatio = (this.shield / this.maxShield) * width;
        var healthRatio = (this.health / this.maxHealth) * width;
        visualizer.drawRect(left + shieldRatio, top - 2 * margin - height - height, width - shieldRatio, height, "#888888", false, false);
        if (shieldRatio > 0) {
            visualizer.drawRect(left, top - 2 * margin - 2 * height, shieldRatio, height, "#0000FF", false, false);
        }
        visualizer.drawRect(left + healthRatio, top - margin - height, width - healthRatio, height, "#FF0000", false, false);
        if (healthRatio > 0) {
            visualizer.drawRect(left, top - margin - height, healthRatio, height, "#00FF00", false, false);
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
        if (this._shield < 0) {
            this.health += this._shield;
        }
        this._shield = Math.max(0, Math.min(this._shield.toFixed(2), this.maxShield));
    }

    get shield() {
        return this._shield;
    }

    die() {
        this.color = "#000000";
        this._health = 0;
        this._shield = 0;
        this.healthRestore = 0;
        this.shieldRestore = 0;
    }
}