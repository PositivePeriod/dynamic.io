import { GameObject } from "./gameObject.js";
import { OrthogonalVector, PolarVector } from "../util/vector.js";
import { ProjectileObject } from "./projectileObject.js";
import { MovableObject } from "./MovableObject.js";

export class PlayerObject extends MovableObject {
    constructor(x, y, keyboard, mouse, option) {
        super(x, y, keyboard, mouse);
        this.type.push("PlayerObject");
        this.makeShape("Circle", { "rad": option.rad || 50 });
        this.color = "#888888";

        // Resource Restoration
        this.alive = true;
        this._health = { "amount": 500, "restore": 5, "max": 1000 };
        this._shield = { "amount": 0, "restore": 5, "max": 100 };
        this._mana = { "amount": 50, "restore": 5, "max": 100 };

        // Attack & Skill
        this.skill = {
            "shoot": { "cost": 10, "bullet": { "rad": 10, "range": 200, "speed": 400, "damage": 300, "force": 300000 } },
            "teleport": { "cost": 40, "range": 150 },
        }
        this.activate();
    }

    activate() {
        this.keyboard.listen("KeyQ", this.shoot.bind(this));
        this.keyboard.listen("KeyE", this.teleport.bind(this));
        super.activate();
    }

    shoot() {
        // TODO scheduling이 안 되어 있어서 object 만들면서 app.js 오류 가능성?!
        if (this.mana >= this.skill.shoot.cost) {
            this.mana -= this.skill.shoot.cost;
            var dx = this.mouse.x - this.pos.x;
            var dy = this.mouse.y - this.pos.y;
            var bulletOption = this.skill.shoot.bullet;
            var angle = new OrthogonalVector(dx, dy).theta;
            var velocity = new PolarVector(bulletOption.speed, angle);
            var pos = this.pos.add(new PolarVector(this.rad + bulletOption.rad, angle));
            var bullet = new ProjectileObject(pos.x, pos.y, velocity, bulletOption);
            GameObject.system.add(bullet);
        }
    }

    teleport() {
        // TODO scheduling이 안 되어 있어서 collide 체크 이후 오류 가능성?!
        if (this.mana >= this.skill.teleport.cost) {
            var dx = this.mouse.x - this.pos.x;
            var dy = this.mouse.y - this.pos.y;
            var angle = new OrthogonalVector(dx, dy).theta;
            var pos = this.pos.add(new PolarVector(this.skill.teleport.range, angle));

            var pseudoObj = new GameObject();
            pseudoObj.makeShape("Circle", { "x": pos.x, "y": pos.y, "rad": this.rad });
            var isNotCollided = true;
            var maps = GameObject.system.find("MapObject")
            for (let i = 0; i < maps.length; i++) {
                if (!maps[i].passable && pseudoObj.isCollidedWith(maps[i])) {
                    isNotCollided = false;
                    break;
                }
            }
            if (isNotCollided) {
                this.setPos(pos.x, pos.y);
                this.mana -= this.skill.teleport.cost;
            }
        }
    }

    die() {
        this.alive = false;
        this.color = "#000000";
        this._health = { "amount": 0, "restore": 0, "max": 1 };
        this._shield = { "amount": 0, "restore": 0, "max": 1 };
        this._mana = { "amount": 0, "restore": 0, "max": 1 };
    }

    update(dt) {
        super.update(dt);
        this.health += this._health.restore * dt;
        this.shield += this._shield.restore * dt;
        this.mana += this._mana.restore * dt;
    }

    draw(visualizer) {
        // Body
        visualizer.drawCircle(this.pos.x, this.pos.y, this.rad, this.color, false);

        // Resource bar
        if (this.alive) {
            var left = this.pos.x - this.rad;
            var top = this.pos.y - this.rad;
            var width = 2 * this.rad
            var height = 10
            var margin = 10

            var manaRatio = (this.mana / this._mana.max) * width;
            var shieldRatio = (this.shield / this._shield.max) * width;
            var healthRatio = (this.health / this._health.max) * width;

            // Mana
            visualizer.drawRect(left + manaRatio, top - 3 * margin - 3 * height, width - manaRatio, height, "#000000", false, false);
            if (manaRatio > 0) {
                visualizer.drawRect(left, top - 3 * margin - 3 * height, manaRatio, height, "#FF00FF", false, false);
            }
            // Shield
            visualizer.drawRect(left + shieldRatio, top - 2 * margin - 2 * height, width - shieldRatio, height, "#000000", false, false);
            if (shieldRatio > 0) {
                visualizer.drawRect(left, top - 2 * margin - 2 * height, shieldRatio, height, "#0000FF", false, false);
            }
            // Health
            visualizer.drawRect(left + healthRatio, top - margin - height, width - healthRatio, height, "#FF0000", false, false);
            if (healthRatio > 0) {
                visualizer.drawRect(left, top - margin - height, healthRatio, height, "#00FF00", false, false);
            }
        }
    }

    set health(newH) {
        if (this.alive) {
            this._health.amount = newH;
            if (this._health.amount <= 0) { this.die(); }
            this._health.amount = Math.max(0, Math.min(this._health.amount.toFixed(2), this._health.max));
        }
    }

    get health() {
        return this._health.amount;
    }

    set shield(newS) {
        if (this.alive) {
            this._shield.amount = newS;
            if (this._shield.amount < 0) { this.health += this._shield.amount; }
            this._shield.amount = Math.max(0, Math.min(this._shield.amount.toFixed(2), this._shield.max));
        }
    }

    get shield() {
        return this._shield.amount;
    }

    set mana(newM) {
        if (this.alive) {
            this._mana.amount = newM;
            this._mana.amount = Math.max(0, Math.min(this._mana.amount.toFixed(2), this._mana.max));
        }
    }

    get mana() {
        return this._mana.amount;
    }
}