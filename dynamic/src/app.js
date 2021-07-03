import { Visualizer } from "./util/visualizer.js";
import { KeyboardManager, MouseManager } from "./util/inputManager.js";
import { PlayerObject } from "./entity/playerObject.js";
import { ShieldPanel, StrongAttackPanel, WeakAttackPanel } from "./entity/modifiedObject.js";
import { BouncyBackground, RigidBackground } from "./entity/mapObject.js";
import { GameObject } from "./entity/gameObject.js";

class Game {
    constructor() {
        this.fps = 30; // 10 TODO must not affect to game play except resolution of movement
        this.dt = 1 / this.fps;

        this.visualizer = new Visualizer();

        this.keyboard = new KeyboardManager();
        this.keyboard.activate();

        this.mouse = new MouseManager();
        this.mouse.activate();

        // Init
        new ShieldPanel(600, 700, 100, 100, 20);
        new WeakAttackPanel(300, 300, 100, 100, 20);
        new StrongAttackPanel(500, 500, 100, 100, 40);
        new RigidBackground(800, 100, 50, 200);
        new BouncyBackground(800, 500, 300, 200, 100000);
        new PlayerObject(400, 400, 30, this.keyboard, this.mouse);

        setInterval(this.update.bind(this), Math.round(1000/this.fps));
    }

    update() {
        var players = GameObject.system.get("PlayerObject") || [];
        var maps = GameObject.system.get("MapObject") || [];
        var projectiles = GameObject.system.get("ProjectileObject") || [];

        players.forEach(player => { player.update(this.dt); });
        maps.forEach(map => { map.update(this.dt, players); });
        projectiles.forEach(projectile => { projectile.update(this.dt, [...players, ...maps], this.visualizer) });
        this.visualizer.draw();
    }
}

window.onload = () => { new Game(); }