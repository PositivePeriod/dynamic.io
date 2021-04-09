import { Visualizer } from "./util/visualizer.js";
import { KeyboardManager } from "./util/inputManager.js";
import { Player } from "./entity/player.js";
import { MapObject } from "./entity/mapObject.js";

class Game {
    constructor() {
        this.visualizer = new Visualizer();

        this.keyboard = new KeyboardManager();
        this.keyboard.activate();

        this.mapList = [];
        var map1 = new MapObject(300, 300, 100, 100, 5);
        var map2 = new MapObject(500, 500, 100, 100, -5);
        this.mapList.push(map1);
        this.mapList.push(map2);
        this.mapList.forEach(map => { this.visualizer.add(map); });

        this.playerList = [];
        this.player = new Player(400, 400, 30, this.keyboard);
        this.playerList.push(this.player);
        this.playerList.forEach(map => { this.visualizer.add(map); });

        setInterval(this.update.bind(this, 1), 100) // ms
    }

    update(dt) {
        this.mapList.forEach(map => { map.update(this.playerList); });
        this.playerList.forEach(player => { player.update(dt); });
        this.visualizer.draw();
    }
}

window.onload = function() {
    new Game();
}