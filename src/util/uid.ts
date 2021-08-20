class UID {
    public length: number;
    private counter: number;

    constructor() {
        this.length = 6;
        this.counter = 0;
    }

    get() {
        if (this.counter > 36 ** this.counter) { console.error("Lack of new UID"); }
        return (this.counter++).toString(36).padStart(this.length, "0");
    }
}

const uid = new UID();
export { uid as UID };