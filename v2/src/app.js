import { Visualizer } from "./util/visualizer.js";
import { KeyboardManager, MouseManager } from "./util/inputManager.js";
import { PlayerObject } from "./entity/player.js";
import { MapObject } from "./entity/mapObject.js";
import { MissileObject } from "./entity/missile.js";

class GameObjectSystem {
    constructor() {
        this.objects = [];
        this.players = [];
        console.log(this.players);
        this.missiles = [];
        this.maps = [];
        this.backgrounds = [];

        this.visualizer = new Visualizer(this.objects);
    }

    extend(objects) {
        objects.forEach(object => { this.add(object) });
    }

    add(object) {
        this.objects.push(object);
        if (object instanceof PlayerObject) {
            this.players.push(object);
        } else if (object instanceof MissileObject) {
            this.missiles.push(object);
        } else if (object instanceof MapObject) {
            this.maps.push(object);
        } else if (object instanceof BackgroundObject) {
            this.backgrounds.push(object);
        }
    }

    remove(object) {
        var index = this.objects.indexOf(object);
        this.objects = this.objects.splice(index, 1);
        if (object instanceof PlayerObject) {
            var index = this.players.indexOf(object);
            this.players = this.players.splice(index, 1);
            console.log('123', this.players);
        } else if (object instanceof MissileObject) {
            var index = this.missiles.indexOf(object);
            this.missiles = this.missiles.splice(index, 1);
        } else if (object instanceof MapObject) {
            var index = this.maps.indexOf(object);
            this.maps = this.maps.splice(index, 1);
        } else if (object instanceof BackgroundObject) {
            var index = this.backgrounds.indexOf(object);
            this.backgrounds = this.backgrounds.splice(index, 1);
        }
    }

    update(dt) {
        console.log(this.players);
        this.players.forEach(player => {
            this.missiles.push(...player.popList);
            this.visualizer.extend(player.popList);
            player.popList = [];
            player.update(dt);
        });
        this.maps.forEach(map => { map.update(this.playerList); });
        this.missiles.forEach(missile => { missile.update(dt) });
        this.visualizer.draw();
    }
}

class Game {
    constructor() {
        this.fps = 10;

        this.keyboard = new KeyboardManager();
        this.mouse = new MouseManager();
        this.keyboard.activate();
        this.mouse.activate();

        this.objectSystem = new GameObjectSystem();
        this.objectSystem.extend([
            new PlayerObject(400, 400, 30, this.keyboard, this.mouse),
            new MapObject(300, 300, 100, 100, { healthChange: 5 }),
            new MapObject(500, 500, 100, 100, { healthChange: -5 }),
        ]);

        setInterval(this.objectSystem.update.bind(this, 1), Math.round(1000 / this.fps));
    }
}

window.onload = () => { new Game(); }