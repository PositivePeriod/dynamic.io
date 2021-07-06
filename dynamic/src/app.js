import { Visualizer } from "./util/visualizer.js";
import { KeyboardManager, MouseManager } from "./util/inputManager.js";
import { PlayerObject } from "./entity/playerObject.js";
import { ShieldPanel, StrongAttackPanel, TeleportPanel, WeakAttackPanel } from "./entity/mapObject/panel.js";
import { GameObject } from "./entity/gameObject.js";
import { RigidBackground } from "./entity/mapObject/rigidBg.js";
import { BouncyBackground } from "./entity/mapObject/bouncyBg.js";
import { MovableObject } from "./entity/MovableObject.js";

class Game {
    constructor() {
        this.fps = 30;
        this.dt = 1 / this.fps;

        this.keyboard = new KeyboardManager();
        this.mouse = new MouseManager();

        [
            new ShieldPanel(0, 0, 20).makeShape("Rect", { "x": 300, "y": 300, "width": 100, "height": 100, "change": 20 }),
            new WeakAttackPanel(0, 0, 20).makeShape("Circle", { "x": 500, "y": 300, "rad": 50, "change": 20 }),
            new StrongAttackPanel(0, 0, 40).makeShape("Donut", { "x": 700, "y": 300, "innerR": 60, "outerR": 80, "change": 80 }),
            new TeleportPanel(0, 0, { "x": 900, "y": 500 }).makeShape("Circle", { "x": 1100, "y": 500, "rad": 20 }),
            new TeleportPanel(0, 0, { "x": 1100, "y": 700 }).makeShape("Rect", { "x": 1300, "y": 700, "width": 50, "height": 50 }),
            new RigidBackground(0, 0).makeShape("Rect", { "x": 300, "y": 500, "width": 100, "height": 100 }),
            new RigidBackground(0, 0).makeShape("Circle", { "x": 500, "y": 500, "rad": 50 }),
            new RigidBackground(0, 0).makeShape("Donut", { "x": 700, "y": 500, "innerR": 20, "outerR": 50 }),
            new RigidBackground(0, 0).makeShape("Donut", { "x": 900, "y": 500, "innerR": 50, "outerR": 100 }),
            new RigidBackground(0, 0).makeShape("Tri", { "x": 1500, "y": 100, "width": 100, "height": 100, "dir": [-1, -1] }),
            new RigidBackground(0, 0).makeShape("Tri", { "x": 1500, "y": 300, "width": 200, "height": 100, "dir": [-1, -1] }),
            new RigidBackground(0, 0).makeShape("Tri", { "x": 1500, "y": 500, "width": 300, "height": 100, "dir": [-1, -1] }),
            new RigidBackground(0, 0).makeShape("Tri", { "x": 1500, "y": 700, "width": 400, "height": 100, "dir": [-1, -1] }),

            new BouncyBackground(0, 0, 30000).makeShape("Rect", { "x": 400, "y": 700, "width": 300, "height": 100 }),
            new BouncyBackground(0, 0, 30000).makeShape("Circle", { "x": 700, "y": 700, "rad": 50 }),
            new BouncyBackground(0, 0, 30000).makeShape("Donut", { "x": 900, "y": 700, "innerR": 20, "outerR": 50 }),
            new BouncyBackground(0, 0, 300000).makeShape("Donut", { "x": 1100, "y": 700, "innerR": 50, "outerR": 100 }),
            // new MovableObject(1000, 100, this.keyboard, this.mouse)
            // .makeShape("Tri", { "x": 1000, "y": 100, "dir": [1, 1], "rad": 50, "width": 80, "height": 40, "innerR": 20, "outerR": 45 }),
            new PlayerObject(1000, 100, this.keyboard, this.mouse),
        ].forEach(obj => {
            GameObject.system.add(obj);
        })

        this.visualizer = new Visualizer();
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

window.onload = () => { new Game(); }