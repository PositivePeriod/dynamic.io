import { Visualizer } from "./visualizer.js";
import {Player} from "./player.js";

class App {
    constructor() {
        this.visualizer = new Visualizer();

        this.player = new Player();
        this.visualizer.add(this.player);
        
        setInterval(this.update.bind(this, 1), 20) // ms
    }

    update(dt) {
        this.player.update(dt);
        this.visualizer.draw();
    }
}

window.onload = function() {
    new App();
}