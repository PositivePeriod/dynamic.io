export class ObjectSystem {
    constructor() {
        this.objects = new Map();
        this.hierarchy = {
            "GameObject": ["MapObject", "PlayerObject", "ProjectileObject"],
            "MapObject": ["BouncyBackground", "RigidBackground", "Panel"],
            "Panel": ["ShieldPanel", "WeakAttackPanel", "StrongAttackPanel"],
        }
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
        var shapeCode = obj1.shape.slice(0, 1) + obj2.shape.slice(0, 1);
        switch (shapeCode) {
            case "RR":
                return this.RectRect(obj1, obj2);
            case "RC":
                return this.RectCircle(obj1, obj2);
            case "RD":
                return this.RectDonut(obj1, obj2);
            case "CR":
                return this.RectCircle(obj2, obj1); // Inverse
            case "CC":
                return this.CircleCircle(obj1, obj2);
            case "CD":
                return this.CircleDonut(obj1, obj2);
            case "DR":
                return this.RectDonut(obj2, obj1); // Inverse
            case "DC":
                return this.CircleDonut(obj2, obj1); // Inverse
            case "DD":
                return this.DonutDonut(obj1, obj2);
            default:
                console.error("Impossible object shape; ", obj.shape, obj);
                return null
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
            var testX = donut.pos.x;
            var testY = donut.pos.y;
            var left = rect.pos.x - rect.width / 2;
            var right = rect.pos.x + rect.width / 2;
            var top = rect.pos.y - rect.height / 2;
            var bottom = rect.pos.y + rect.height / 2;

            if (donut.pos.x < left) { testX = left; } else if (donut.pos.x > right) { testX = right; }
            if (donut.pos.y < top) { testY = top; } else if (donut.pos.y > bottom) { testY = bottom; }
            var distance2 = (donut.pos.x - testX) ** 2 + (donut.pos.y - testY) ** 2;
            return distance2 <= donut.outerR ** 2;
        } else { return true }
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
}