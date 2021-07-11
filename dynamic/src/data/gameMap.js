import { Visualizer } from "../util/visualizer.js";
import { KeyboardManager, MouseManager } from "../util/inputManager.js";
import { PlayerObject } from "../entity/playerObject.js";
import { ShieldPanel, StrongAttackPanel, TeleportPanel, WeakAttackPanel } from "../entity/mapObject/panel.js";
import { GameObject } from "../entity/gameObject.js";
import { RigidBackground } from "../entity/mapObject/rigidBg.js";
import { BouncyBackground } from "../entity/mapObject/bouncyBg.js";
import { MovableObject } from "../entity/MovableObject.js";

export class Game {
    constructor() {
        this.fps = 30;
        this.dt = 1 / this.fps;

        this.keyboard = new KeyboardManager();
        this.mouse = new MouseManager();

        this.visualizer = new Visualizer();
        var cx = this.visualizer.stageWidth / 2;
        var cy = this.visualizer.stageHeight / 2;
        [
            new ShieldPanel(0, 0, 20).makeShape("Circle", { "x": cx * 0.7, "y": cy, "rad": 50, "change": 20 }),
            new WeakAttackPanel(0, 0, 20).makeShape("Circle", { "x": cx * 1.3, "y": cy, "rad": 50, "change": 20 }),
            new StrongAttackPanel(0, 0, 40).makeShape("Donut", { "x": cx, "y": cy, "innerR": Math.min(cx, cy) * 0.9 - 10, "outerR": Math.min(cx, cy) * 0.9, "change": 80 }),
            new TeleportPanel(0, 0, { "x": cx, "y": cy * 1.6 }).makeShape("Circle", { "x": cx, "y": cy * 0.2, "rad": 20 }),
            new TeleportPanel(0, 0, { "x": cx, "y": cy * 0.4 }).makeShape("Circle", { "x": cx, "y": cy * 1.8, "rad": 20 }),
            new BouncyBackground(0, 0, 30000).makeShape("Circle", { "x": cx, "y": cy, "rad": 50 }),
            new BouncyBackground(0, 0, 300000).makeShape("Donut", { "x": cx, "y": cy, "innerR": Math.min(cx, cy) * 0.9, "outerR": Math.min(cx, cy) }),
            new PlayerObject(cx, cy * 1.5, this.keyboard, this.mouse),
        ].forEach(obj => {
            GameObject.system.add(obj);
        })

        setInterval(this.update.bind(this), Math.round(1000 / this.fps));
    }

    update() {
        var movers = GameObject.system.find("MovableObject");
        var players = GameObject.system.find("PlayerObject");
        var maps = GameObject.system.find("MapObject");
        var projectiles = GameObject.system.find("ProjectileObject");

        movers.forEach(mover => { mover.update(this.dt); });
        players.forEach(player => { player.update(this.dt); });
        maps.forEach(map => { map.update(this.dt, players); });
        projectiles.forEach(projectile => { projectile.update(this.dt, [...players, ...maps], this.visualizer) });
        this.visualizer.draw();
    }
}