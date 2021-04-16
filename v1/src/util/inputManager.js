export class KeyboardManager {
    constructor() {
        this.keyStatus = {};
        this.keyCallback = {};
    }

    isPressed(keyCode) {
        return keyCode in this.keyStatus ? this.keyStatus[keyCode] : false;
    }

    handler(e) {
        console.log(e.type, e.code);
        switch (e.type) {
            case 'keydown':
                this.keyStatus[e.code] = true;
                if (e.code in this.keyCallback) {
                    console.log('listen', e.code)
                    this.keyCallback[e.code]();
                }
                break;
            case 'keyup':
                this.keyStatus[e.code] = false;
                break;
            default:
                break;
        }
    }

    listen(keyCode, callback) {
        this.keyCallback[keyCode] = callback;
    }

    activate() {
        window.addEventListener('keydown', this.handler.bind(this));
        window.addEventListener('keyup', this.handler.bind(this));
    }

    deactivate() {
        window.removeEventListener('keydown', this.handler.bind(this));
        window.removeEventListener('keyup', this.handler.bind(this));
    }
}

export class MouseManager {
    constructor() {
        this.mouseCallback = {};
        this.x = null;
        this.y = null;
    }

    handler(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        console.log(e.type, x, y);
        switch (e.type) {
            case 'mousedown':
                this.x = x;
                this.y = y;
                if (e.type in this.mouseCallback) {
                    console.log('listen', e.code)
                    this.mouseCallback[e.type](x, y);
                }
                break;
            case 'mouseup':
                if (e.type in this.mouseCallback) {
                    console.log('listen', e.code)
                    this.mouseCallback[e.type](this.x, this.y, x, y);
                }
                break;
            case 'click':
                break;
            case 'dbclick':
                break;
            default:
                break;
        }
    }

    listen(eventType, callback) {
        this.mouseCallback[eventType] = callback;
    }

    activate() {
        window.addEventListener('mousedown', this.handler.bind(this));
        window.addEventListener('mouseup', this.handler.bind(this));
    }

    deactivate() {
        window.removeEventListener('mousedown', this.handler.bind(this));
        window.removeEventListener('mouseup', this.handler.bind(this));
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code - key name
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key - key event