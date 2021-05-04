import { Visualizer } from "./util/visualizer.js";
import { KeyboardManager, MouseManager } from "./util/inputManager.js";
import { PlayerObject } from "./entity/player.js";
import { MapObject } from "./entity/mapObject.js";

class Game {
    constructor() {
        this.fps = 10;

        this.visualizer = new Visualizer();

        this.keyboard = new KeyboardManager();
        this.keyboard.activate();

        this.mouse = new MouseManager();
        this.mouse.activate();

        this.mapList = [
            new MapObject(300, 300, 100, 100, { healthChange: 5 }),
            new MapObject(500, 500, 100, 100, { healthChange: -5 })
        ];
        this.playerList = [new PlayerObject(400, 400, 30, this.keyboard, this.mouse)];
        this.missileList = [];

        this.visualizer.extend(this.mapList);
        this.visualizer.extend(this.playerList);

        setInterval(this.update.bind(this, 1), Math.round(1000 / this.fps));
    }

    update(dt) {
        this.playerList.forEach(player => {
            this.missileList.push(...player.popList);
            this.visualizer.extend(player.popList);
            player.popList = [];
            player.update(dt);
        });
        this.mapList.forEach(map => { map.update(this.playerList); });
        this.missileList.forEach(missile => { missile.update(dt) });
        this.visualizer.draw();
    }
}

window.onload = () => { new Game(); }