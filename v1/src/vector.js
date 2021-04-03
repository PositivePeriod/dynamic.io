export class PolarVector {
    
    constructor(r = 0, theta = 0) {
        this.rLimit = 1e-12;
        this.r = r;
        this.theta = theta;
        this.checkZero();
    }

    get x() {
        return this.r * Math.cos(this.theta);
    }

    get y() {
        return this.r * Math.sin(this.theta);
    }

    checkZero() {
        if (this.r < this.rLimit) {
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
        this.theta = (this.theta + angle) % (2 * Math.PI);
    }

    multiply(scalar) {
        return new PolarVector(this.r * scalar, this.theta);
    }

    multiplyBy(scalar) {
        this.r *= scalar;
        this.checkZero();
    }

    normalize() {
        this.r = this.r === 0 ? 0 : 1;
    }
}

export class OrthogonalVector {
    constructor(x = 0, y = 0) {
        this.rLimit = 1e-12;
        this.x = x;
        this.y = y;
        this.checkZero();

    }

    get r() {
        return (this.x ** 2 + this.y ** 2) ** 0.5;
    }

    get theta() {
        return Math.atan2(this.y, this.x);
    }

    checkZero() {
        if (this.r < this.rLimit) {
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

    multiply(scalar) {
        return new OrthogonalVector(this.x * scalar, this.y * scalar);
    }

    multiplyBy(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.checkZero();
    }

}