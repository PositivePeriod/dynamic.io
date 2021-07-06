import { SHAPE } from "../util/constant.js";
import { OrthogonalVector } from "../util/vector.js";

export class ObjectSystem {
    constructor() {
        this.objects = new Map();
    }

    add(obj) {
        obj.type.forEach(type => {
            if (this.objects.has(type)) {
                this.objects.get(type).push(obj);
            } else { this.objects.set(type, [obj]) }
        })
    }

    find(type) {
        return this.objects.get(type) || [];
    }

    remove(obj) {
        obj.type.forEach(type => {
            var group = this.objects.get(type);
            var idx = group.indexOf(obj);
            if (idx > -1) { group.splice(idx, 1); }
        })
    }

    // static findClosestAnyObject(target) { // TODO garbage? no use!
    //     var minimum = { d: float("inf"), obj: null };
    //     this.objects.forEach(group => {
    //         var minimal = this.findClosest(group, target);
    //         if (minimum.d > minimal.d) { // TOOD what if === ? (길이가 서로 같은 경우)
    //             minimum.d = minimal.d;
    //             minimum.obj = minimal.obj;
    //         };
    //     })
    //     return minimum
    // }

    // static findClosest(objects, target) {
    //     var minimum = { d: float("inf"), obj: null };
    //     objects.forEach(object => {
    //         var d = object.pos.minus(target.pos).r;
    //         if (minimum.d > d) { // TOOD what if === ? (길이가 서로 같은 경우)
    //             minimum.d = d;
    //             minimum.obj = object;
    //         };
    //     })
    //     return minimum
    // }

    static isCollided(obj1, obj2) {
        if (SHAPE.has(obj1.shape) && SHAPE.has(obj2.shape))
            if (SHAPE.get(obj1.shape).hierarchy <= SHAPE.get(obj2.shape).hierarchy) {
                var functionName = obj1.shape + obj2.shape;
                // console.log(functionName);
                return this[functionName](obj1, obj2);
            } else {
                var functionName = obj2.shape + obj1.shape;
                // console.log(functionName);
                return this[functionName](obj2, obj1);
            }
        else {
            console.error("Impossible object shape; ", obj1.shape, obj2.shape, obj1, obj2);
        }
    }

    static RectRect(rect1, rect2) {
        var minX = (rect1.width + rect2.width) / 2;
        var minY = (rect1.height + rect2.height) / 2;
        var curX = Math.abs(rect1.pos.x - rect2.pos.x);
        var curY = Math.abs(rect1.pos.y - rect2.pos.y)
        return minX >= curX && minY >= curY
    }

    static RectCircle(rect, circle) {
        var testX = circle.pos.x;
        var testY = circle.pos.y;
        var left = rect.pos.x - rect.width / 2;
        var right = rect.pos.x + rect.width / 2;
        var top = rect.pos.y - rect.height / 2;
        var bottom = rect.pos.y + rect.height / 2;

        if (circle.pos.x < left) { testX = left; } else if (circle.pos.x > right) { testX = right; }
        if (circle.pos.y < top) { testY = top; } else if (circle.pos.y > bottom) { testY = bottom; }
        var distance2 = (circle.pos.x - testX) ** 2 + (circle.pos.y - testY) ** 2;
        return distance2 <= circle.rad ** 2;
    }

    static RectDonut(rect, donut) {
        var pos = rect.pos.minus(donut.pos);
        if (pos.r2 < donut.innerR ** 2) {
            var x = Math.abs(pos.x) + rect.width / 2;
            var y = Math.abs(pos.y) + rect.height / 2;
            var r2 = x ** 2 + y ** 2;
            return r2 >= donut.innerR ** 2;
        } else if (pos.r2 > donut.outerR ** 2) {
            var pseudoCircle = { "pos": donut.pos, "rad": donut.outerR }
            return this.RectCircle(rect, pseudoCircle)
        } else {
            return true
        }
    }

    static CircleCircle(circle1, circle2) {
        var cur2 = (circle1.pos.x - circle2.pos.x) ** 2 + (circle1.pos.y - circle2.pos.y) ** 2;
        var min2 = (circle1.rad + circle2.rad) ** 2
        return min2 >= cur2;
    }

    static CircleDonut(circle, donut) {
        var pos = circle.pos.minus(donut.pos);
        if (pos.r2 < donut.innerR ** 2) {
            return pos.r + circle.rad >= donut.innerR;
        } else if (pos.r2 > donut.outerR ** 2) {
            return pos.r - circle.rad <= donut.outerR;
        } else {
            return true
        }
    }

