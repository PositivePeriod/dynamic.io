export class PolarVector {
    static rLimit = 1e-12;

    constructor(r, theta) {
        this.r = r || 0;
        this.theta = theta || 0;
        this.checkRange();
        this.checkZero();
    }

    get r2() {
        return this.r ** 2;
    }

    get x() {
        return this.r * Math.cos(this.theta);
    }

    get y() {
        return this.r * Math.sin(this.theta);
    }

    checkRange() {
        if (this.r < 0) {
            this.r *= -1;
            this.theta += Math.PI;
        }
        this.theta %= 2 * Math.PI
    }

    checkZero() {
        if (this.r < PolarVector.rLimit) {
            this.r = 0
        }
    }

    toOrthogonal() {
        return new OrthogonalVector(this.x, this.y);
    }

    toPolar() {
        return this;
    }

    rotate(angle) {
        return PolarVector(this.r, this.theta + angle);
    }

    rotateBy(angle) {
        this.theta += angle;
        this.checkRange();
    }

    multiply(scalar) {
        return new PolarVector(this.r * scalar, this.theta);
    }

    multiplyBy(scalar) {
        this.r *= scalar;
        this.checkZero();
    }

    negaitve() {
        return new PolarVector(-this.r, this.theta);
    }

    normalize() {
        this.r = (this.r === 0) ? 0 : 1;
    }
}

export class OrthogonalVector {
    static rLimit = 1e-12;

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.checkZero();
    }

    get r() {
        return (this.x ** 2 + this.y ** 2) ** 0.5;
    }

    get r2() {
        return this.x ** 2 + this.y ** 2;
    }

    get theta() {
        return Math.atan2(this.y, this.x);
    }

    checkZero() {
        if (Math.abs(this.r) < OrthogonalVector.rLimit) {
            this.x = 0;
            this.y = 0;
        }
    }

    toPolar() {
        return new PolarVector(this.r, this.theta);
    }

    toOrthogonal() {
        return this;
    }

    add(other) {
        return new OrthogonalVector(this.x + other.x, this.y + other.y);
    }

    addBy(other) {
        this.x += other.x;
        this.y += other.y;
        this.checkZero();
    }

    minus(other) {
        return new OrthogonalVector(this.x - other.x, this.y - other.y);
    }

    minusBy(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.checkZero();
    }

    negative() {
        return new OrthogonalVector(-this.x, -this.y);
    }

    multiply(scalar) {
        return new OrthogonalVector(this.x * scalar, this.y * scalar);
    }

    multiplyBy(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.checkZero();
    }

}