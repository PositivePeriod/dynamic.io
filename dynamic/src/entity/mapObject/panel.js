import { GameObject } from "../gameObject.js";
import { MapObject } from "./mapObject.js";

class Panel extends MapObject {
    constructor(x, y) {
        super(x, y);
        this.type.push("Panel");

        this.passable = true;
    }

    update(dt) {
        var players = GameObject.system.find("PlayerObject");
        players.forEach(player => {
            if (this.isCollidedWith(player)) { this.affect(dt, player); }
        });
    }

    affect(dt, player) { return; }
}

export class ShieldPanel extends Panel {
    constructor(x, y, change) {
        super(x, y);
        this.type.push("ShieldPanel");
        this.change = change > 0 ? change : 0;
        this.color = "#000088";
    }

    affect(dt, player) { player.shield += this.change * dt; }
}

export class WeakAttackPanel extends Panel {
    constructor(x, y, change) {
        super(x, y);
        this.type.push("WeakAttackPanel");
        this.change = change > 0 ? change : 0;
        this.color = "#888800";
    }

    affect(dt, player) { player.shield -= this.change * dt; }
}

export class StrongAttackPanel extends Panel {
    constructor(x, y, change) {
        super(x, y);
        this.type.push("StrongAttackPanel");
        this.change = change > 0 ? change : 0;
        this.color = "#880000";
    }

    affect(dt, player) {
        player.shield -= this.change * dt;
        player.health -= this.change * dt;
    }
}

export class TeleportPanel extends Panel {
    constructor(x, y, target) {
        super(x, y);
        this.type.push("TeleportPanel");
        this.color = "#880088";
        this.target = target || { "x": 0, "y": 0 };
    }

    affect(dt, player) {
        player.setPos(this.target.x, this.target.y);
    } // TODO projectile object teleport
}