    static DonutDonut(donut1, donut2) {
        var pos = donut2.pos.minus(donut1.pos);
        if (pos.r > donut1.outerR + donut2.outerR) {
            return false
        } else if (pos.r + donut2.outerR < donut1.innerR || pos.r + donut1.outerR < donut2.innerR) {
            return false
        } else {
            return true
        }
    }
    d

    static RectTri(rect, tri) {
        var pos = rect.pos.minus(tri.pos);
        var width = (rect.width + tri.width) / 2;
        var height = (rect.height + tri.height) / 2;
        if (width < Math.abs(pos.x) || height < Math.abs(pos.y)) {
            return false
        }
        var dir = new OrthogonalVector(tri.dir[0], tri.dir[1]).toPolar();
        dir.rotateBy(Math.PI / 2);
        var normal = new OrthogonalVector(dir.x * tri.width, dir.y * tri.height).toPolar();
        normal.rotateBy(-Math.PI / 2);
        var centerDistance = pos.scalarProjectTo(normal);
        var rectDistance = new OrthogonalVector(tri.dir[0] * rect.width / 2, tri.dir[1] * rect.height / 2).scalarProjectTo(normal);
        return rectDistance >= centerDistance
    }

    static CircleTri(circle, tri) {
        if (!this.RectCircle(tri, circle)) {
            return false
        }
        var pos = circle.pos.minus(tri.pos);
        var dir = new OrthogonalVector(tri.dir[0], tri.dir[1]).toPolar();
        dir.rotateBy(Math.PI / 2);
        var normal = new OrthogonalVector(dir.x * tri.width, dir.y * tri.height).toPolar();
        normal.rotateBy(-Math.PI / 2);
        var centerDistance = pos.scalarProjectTo(normal);
        return circle.rad >= centerDistance
    }

    static DonutTri(donut, tri) {
        var pos = tri.pos.minus(donut.pos);
        if (pos.r < donut.innerR) {
            var existCollidedVertex = [
                [-1, -1],
                [-1, 1],
                [1, -1]
            ].some(sign => {
                var dPos = new OrthogonalVector(sign[0] * tri.dir[0] * tri.width / 2, sign[1] * tri.dir[1] * tri.height / 2);
                return pos.add(dPos).r >= donut.innerR;
            });
            return existCollidedVertex
        } else if (pos.r > donut.outerR) {
            var pseudoCircle = { "pos": donut.pos, "rad": donut.outerR };
            return this.CircleTri(pseudoCircle, tri)
        } else {
            return true
        }
    }

    static TriTri(tri1, tri2) {
        if (!(this.RectTri(tri1, tri2) && this.RectTri(tri2, tri1))) {
            return false
        }
        if (tri1.dir[0] + tri2.dir[0] === 0 && tri1.dir[1] + tri2.dir[1] === 0) {
            var pos = tri2.pos.minus(tri1.pos);
            var dir = new OrthogonalVector(tri1.dir[0], tri1.dir[1]).toPolar();
            dir.rotateBy(Math.PI / 2);
            var normal = new OrthogonalVector(dir.x * tri1.width, dir.y * tri1.height).toPolar();
            normal.rotateBy(-Math.PI / 2);

            var rectDistance1 = pos.add(new OrthogonalVector(tri2.dir[0] * tri2.width / 2, -tri2.dir[1] * tri2.height / 2)).scalarProjectTo(normal);
            var rectDistance2 = pos.add(new OrthogonalVector(-tri2.dir[0] * tri2.width / 2, tri2.dir[1] * tri2.height / 2)).scalarProjectTo(normal);

            if (0 >= rectDistance1 && 0 >= rectDistance2) {return true}
            if (0 < rectDistance1 && 0 < rectDistance2) {return false}

            var pos = tri1.pos.minus(tri2.pos);
            var dir = new OrthogonalVector(tri2.dir[0], tri2.dir[1]).toPolar();
            dir.rotateBy(Math.PI / 2);
            var normal = new OrthogonalVector(dir.x * tri2.width, dir.y * tri2.height).toPolar();
            normal.rotateBy(-Math.PI / 2);
            var rectDistance3 = pos.add(new OrthogonalVector(tri1.dir[0] * tri1.width / 2, -tri1.dir[1] * tri1.height / 2)).scalarProjectTo(normal);
            var rectDistance4 = pos.add(new OrthogonalVector(-tri1.dir[0] * tri1.width / 2, tri1.dir[1] * tri1.height / 2)).scalarProjectTo(normal);

            return 0 >= rectDistance3 || 0 >= rectDistance4
        } else {
            return true
        }

    }
}