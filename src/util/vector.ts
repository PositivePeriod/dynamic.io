function notZero(n: number): number {
    n = +n;  // Coerce to number.
    if (!n) {  // Matches +0, -0, NaN
        throw new Error("Invalid dividend " + n);
    }
    return n;
}

type vector = OrthogonalVector | PolarVector;

const calculatorMixin = function (Base) {
    return class extends Base {
        calc() { }
    };
};

class MixinBuilder {
    super : any;

    constructor(superClass:any) {
        this.super = superClass;
    }

    with(...mixins) { 
        return mixins.reduce((c, mixin) => mixin(c), this.super);
        // 위의 한줄은 아래의 코딩과 같은 내용이다.
        // return mixins.reduce(function(c, mixin){
        //     return mixin(c); // c -> this.superclass를 의미한다.
        // }, this.superclass) 
    }
}

let mix = (superclass) => new MixinBuilder(superclass);


export class Vector {
    x!: number;
    y!: number;
    r!: number;
    readonly r2!: number;
    theta!: number;
    multiply!: Function;

    static rLimit = 1e-6;
    static thetaLimit = 1e-6;
    static limit = 1e-4;

    inner(other: vector): number {
        return this.x * other.x + this.y * other.y;
    }

    innerAngle(other: vector): number {
        return Math.acos(this.inner(other) / notZero(this.r) / notZero(other.r));
    }

    scalarProjectTo(other: Vector): number {
        return (this.x * other.x + this.y * other.y) / notZero(other.r);
    }

    vectorProjectTo(other: Vector): Vector {
        return other.multiply((this.x * other.x + this.y * other.y) / notZero(other.r2));
    }

    normal(CCW = true): Vector {
        return new OrthogonalVector(CCW ? -this.y : this.y, CCW ? this.x : -this.x);
    }

    copy(): vector {
        if (this instanceof OrthogonalVector) {
            return new OrthogonalVector(this.x, this.y);
        } else {
            return new PolarVector(this.r, this.theta);
        }
    }

    interpolate(other: Vector, t: number): Vector {
        // this : other = t : 1-t
        return new OrthogonalVector(this.x * (1 - t) + other.x * t, this.y * (1 - t) + other.y * t);
    }

    same(other: Vector): boolean { return this.toOrthogonal().minus(other).r < Vector.rLimit; }

    parallel(other: Vector): boolean {
        return Math.abs((this.x * other.y - this.y * other.x) / notZero(this.r) / notZero(other.r)) < Vector.limit;
    }

}

export class PolarVector extends Vector {
    r: number;
    theta: number;

    constructor(r = 0, theta = 0) {
        super();
        this.r = r;
        this.theta = theta;
        this.checkRange();
        this.checkZero();
    }

    get r2(): number {
        return this.r ** 2;
    }

    get x(): number {
        return this.r * Math.cos(this.theta);
    }

    get y(): number {
        return this.r * Math.sin(this.theta);
    }

    checkRange(): void {
        if (this.r < 0) {
            this.r *= -1;
            this.theta += Math.PI;
        }
        this.theta %= 2 * Math.PI;
    }

    checkZero(): void {
        if (this.r < Vector.rLimit) { this.r = 0; }
    }

    toOrthogonal(): OrthogonalVector {
        return new OrthogonalVector(this.x, this.y);
    }

    toPolar(copy = false): PolarVector {
        return copy ? new PolarVector(this.r, this.theta) : this;
    }

    rotate(angle: number): PolarVector {
        return new PolarVector(this.r, this.theta + angle);
    }

    rotateBy(angle: number): void {
        this.theta += angle;
        this.checkRange();
    }

    multiply(scalar: number): PolarVector {
        return new PolarVector(this.r * scalar, this.theta);
    }

    multiplyBy(scalar: number): void {
        this.r *= scalar;
        this.checkZero();
    }

    negative(): PolarVector {
        return new PolarVector(-this.r, this.theta);
    }

    normalize(): void {
        this.r = (this.r === 0) ? 0 : 1;
    }
}

export class OrthogonalVector extends Vector {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
        this.checkZero();
    }

    get r(): number {
        return (this.x ** 2 + this.y ** 2) ** 0.5;
    }

    get r2(): number {
        return this.x ** 2 + this.y ** 2;
    }

    get theta(): number {
        return Math.atan2(this.y, this.x);
    }

    checkZero(): void {
        if (Math.abs(this.r) < Vector.rLimit) {
            this.x = 0;
            this.y = 0;
        }
    }

    toPolar(): PolarVector {
        return new PolarVector(this.r, this.theta);
    }

    toOrthogonal(copy = false): OrthogonalVector {
        return copy ? new OrthogonalVector(this.x, this.y) : this;
    }

    add(other: vector): OrthogonalVector {
        return new OrthogonalVector(this.x + other.x, this.y + other.y);
    }

    addBy(other: vector): void {
        this.x += other.x;
        this.y += other.y;
        this.checkZero();
    }

    minus(other: vector): OrthogonalVector {
        return new OrthogonalVector(this.x - other.x, this.y - other.y);
    }

    minusBy(other: vector): void {
        this.x -= other.x;
        this.y -= other.y;
        this.checkZero();
    }

    negative(): OrthogonalVector {
        return new OrthogonalVector(-this.x, -this.y);
    }

    multiply(scalar: number): OrthogonalVector {
        return new OrthogonalVector(this.x * scalar, this.y * scalar);
    }

    multiplyBy(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
        this.checkZero();
    }
}