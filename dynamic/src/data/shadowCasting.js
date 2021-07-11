import { Visualizer } from "../util/visualizer.js";
import { KeyboardManager, MouseManager } from "../util/inputManager.js";
import { PlayerObject } from "../entity/playerObject.js";
import { GameObject } from "../entity/gameObject.js";
import { RigidBackground } from "../entity/mapObject/rigidBg.js";
import { OrthogonalVector, Line, getTrianglePoints, segmentInFrontOf } from "../util/vector.js";

import { mapData } from "./map/map1.js"

export class Game {
    constructor() {
        this.fps = 10;
        this.dt = 1 / this.fps;

        this.visualizer = new Visualizer();
        this.initGameObjects();
        setInterval(this.update.bind(this), Math.round(1000 / this.fps));
    }

    initGameObjects() {
        var stageWidth = this.visualizer.stageWidth;
        var stageHeight = this.visualizer.stageHeight;
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;
        this.gridSize = Math.min(stageWidth / this.mapWidth, stageHeight / this.mapHeight) * 0.6;
        this.startX = (stageWidth - this.gridSize * this.mapWidth) / 2;
        this.startY = (stageHeight - this.gridSize * this.mapHeight) / 2;

        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                var blockType = mapData.map[y][x].slice(0, 1);
                var posX = this.startX + this.gridSize * (x + 0.5);
                var posY = this.startY + this.gridSize * (y + 0.5);
                switch (blockType) {
                    case "W":
                        var block = new RigidBackground(0, 0).makeShape("Rect", { "x": posX, "y": posY, "width": this.gridSize, "height": this.gridSize });
                        GameObject.system.add(block);
                        break;
                    case "S":
                        this.keyboard = new KeyboardManager();
                        this.mouse = new MouseManager();
                        var player = new PlayerObject(posX, posY, this.keyboard, this.mouse, { "rad": this.gridSize * 0.4 });
                        GameObject.system.add(player);
                        break;
                    case "F":
                    default:
                        break;
                }
            }
        }
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
        this.rayTracing();
    }

    rayTracing() {
        var center = GameObject.system.find("PlayerObject")[0].pos;

        var walls = [];
        GameObject.system.find("MapObject").forEach(obj => {
            var p1 = new OrthogonalVector(obj.pos.x - obj.width / 2, obj.pos.y - obj.height / 2);
            var p2 = new OrthogonalVector(obj.pos.x - obj.width / 2, obj.pos.y + obj.height / 2);
            var p3 = new OrthogonalVector(obj.pos.x + obj.width / 2, obj.pos.y - obj.height / 2);
            var p4 = new OrthogonalVector(obj.pos.x + obj.width / 2, obj.pos.y + obj.height / 2);
            walls.push(...[new Line(p1, p3), new Line(p1, p2), new Line(p3, p4), new Line(p2, p4)]);
        })
        var endpoints = [];
        walls.forEach(wall => {
            wall.setCenter(center);
            endpoints.push(wall.p1, wall.p2);
        })

        var endPointCompare = (p1, p2) => {
            if (p1.centeredTheta > p2.centeredTheta) return 1;
            if (p1.centeredTheta < p2.centeredTheta) return -1;
            if (!p1.beginSegment && p2.beginSegment) return 1;
            if (p1.beginSegment && !p2.beginSegment) return -1;
            return 0;
        }
        endpoints.sort(endPointCompare);

        let openSegments = [];
        let output = [];
        let beginAngle = 0;

        for (let pass = 0; pass < 2; pass += 1) {
            for (let i = 0; i < endpoints.length; i += 1) {
                let endpoint = endpoints[i];
                let openSegment = openSegments[0];

                if (endpoint.beginSegment) {
                    var segment = openSegments.find(segment => { return !segment || !segmentInFrontOf(endpoint.segment, segment, center) });

                    // push
                    if (!segment) {
                        openSegments.push(endpoint.segment);
                    } else {
                        var index = openSegments.indexOf(segment);
                        openSegments.splice(index, 0, endpoint.segment);
                    }
                } else {
                    // remove
                    var index = openSegments.indexOf(endpoint.segment)
                    if (index > -1) openSegments.splice(index, 1);
                }

                if (openSegment !== openSegments[0]) {
                    if (pass === 1) {
                        var trianglePoints = getTrianglePoints(center, beginAngle, endpoint.centeredTheta, openSegment);
                        output.push(trianglePoints);
                    }
                    beginAngle = endpoint.centeredTheta;
                }
            }
        }
        output.forEach(points => {
            this.visualizer.drawPolygon([center, points[0], points[1]], "rgba(0, 0, 0, 0.5)");
        })
    }
}