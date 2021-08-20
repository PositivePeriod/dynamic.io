// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code - key name
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key - key event

export class InputManager {
    keyboard: KeyboardManager;
    mouse: MouseManager;

    constructor(log = false) {
        this.keyboard = new KeyboardManager(log);
        this.mouse = new MouseManager(log);
    }

    toggle(): void {
        this.keyboard.toggle();
        this.mouse.toggle();
    }

    activate(): void {
        this.keyboard.activate();
        this.mouse.activate();
    }

    deactivate(): void {
        this.keyboard.deactivate();
        this.mouse.deactivate();
    }

    reset(): void {
        this.deactivate();
        this.activate();
    }
}

export class KeyboardManager {
    log: boolean;
    keyStatus: Map<string, boolean>;
    keyCallback: Map<string, () => void>;
    active: boolean;

    constructor(log = false) {
        this.log = log;

        this.keyStatus = new Map();
        this.keyCallback = new Map();
        this.active = false;

        window.addEventListener("keydown", this.handler.bind(this));
        window.addEventListener("keyup", this.handler.bind(this));
    }

    waitKeyUp(keycode = null): Promise<void> {
        // Have not used -> not verified in application
        return new Promise(function (resolve: () => void, reject: any) {
            window.addEventListener("keyup",
                function (e:KeyboardEvent) { if (keycode === null || keycode === e.code) { resolve(); } });
        }.bind(this));
    }

    isPressed(keyCode: string): boolean { return  this.keyStatus.get(keyCode) ?? false; }

    handler(e: KeyboardEvent): void {
        if (!this.active) { return; }
        if (this.log) { console.log(e.type, e.code); }
        switch (e.type) {
            case "keydown":
                this.keyStatus.set(e.code, true);
                if (this.keyCallback.has(e.code)) {
                    if (this.log) { console.log("listen", e.code); }
                    this.keyCallback.get(e.code)!();
                }
                break;
            case "keyup":
                this.keyStatus.set(e.code, false);
                break;
            default:
                break;
        }
    }

    listen(keyCode: string, callback: () => void): void { this.keyCallback.set(keyCode, callback); }

    toggle(): void { if (this.active) { this.deactivate(); } else { this.activate(); } }

    activate():void { this.active = true; }

    deactivate():void {
        this.keyStatus = new Map();
        this.active = false;
    }
}

type NullOrNum = number | null;
type pos = { "x": NullOrNum, "y": NullOrNum };

export class MouseManager {
    log: boolean;
    mouseCallback: Map<string, (upPos:pos, downPos?:pos) => void>;
    pos: pos;
    upPos: pos;
    downPos: pos;
    isPressed: boolean;
    active: boolean;

    constructor(log = false) {
        this.log = log;
        this.mouseCallback = new Map();
        this.pos = { "x": null, "y": null };
        this.upPos = { "x": null, "y": null };
        this.downPos = { "x": null, "y": null };
        this.isPressed = false;
        this.active = false;

        // window.addEventListener("mousemove", this.handler.bind(this));
        window.addEventListener("mousedown", this.handler.bind(this));
        window.addEventListener("mouseup", this.handler.bind(this));
    }

    waitMouseUp(): Promise<Object<string, pos>> {
        return new Promise(function (resolve: (arg0: { downPos: pos; upPos: pos; }) => void, reject: any): {downPos: pos; "upPos": pos;} {
            window.addEventListener("mouseup",
                function () { resolve({ "downPos": this.downPos, "upPos": this.upPos }); }.bind(this));
        }.bind(this));
    }

    handler(e: MouseEvent): void {
        if (!this.active) { return; }
        const x = e.offsetX;
        const y = e.offsetY;
        if (this.log) { console.log(e.type, x, y); }
        switch (e.type) {
            case "mousemove":
                this.pos = { "x": x, "y": y };
                break;
            case "mousedown":
                this.downPos = { "x": x, "y": y };
                this.isPressed = true;
                if (this.mouseCallback.has(e.type)) { this.mouseCallback.get(e.type)!(this.downPos); }
                break;
            case "mouseup":
                this.upPos = { "x": x, "y": y };
                this.isPressed = false;
                if (this.mouseCallback.has(e.type)) { this.mouseCallback.get(e.type)!(this.downPos, this.upPos); }
                break;
            case "click":
                break;
            case "dbclick":
                break;
            default:
                break;
        }
    }

    listen(eventType: string, callback: ())) { this.mouseCallback.set(eventType, callback); }

    toggle() { if (this.active) { this.deactivate(); } else { this.activate(); } }

    activate() { this.active = true; }

    deactivate() {
        this.pos = { "x": null, "y": null };
        this.downPos = { "x": null, "y": null };
        this.isPressed = false;
        this.active = false;
    }
}